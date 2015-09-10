angular
    .module('kangaroo.disputes')
    .controller('InviteJuriesController', InviteJuriesController);

function InviteJuriesController ($modalInstance, $http, dispute) {
    var modal = this;

    modal.dispute = dispute;

    modal.dismiss = function () {
        $modalInstance.dismiss('cancel');
    };

    modal.sendInvite = function(email){
        $http
            .post('/api/jury/invite', { email : email, dispute : dispute.id})
            .success(() => {
                modal.dispute.Juries.push({});
                modal.dismiss();
            })
            .error((err) => {
                console.log(err, status);
            });
    }
}