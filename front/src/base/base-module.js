angular
    .module('kangaroo.base', [
        'ui.router'
    ])
    .config(configure)
    .run(run);

configure.$inject = ['$locationProvider', '$stateProvider'];
function configure($locationProvider, $stateProvider) {
    $locationProvider.html5Mode({
        enabled : true,
        requireBase : true,
        rewriteLinks : true
    });

    $stateProvider
        .state('403', {
            url : '/403',
            template : '<h1>Unauthorised access</h1>',
            controller : 'function(){}'
        })
        .state('404', {
            url : '/404',
            template : '<h1>Page not found</h1>'
        })
        .state('500', {
            url : '/500',
            template : '<h1>Internal error</h1>'
        })
}

run.$inject = ['$state', '$rootScope'];
function run($state, $root) {
    $root.$state = $state;
}