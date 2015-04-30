function DisputeListController($http, $routeParams, Authentication) {
    var self = this;

    self.user = Authentication.getUser();
    self.disputes = [];

    $http
        .get('/api/disputes', {
            params : $routeParams.category
                ? { category : $routeParams.category }
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
            })
        })
        .catch(function(){
            console.log('error');
        })
}

function UserDisputeController($http) {
    var self = this;

    self.disputes = [];
    $http
        .get(`/api/disputes/my`)
        .success(function(result) {
            self.disputes = result;

            self.disputes.judging.forEach(function(dispute){
                dispute.votes = 0;
                dispute.Juries.forEach(function(jury) {
                    if (jury.vote != null) {
                        dispute.votes++;
                    }
                })
            });

            self.disputes.myCases.forEach(function(dispute){
                dispute.votes = 0;
                dispute.Juries.forEach(function(jury) {
                    if (jury.vote != null) {
                        dispute.votes++;
                    }
                })
            })

        })
        .catch(function(){
            console.log('error');
        })
}

angular
    .module('kangaroo')
    .controller('FrontController', DisputeListController)
    .controller('UserDisputeController', UserDisputeController);