angular
    .module('kangaroo.disputes')
    .controller('InviteJuriesController', InviteJuriesController);

function InviteJuriesController ($modalInstance, $http, dispute, user) {
    var self = this;

    self.dispute = dispute;
    self.user = user;

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