function DisputeListController($http) {
    var self = this;

    this.disputes = [];

    $http
        .get('/api/disputes')
        .success(function(result) {
            self.disputes = result;
            console.log(self.disputes);
        })
}

function DisputeOneController() {
    console.log('one');
}

angular
    .module('kangaroo')
    .controller('FrontController', DisputeListController)
    .controller('DisputeController', DisputeOneController);