angular
    .module('kangaroo', [
        'ngRoute', 'ngCookies', 'ui.bootstrap', 'relativeDate', 'uiSwitch'
    ])
    .constant('OAUTH_PROVIDERS', {
        facebook : {
            //client_id : '1430810303881868',
            //redirect_uri : 'http://kangaroo.loc:5000/oauth/facebook'

            client_id : '1620271311542333',
            redirect_uri : 'http://kangaroocourt.herokuapp.com/oauth/facebook'
        }
    })
    .constant('DISPUTE_CATEGORIES', [
        'Love', 'Animals', 'Kids', 'Money', 'Work', 'Health', 'Intimacy', 'Miscellaneous'
    ])
    .factory('httpInterceptors', ['$q', '$log', '$location', '$injector', function($q, $log, $location, $injector) {
        return {
            responseError : function(response) {
                if (response.status == 403 && response.data.error == 'token_not_valid') {
                    $log.error('Token not valid');

                    let Authentication = $injector.get('Authentication');

                    Authentication.clear().removeToken();

                    $location.path('/').replace();

                    return $q((resolve, reject) => reject());
                }

                if (response.status == 404) {
                    $log.error('404');
                    //TODO: Add custom handler
                }
            }
        }
    }])
    .config(($logProvider, $httpProvider, $locationProvider, $routeProvider) => {
        $logProvider.debugEnabled(true);

        $httpProvider.interceptors.push('httpInterceptors');

        $locationProvider.html5Mode({
            enabled : true,
            requireBase : true,
            rewriteLinks : false
        });

        //
        //      Disputes
        //
        $routeProvider.when('/', {
            routeName : 'frontPage',
            controller : 'FrontController as disputesCtrl',
            templateUrl: 'pages/disputes/list.html',
            resolve : {}
        });

        $routeProvider.when('/category/:category', {
            controller : 'FrontController as disputesCtrl',
            templateUrl: 'pages/disputes/list.html',
            resolve : {}
        });

        $routeProvider.when('/my', {
            controller : 'UserDisputeController as disputesCtrl',
            templateUrl: 'pages/disputes/myCases.html',
            resolve : {}
        });

        $routeProvider.when('/disputes/:id', {
            controller : 'DisputeController as ctrl',
            templateUrl: 'pages/disputes/one.html',
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

        $routeProvider.when('/404', {
            controller : function(){},
            template: '404'
        });

        $routeProvider.when('/500', {
            controller : function(){},
            template: '500'
        });

        $routeProvider.otherwise({ redirectTo: '/' });
    });
