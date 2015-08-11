angular
    .module('kangaroo.disputes')
    .controller('InviteJuriesController', InviteJuriesController);

function InviteJuriesController ($modalInstance, $http, dispute, user) {
    var self = this;

    self.dispute = dispute;
    self.user = user;

    self.dismiss = function () {
        $modalInstance.dismiss('cancel');
    };

    self.sendInvite = function(email){
        $http
            .post('/api/jury/invite', { email : email, dispute : dispute.id})
            .success((response) => {
                console.log(response);
                console.log('success');
                self.dismiss();
            })
            .error((err) => {
                console.log(err, status);
            });
    }
}