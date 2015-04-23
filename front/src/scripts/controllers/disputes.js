function DisputeListController($http, $routeParams, Authentication) {
    var self = this;
    self.user = Authentication.getUser();
    this.disputes = [];
    $http
        .get('/api/disputes', {
            params : $routeParams.category
                ? { category : $routeParams.category }
                : {}
        })
        .success(function(result) {
            self.disputes = result;
        })
        .catch(function(){
            console.log('error');
        })
}

function DisputeOneController($http, $routeParams, $modal, $location, DisputesService, Authentication) {
    var self = this;

    self.user = Authentication.getUser();
    self.role = null;
    self.newComment = '';

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
        var arg = {
            argument : argument,
            dispute : self.dispute.id
        };

        $http
            .post('/api/argument', arg)
            .success(function(result) {
                self.dispute.Arguments[self.role] = result;
            })
            .catch((err, status) => {
                console.log(err, status);
            })
    };

    self.inviteJuries = () => {
        $modal.open({
            templateUrl: 'partials/modalInvite.html',
            controller: 'InviteJuriesController as invite',
            size: 'sm'
        })
    };

    self.addComment = (text) => {
        var user = self.user,
            comment = {
                text : text,
                DisputeId : self.dispute.id,
                UserId : self.user.id
            };


        $http
            .post('/api/comments', comment)
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
            .success((result) => {
                var i = self.dispute.Comments.findIndex((el) => el.id == id);
                self.dispute.Comments.splice(i, 1);
            })
            .error(() => {
                console.log(err, status);
            })
    }
}

function UserDisputeController($http) {
    var self = this;

    this.disputes = [];
    $http
        .get(`/api/disputes/my`)
        .success(function(result) {
            self.disputes = result;
        })
}

function InviteJuriesController ($modalInstance) {
    var InviteJuries = this;

    this.list = [];

    this.addEmail = function() {
        InviteJuries.list.push(InviteJuries.email);
        InviteJuries.email = '';
    };

    this.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    this.sendInvite = function(){
        // TODO: send invitation
    }
}

angular
    .module('kangaroo')
    .controller('FrontController', DisputeListController)
    .controller('DisputeController', DisputeOneController)
    .controller('UserDisputeController', UserDisputeController)
    .controller('InviteJuriesController', InviteJuriesController);