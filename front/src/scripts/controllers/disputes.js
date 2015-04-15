function DisputeListController($http, $routeParams) {
    var self = this;

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
}

function DisputeOneController($http, $routeParams) {
    var self = this;
    
    $http
        .get(`/api/disputes/${$routeParams.id}`)
        .success(function(result) {
            self.dispute = result;
        })
}

function UserDisputeController($http, $routeParams) {
    var self = this;

    this.disputes = [];
    $http
        .get(`/api/user/${$routeParams.id}`)
        .success(function(result) {
            self.disputes = result;
        })
}

angular
    .module('kangaroo')
    .controller('FrontController', DisputeListController)
    .controller('DisputeController', DisputeOneController)
    .controller('UserDisputeController', UserDisputeController);