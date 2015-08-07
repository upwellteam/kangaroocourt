angular
    .module('kangaroo.disputes')
    .controller('DisputesListController', DisputesListController);

DisputesListController.$inject = ['$http', '$stateParams', 'Authentication'];

function DisputesListController($http, $stateParams, Authentication) {
    var self = this;

    self.user = Authentication.getUser();
    self.disputes = [];

    $http
        .get('/api/disputes', {
            params : $stateParams.category
                ? { category : $stateParams.category }
                : {}
        })
        .success(function(result) {
            self.disputes = result;
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