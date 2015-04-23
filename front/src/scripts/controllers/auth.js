function OAuthController($routeParams, $location, Authentication) {
    let provider = $routeParams.provider;
    let code = $location.search().code;

    var state = {};

    $location
        .search().state
        .split(';')
        .forEach(function(param) {
            param = param.split(':');
            state[param[0]] = param[1];
        });

    Authentication
        .oAuthExecute(provider, code, state.invitation || null)
        .then(function(result) {
            if (!result) { throw new Error('temp'); }
            $location.url(state.returnto).replace();
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

function ModalAuth (Authentication) {
    this.Authentication = Authentication;
}

angular
    .module('kangaroo')
    .controller('OAuthController', OAuthController)
    .controller('LogoutController', LogoutController)
    .controller('ModalAuth', ModalAuth);