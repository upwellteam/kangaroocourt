function OAuthController($routeParams, $location, Authentication) {
    let provider = $routeParams.provider;
    let code = $location.search().code;

    Authentication
        .oAuthExecute(provider, code)
        .then(function(result) {
            if (!result) { throw new Error('temp'); }

            $location.url('/').replace();
        })
        .catch(function(err) {
            console.log(err);
        });
}

function LogoutController($location, Authentication) {
    Authentication
        .logout()
        .then(()=>{
            $location.url('/').replace();
        })
}

angular
    .module('kangaroo')
    .controller('OAuthController', OAuthController)
    .controller('LogoutController', LogoutController);