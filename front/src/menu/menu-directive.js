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

MenuDirectiveController.$inject = [
    'DISPUTE_CATEGORIES',
    '$timeout',
    '$rootScope',
    '$modal',
    '$state',
    'Authentication',
    'CommonService'
];

function MenuDirectiveController(DISPUTE_CATEGORIES, $timeout, $rootScope, $modal, $state, Authentication, CommonService) {
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

    this.logout = () => {
        Authentication
            .logout()
            .then(() => {
                $state.go('front')
            })
            .catch((err) => {
                console.error(err);
                $state.go('front')
            })
    };
    $timeout(()=>{
        $rootScope.$watch('user', function(){
            self.user = Authentication.getUser();
            self.oauthLinks = Authentication.oAuthLinks();
            self.authenticated = Authentication.isAuthenticated();
        });
    }, 1);
}