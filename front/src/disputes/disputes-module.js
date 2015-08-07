angular
    .module('kangaroo.disputes', [
        'kangaroo.base'
    ])
    .config(configure);

configure.$inject = ['$stateProvider'];
function configure($stateProvider) {
    $stateProvider
        .state('disputes', {
            abstract : true,
            url : '/disputes',
            template : '<div ui-view></div>'
        })
        .state('disputes.list', {
            url : '/list/:category',
            templateUrl : 'disputes/disputes.list-controller.html',
            controller : 'DisputesListController',
            controllerAs : 'self'
        })
        .state('disputes.single', {
            url : '/:id',
            templateUrl : 'disputes/dispute-controller.html',
            controller : 'DisputeController',
            controllerAs : 'self',
            resolve : {
                dispute : [ '$stateParams', 'DisputesService', function($stateParams, DisputesService) {
                    return DisputesService.loadDispute($stateParams.id);
                }]
            }
        })
}