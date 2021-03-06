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

MenuDirectiveController.$inject = ['DISPUTE_CATEGORIES', '$modal', '$state', '$timeout', 'Authentication'];

function MenuDirectiveController(DISPUTE_CATEGORIES, $modal, $state, $timeout, Authentication) {
    var self = this;

    this.Authentication = Authentication;
    this.user           = Authentication.user;
    this.oauthLinks     = Authentication.oAuthLinks();
    this.categories = DISPUTE_CATEGORIES.sort();

    $timeout(function(){
        self.user = Authentication.user;
    }, 2000);

    this.createDispute = () => {
        $modal.open({
            templateUrl: 'menu/modals/create-dispute-controller.html',
            controller: 'CreateDisputeController',
            controllerAs: 'modal',
            size: 'md'
        })
    };

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
}