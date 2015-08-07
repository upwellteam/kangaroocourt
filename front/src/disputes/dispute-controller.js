angular
    .module('kangaroo.disputes')
    .controller('DisputeController', DisputeController);

DisputeController.$inject = ['dispute', '$http', '$modal', '$location', 'DisputesService', 'Authentication'];

function DisputeController(dispute, $http, $modal, $location, DisputesService, Authentication) {
    var self = this;

    this.user = Authentication.getUser();
    this.role = null;
    this.newComment = '';
    this.isVoted = false;

    this.dispute = dispute;

    if ($location.search().invitation != null) {
        $modal.open({
            templateUrl: 'partials/modalAuth.html',
            controller: 'ModalAuth as modal',
            size: 'sm',
            backdrop : 'static'
        })
    }

    self.dispute.Arguments.forEach((el) => {
        if(el.role == 'defendant') {
            self.dispute.Arguments.defendant = el;
        }
        if(el.role == 'plaintiff') {
            self.dispute.Arguments.plaintiff = el;
        }
    });

    if (self.user && self.dispute.DefendantId == self.user.id) {
        self.role = 'defendant';
    }
    if (self.user && self.dispute.PlaintiffId == self.user.id) {
        self.role = 'plaintiff';
    }

    var plaintiffValue = 0, defendantValue = 0;
    self.dispute.Juries.forEach(function(jury){
        if (jury.vote == 'plaintiff') {
            plaintiffValue++;
        }
        if (jury.vote == 'defendant') {
            defendantValue++;
        }
        if (self.user.id == jury.UserId) {
            self.role = 'jury';
            if (jury.vote != null) {
                self.isVoted = true;
            }
        }
    });
    self.plaintiffValue = plaintiffValue / (plaintiffValue + defendantValue) * 100;
    self.defendantValue = defendantValue / (plaintiffValue + defendantValue) * 100;

    self.deleteDispute = () => {
        DisputesService
            .del(self.dispute)
            .then(() => { $location.path(`/user/${self.user.id}`).replace(); })
    };

    self.saveArgument = (argument) => {
        $http
            .post('/api/argument', {
                dispute : self.dispute.id,
                argument : argument
            })
            .success(function(result) {
                self.dispute.Arguments[self.role] = result;
            })
            .catch((err, status) => {
                console.log(err, status);
            });
    };

    self.saveVote = (vote) => {
        self.isVoted = true;

        if (vote == 'plaintiff') {
            plaintiffValue++;
        }
        if (vote == 'defendant') {
            defendantValue++;
        }

        self.plaintiffValue = plaintiffValue / (plaintiffValue + defendantValue) * 100;
        self.defendantValue = defendantValue / (plaintiffValue + defendantValue) * 100;

        $http
            .post('api/jury/vote', {
                dispute : self.dispute.id,
                vote : vote
            })
            .success(function() {
                console.log('success')
            })
            .catch((err, status) => {
                console.log(err, status);
            })
    };

    self.addComment = (text) => {
        var user = self.user;

        $http
            .post('/api/comments', {
                dispute : self.dispute.id,
                text : text
            })
            .success((result) => {
                result.User = user;
                self.dispute.Comments.push(result);
                self.newComment = '';
            })
            .error(() => {
                console.log(err, status);
            })
    };

    self.removeComment = (id) => {
        $http
            .delete('/api/comments/'+id)
            .success(() => {
                var i = self.dispute.Comments.findIndex((el) => el.id == id);
                self.dispute.Comments.splice(i, 1);
            })
            .error(() => {
                console.log(err, status);
            })
    };

    self.inviteJuries = (dispute, user) => {
        $modal.open({
            templateUrl: 'partials/modalInvite.html',
            controller: 'InviteJuriesController as invite',
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
    }
}