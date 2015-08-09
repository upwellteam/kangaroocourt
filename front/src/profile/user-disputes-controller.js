angular
    .module('kangaroo.profile')
    .controller('UserDisputesController', UserDisputesController);

UserDisputesController.$inject = ['ProfileService'];

function UserDisputesController(ProfileService) {
    var self = this;

    self.disputes = [];
    ProfileService
        .loadDisputes()
        .then((result) => {
            self.disputes = result;
            console.log(self.disputes);
        })
        .catch(function(){
            console.log('error');
        })
}