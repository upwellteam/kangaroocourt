function AddArgument($http, $routeParams, Authentication) {
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


angular
    .module('kangaroo')
    .controller('FrontController', AddArgument);