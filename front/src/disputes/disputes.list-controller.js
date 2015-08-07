angular
    .module('kangaroo.disputes')
    .controller('DisputesListController', DisputesListController);

DisputesListController.$inject = ['$stateParams', 'Authentication', 'DisputesService'];

function DisputesListController($stateParams, Authentication, DisputesService) {
    var self = this;

    self.user = Authentication.getUser();
    self.disputes = [];

    DisputesService
        .loadDisputes($stateParams.category)
        .then((response) => {
            self.disputes = response;
            self.disputes.forEach(function(dispute){
                dispute.votes = 0;
                dispute.Juries.forEach(function(jury) {
                    if (jury.vote != null) {
                        dispute.votes++;
                    }
                })
            });
        })
        .catch(function(){
            console.log('error');
        })
}