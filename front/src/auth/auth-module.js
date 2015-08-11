angular
    .module('kangaroo.auth', [
        'kangaroo.base',
        'ngCookies'
    ])
    .config(configure)
    .run(run);

configure.$inject = ['$httpProvider', '$stateProvider'];
function configure($httpProvider, $stateProvider) {
    $httpProvider.interceptors.push('httpInterceptors');

    $stateProvider
        .state('oauth_callback', {
            url: '/oauth/:provider?code&?invitation',
            template : 'Redirecting..',
            controller : ['$location', '$state', '$stateParams', 'Authentication',
                function($location, $state, $stateParams, Authentication) {
                    Authentication
                        .oAuthExecute($stateParams.provider, $location.search().code, $location.search().invitation || null)
                        .then(() => {
                            // TODO: return to params
                            $state.go('disputes.list');
                        })
                        .catch(function(error){
                            console.log(error);
                        })
                }]
        })
}

run.$inject = ['Authentication'];
function run(Authentication) {
    Authentication.initialize();
}