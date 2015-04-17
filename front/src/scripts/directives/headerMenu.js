angular.module('kangaroo')
    .directive('headerMenu', function($rootScope, $timeout, $modal, $routeParams, $location, Authentication, DISPUTE_CATEGORIES) {
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

                scope.categories = DISPUTE_CATEGORIES;
                scope.user = Authentication.getUser();
                scope.oauthLinks = Authentication.oAuthLinks();
                scope.authenticated = Authentication.isAuthenticated();

                scope.createDispute = function() {
                    let instance = $modal.open({
                        templateUrl: 'partials/modalNewDispute.html',
                        controller: 'ModalNewDisputeController as modal',
                        size: 'md'
                    });
                };

                scope.collapsedMenu = true;
                scope.toggleCollapsedMenu = () => {
                    scope.collapsedMenu = !scope.collapsedMenu
                };

                scope.mkActive = function(el) {
                    if ($routeParams.category == el) {
                        return "active";
                    }
                };
                scope.mkActiveAll = function() {
                    if ($location.path() == '/') {
                        return "active";
                    }
                }
            }
        }
    })
    .controller('dropdownCtrl', function ($scope) {
        $scope.toggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };
    });
