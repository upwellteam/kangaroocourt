angular.module('kangaroo').directive('headerMenu', function($rootScope, $timeout, $modal, Authentication) {

    return {
        restrict: 'E',
        scope : {},
        templateUrl: '/partials/headerMenu.html',
        link : function(scope, elements, attrs) {
            $timeout(()=>{
                $rootScope.$watch('user', function(){
                    scope.user = Authentication.getUser();
                    scope.oauthLinks = Authentication.oAuthLinks();
                    scope.authenticated = Authentication.isAuthenticated();
                });
            }, 1);

            scope.user = Authentication.getUser();
            scope.oauthLinks = Authentication.oAuthLinks();
            scope.authenticated = Authentication.isAuthenticated();

            scope.createDispute = function() {
                let instance = $modal.open({
                    templateUrl: 'partials/modalNewDispute.html',
                    controller: 'ModalNewDisputeController as modal',
                    size: 'md'
                });
            }
        }
    };
});