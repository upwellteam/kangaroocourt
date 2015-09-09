angular
    .module('kangaroo.disputes')
    .controller('DisputeController', DisputeController);

DisputeController.$inject = ['CONFIG', 'dispute', 'FileUploader',
                             '$modal', '$state', '$location', '$scope', '$timeout',
                             'Authentication', 'DisputesService', 'CommonService'];

function DisputeController(CONFIG, dispute, FileUploader,
                           $modal, $state, $location, $scope, $timeout,
                           Authentication, DisputesService, CommonService) {
    var self = this;
    this.Authentication = Authentication;
    this.user = Authentication.user;
    this.MAX_EVIDENCE = CONFIG.max_evidence;
    this.dispute = dispute;

    this.collapse = {
        uploader : false
    };

    this.role = null;
    if (self.user && self.dispute.DefendantId == self.user.id) {
        self.role = 'defendant';
    }
    if (self.user && self.dispute.PlaintiffId == self.user.id) {
        self.role = 'plaintiff';
    }

    self.dispute.Arguments.forEach((el) => {
        if(el.role == 'defendant') {
            self.dispute.Arguments.defendant = el;
        }
        if(el.role == 'plaintiff') {
            self.dispute.Arguments.plaintiff = el;
        }
    });

    self.dispute.Evidences = {
        Plaintiff : [],
        Defendant : []
    };
    self.dispute.Evidence.forEach((el, i) => {
        if(el.UploaderId == self.dispute.PlaintiffId) {
            self.dispute.Evidences.Plaintiff.push(el);
        }
        if(el.UploaderId == self.dispute.DefendantId) {
            self.dispute.Evidences.Defendant.push(el);
        }
    });
    this.isVoted = false;

    var plaintiffValue = 0, defendantValue = 0;
    self.dispute.Juries.forEach(function(jury){
        if (jury.vote == 'plaintiff') {
            plaintiffValue++;
        }
        if (jury.vote == 'defendant') {
            defendantValue++;
        }
        if (self.user && self.user.id == jury.UserId) {
            self.role = 'jury';
            if (jury.vote != null) {
                self.isVoted = true;
            }
        }
    });
    self.plaintiffValue = Math.round(plaintiffValue / (plaintiffValue + defendantValue) * 100);
    self.defendantValue = Math.round(defendantValue / (plaintiffValue + defendantValue) * 100);

    var uploader = this.uploader = new FileUploader({
        url : '/api/dispute/evidence',
        method : 'POST',
        alias : 'evidence',
        headers : Authentication.token ? { Authentication : Authentication.token.access_token } : { },
        formData : [{ disputeId : self.dispute.id }],
        removeAfterUpload : true,
        queueLimit : CONFIG.max_evidence
    });

    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        self.dispute.Evidences[CommonService.capitalize(self.role)].push(response)
    };

    self.vote = (vote) => {
        DisputesService
            .vote(vote, self.dispute.id)
            .then(() => {
                self.isVoted = true;

                vote == 'plaintiff' ? plaintiffValue++ : '';
                vote == 'defendant' ? defendantValue++ : '';
                self.plaintiffValue = Math.round(plaintiffValue / (plaintiffValue + defendantValue) * 100);
                self.defendantValue = Math.round(defendantValue / (plaintiffValue + defendantValue) * 100);
            })
            .catch((err) => { console.log(err, status) })
    };

    self.saveArgument = (argument) => {
        DisputesService
            .saveArgument(argument, self.dispute.id)
            .then((result) => {
                self.dispute.Arguments[self.role] = result;
            })
            .catch((err) => {console.log(err, status)})
    };

    self.saveComment = (comment) => {
        DisputesService
            .saveComment(comment, self.dispute.id)
            .then((result) => {
                result.User = self.user;
                self.dispute.Comments.push(result);
                self.comment = '';
            })
            .catch((err) => { console.log(err, status) })
    };

    self.removeComment = (id) => {
        DisputesService
            .removeComment(id)
            .then(() => {
                var i = self.dispute.Comments.findIndex((el) => el.id == id);
                self.dispute.Comments.splice(i, 1);
            })
    };

    self.inviteJuries = (dispute, user) => {
        $modal.open({
            templateUrl: 'disputes/modals/invite-juries.html',
            controller: 'InviteJuriesController',
            controllerAs : 'modal',
            size: 'sm',
            resolve : {
                dispute: function(){
                    return dispute
                },
                user: function(){
                    return user
                }
            }
        })
    };

    self.viewEvidence = (image) => {
        $modal.open({
            templateUrl : 'disputes/modals/evidence-view.html',
            controller : 'EvidenceModalController',
            controllerAs : 'modal',
            size: 'md',
            windowClass : 'evidence-preview',
            resolve : {
                image: function () {
                    return image;
                },
                dispute : function () {
                    return self.dispute;
                }
            }
        })
    };

    if ($location.search().invitation != null) {
        $modal.open({
            templateUrl : 'disputes/modals/auth-controller.html',
            controller : 'authModal',
            controllerAs : 'modal',
            size: 'sm',
            backdrop : 'static'
        })
    }

    $scope.IntroOptions = {
        steps:[
            {
                element: '#step1',
                intro: "This is you.",
                position: 'top'
            },
            {
                element: '#step2',
                intro: "You can add you point of view here, so other people can judge.",
                position: 'right'
            },
            {
                element: '#step3',
                intro: 'Also, you can add some evidence photo here if you want.',
                position: 'right'
            },
            {
                element: '#step4',
                intro: "Invite friend to judge! You can invite only 5 friends to this case!",
                position: 'bottom'
            }
        ],
        showStepNumbers: false,
        showBullets: false,
        exitOnOverlayClick: false,
        exitOnEsc:true,
        nextLabel: '<span>NEXT</span>',
        prevLabel: '<span>PREVIOUS</span>',
        skipLabel: '<span>SKIP</span>',
        doneLabel: '<span>CLOSE</span>'
    };
    $scope.CompletedEvent = function () { DisputesService.saveIntroState() };

    $timeout(function(){
        if (self.user != null) {
            DisputesService
                .getIntroStatus()
                .then((result) => {
                    if (result == null) {
                        $scope.CallMe();
                    }
                })
        }
    }, 1000);

    // DEV
    self.log = () => { console.log(self.dispute) }
}