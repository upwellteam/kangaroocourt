function DisputeListController($http) {
    var self = this;

    this.disputes = [];

    $http
        .get('/api/disputes')
        .success(function(result) {
            self.disputes = result;
        })
}

function DisputeOneController($routeParams, $http) {
    var self = this;
    
    $http
        .get(`/api/disputes/${$routeParams.id}`)
        .success(function(result) {
            console.log(result);
            self.dispute = result;
        })
}

angular
    .module('kangaroo')
    .controller('FrontController', DisputeListController)
    .controller('DisputeController', DisputeOneController);