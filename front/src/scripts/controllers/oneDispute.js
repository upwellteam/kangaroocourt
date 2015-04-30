function DisputeOneController($http, $routeParams, $modal, $location, DisputesService, Authentication) {
    var self = this;

    self.user = Authentication.getUser();
    self.role = null;
    self.newComment = '';
    self.isVoted = false;

    var plaintiffValue = 0, defendantValue = 0;

    if ($location.search().invitation != null) {
        $modal.open({
            templateUrl: 'partials/modalAuth.html',
            controller: 'ModalAuth as modal',
            size: 'sm',
            backdrop : 'static'
        })
    }

    DisputesService
        .load($routeParams.id)
        .then((dispute) => {
            var Arguments = {};

            for(var i = 0; i <= dispute.Arguments.length-1; i++){
                if(dispute.Arguments[i].role == 'defendant') {
                    Arguments.defendant = dispute.Arguments[i];
                }
                if(dispute.Arguments[i].role == 'plaintiff') {
                    Arguments.plaintiff = dispute.Arguments[i];
                }
            }

            self.dispute = dispute;
            self.dispute.Arguments = Arguments;

            if (self.user && dispute.DefendantId == self.user.id) {
                self.role = 'defendant';
            }
            if (self.user && dispute.PlaintiffId == self.user.id) {
                self.role = 'plaintiff';
            }
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
        })
        .catch((err, status) => {
            console.log(err, status);
            $location.path('/404').replace();
        });

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

function InviteJuriesController ($modalInstance, $http, dispute, user) {
    var self = this;

    self.dispute = dispute;
    self.user = user;

    console.log(self.dispute)
    self.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    self.sendInvite = function(email){
        $modalInstance.dismiss('cancel');

        $http
            .post('/api/jury/invite', { email : email, dispute : dispute.id})
            .success(() => {
                console.log('success');
            })
            .error(() => {
                console.log(err, status);
            });
    }
}

angular
    .module('kangaroo')
    .controller('DisputeController', DisputeOneController)
    .controller('InviteJuriesController', InviteJuriesController);
