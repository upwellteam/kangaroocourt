angular
    .module('kangaroo', [
        'ngRoute', 'ngCookies', 'ui.bootstrap', 'relativeDate'
    ])
    .config(($logProvider, $locationProvider, $routeProvider) => {
        $logProvider.debugEnabled(true);

        $locationProvider.html5Mode({
            enabled : true,
            requireBase : true,
            rewriteLinks : false
        });

        //
        //      Disputes
        //
        $routeProvider.when('/', {
            controller : 'FrontController as disputesCtrl',
            templateUrl: 'pages/disputes.html',
            resolve : {}
        });

        $routeProvider.when('/category/:alias', {
            controller : 'FrontController as disputesCtrl',
            templateUrl: 'pages/disputes.html',
            resolve : {}
        });

        $routeProvider.when('/user/:id', {
            controller : 'FrontController as disputesCtrl',
            templateUrl: 'pages/disputes.html',
            resolve : {}
        });

        $routeProvider.when('/disputes/:id', {
            controller : 'DisputeController as disputeCtrl',
            templateUrl: 'pages/disputes.html',
            resolve : {}
        });

        //
        //      Authentication
        //
        $routeProvider.when('/oauth/:provider', {
            controller : 'OAuthController',
            template: 'Wait...'
        });

        $routeProvider.when('/logout', {
            controller : 'LogoutController',
            template: 'Wait...'
        });

        $routeProvider.otherwise({ redirectTo: '/' });
    });
