function OAuthController($routeParams, $location, $timeout, Authentication) {
    let provider = $routeParams.provider;
    let code = $location.search().code;

    Authentication
        .oAuthExecute(provider, code)
        .then(function(result) {
            if (!result) { throw new Error('temp'); }

            $timeout(()=>{
                $location.url('/');
            }, 0);
        })
        .catch(function(err) {
            console.log(err);
        });
}

function LogoutController($location, $timeout, Authentication) {
    Authentication
        .logout()
        .then(()=>{
            $timeout(()=>{
                $location.url('/');
            }, 0);
        })
}

angular
    .module('kangaroo')
    .controller('OAuthController', OAuthController)
    .controller('LogoutController', LogoutController);