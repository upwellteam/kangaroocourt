angular
    .module('kangaroo.auth', [
        'kangaroo.base',
        'ngCookies'
    ])
    .config(configure);

configure.$inject = ['$stateProvider'];
function configure($stateProvider) {
    $stateProvider
        .state('login', {
            url: '/oauth/facebook',
            controller: 'OAuthController',
            controllerAs: 'self',
            template: 'Wait...'
        })
}
