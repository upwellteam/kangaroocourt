function DisputeListController($http, $routeParams, Authentication) {
    var self = this;
    self.user = Authentication.getUser();
    this.disputes = [];
    $http
        .get('/api/disputes', {
            params : $routeParams.category
                ? { category : $routeParams.category }
                : {}
        })
        .success(function(result) {
            self.disputes = result;
        });
}

function DisputeOneController($routeParams, $location, DisputesService, Authentication) {
    var self = this;
    self.user = Authentication.getUser();
    DisputesService.load($routeParams.id)
        .then((dispute) => {
            console.log(dispute);
            self.dispute = dispute;
        })
        .catch((err, status) => {
            console.log(err, status);
            $location.path('/404').replace();
        });

    self.deleteDispute = () => {
        DisputesService
            .del(self.dispute)
            .then(() => { $location.path(`/user/${self.user.id}`).replace(); })
    };

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