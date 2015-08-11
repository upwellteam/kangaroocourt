angular
    .module('kangaroo.auth')
    .factory('httpInterceptors', httpInterceptorsFactory);

httpInterceptorsFactory.$inject = ['$injector', '$q'];

function httpInterceptorsFactory($injector, $q) {
    return {
        request : function(config) {
            let Authentication = $injector.get('Authentication');

            if (~ config.url.indexOf('/api') && Authentication.token) {
                config.headers.Authentication = Authentication.token.access_token;
            }

            return config;
        },
        responseError : function(response) {
            if (response.status != 403 || response.data.error != 'token_not_valid') {
                return;
            }

            var $http = $injector.get('$http'),
                $state = $injector.get('$state'),
                Authentication = $injector.get('Authentication'),
                deferred = $q.defer();

            if (! Authentication.isAuthenticated()) {
                return $state.go('auth.login');
            }

            Authentication
                .refreshToken()
                .then(() => {
                    return $http(response.config)
                })
                .then((response) => {
                    console.log(arguments);
                    deferred.resolve(response);
                })
                .catch(deferred.reject);

            return deferred.promise;
        }
    }
}
