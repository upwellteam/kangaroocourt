angular
    .module('kangaroo.common', [
        'ui.router'
    ])
    .config(configure);

configure.$inject = ['$stateProvider'];
function configure($stateProvider) {
    $stateProvider
        .state('front', {
            url : '/',
            template: '',
            controller : frontController
        });

    frontController.$inject = ['$state'];
    function frontController($state) {
        return $state.go("disputes.list({ category : 'all'})")
    }
}