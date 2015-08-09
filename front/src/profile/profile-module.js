angular
    .module('kangaroo.profile', [
        'kangaroo.base',
        'relativeDate'
    ])
    .config(configure);

configure.$inject = ['$stateProvider'];
function configure($stateProvider) {
    $stateProvider
        .state('profile', {
            abstract : true,
            url : '/profile',
            template : '<div ui-view></div>'
        })
        .state('profile.disputes', {
            url : '/disputes',
            templateUrl : 'profile/user-disputes-controller.html',
            controller : 'UserDisputesController',
            controllerAs : 'self'
        })
}