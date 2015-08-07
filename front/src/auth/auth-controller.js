function OAuthController($stateParams, $location, Authentication) {
    let provider = 'facebook';
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

function ModalAuth (Authentication) {
    this.Authentication = Authentication;
}

OAuthController.$inject = ['$stateParams', '$location', 'Authentication'];

angular
    .module('kangaroo.auth')
    .controller('OAuthController', OAuthController)
    .controller('ModalAuth', ModalAuth);