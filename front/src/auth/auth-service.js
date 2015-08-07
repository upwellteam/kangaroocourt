(function() {
    var OAUTH;

    var root, http, location, cookies, storage;

    class AuthenticationService {
        constructor(OAUTH_PROVIDERS, $rootScope, $http, $location, $cookies, Storage) {
            OAUTH = OAUTH_PROVIDERS;
            root = $rootScope;
            http = $http;
            location = $location;
            cookies = $cookies ;
            storage = Storage;
        }

        getUser() {
            var user;
            if (root.user)
                return root.user;
            if (user = storage.get('user'))
                return user;
            return null;
        }

        setUser(user) {
            storage.set('user', user);
            root.user = user;
        }

        clear() {
            root.user = null;
            storage.remove('user');
            return this;
        }

        setToken(token) {
            cookies.token = token;
            storage.set('token', token);
            return this;
        }

        getToken() {
            return storage.get('token');
        }

        removeToken() {
            storage.remove('token');
            cookies.token = null;
            return this;
        }

        isAuthenticated() {
            return (this.getUser() !== null);
        }

        oAuthLinks() {
            var invitation = location.search().invitation;
            return {
                facebook : `https://www.facebook.com/dialog/oauth?`+
                `client_id=${OAUTH.facebook.client_id}` +
                `&redirect_uri=${OAUTH.facebook.redirect_uri}` +
                `&scope=email`+
                `&state=returnto:${location.path()}`
                + (invitation ? `;invitation:${location.search().invitation}` : '')
            };
        }

        oAuthExecute(provider, code, invitation) {
            var self = this;
            if (! provider in OAUTH) {
                throw new Error('Unsupported oAuth provider');
            }

            return new Promise(function(resolve, reject){
                http
                    .get(`/api/oauth/${provider}?code=${code}` + (invitation ? `&invitation=${invitation}` : '') )
                    .success(function(response, status) {

                        if (status !== 200 || response.error) {
                            return reject(new Error(response.data.error));
                        }

                        self.setUser(response.user);
                        self.setToken(response.token);

                        resolve(true);
                    })
                    .error((err) => {
                        console.log(err);
                        reject(err)
                    })
            });
        }

        logout() {
            var self = this;
            return http
                .get(`/api/logout`)
                .then(function(){
                    self.removeToken();
                    self.clear();
                })
        }
    }

    AuthenticationService.$inject = [
        'OAUTH_PROVIDERS',
        '$rootScope',
        '$http',
        '$location',
        '$cookies',
        'Storage'];

    angular
        .module('kangaroo.auth')
        .service('Authentication', AuthenticationService);
})();