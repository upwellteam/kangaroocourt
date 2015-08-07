angular.module('kangaroo.menu')
    .directive('menu', MenuDirective);

function MenuDirective() {
    return {
        restrict : 'E',
        templateUrl : '/menu/menu-directive.html',
        controller : MenuDirectiveController,
        controllerAs : 'self'
    }
}

MenuDirectiveController.$inject = ['DISPUTE_CATEGORIES', '$modal', 'Authentication', 'CommonService'];

function MenuDirectiveController(DISPUTE_CATEGORIES, $modal, Authentication, CommonService) {
    var self = this;

    this.categories = DISPUTE_CATEGORIES;
    this.CommonService = CommonService;

    this.createDispute = () => {
        $modal.open({
            templateUrl: 'menu/modals/create-dispute-controller.html',
            controller: 'CreateDisputeController',
            controllerAs: 'modal',
            size: 'md'
        })
    };

    this.user = Authentication.getUser();
    this.authenticated = Authentication.isAuthenticated();
    this.oauthLinks = Authentication.oAuthLinks();

    this.collapsedMenu = true;
    this.toggleCollapsedMenu = () => {
        self.collapsedMenu = !self.collapsedMenu
    };

    //$timeout(()=>{
    //    $rootScope.$watch('user', function(){
    //        scope.user = Authentication.getUser();
    //        scope.oauthLinks = Authentication.oAuthLinks();
    //        scope.authenticated = Authentication.isAuthenticated();
    //    });
    //}, 1);
    //
    //scope.mkActive = function(el) {
    //    if ($routeParams.category == el) {
    //        return "active";
    //    }
    //};
    //scope.mkActiveAll = function() {
    //    if ($location.path() == '/') {
    //        return "active";
    //    }
    //}
    //$scope.toggleDropdown = function($event) {
    //    $event.preventDefault();
    //    $event.stopPropagation();
    //    $scope.status.isopen = !$scope.status.isopen;
    //};
}