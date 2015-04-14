(function() {
    var OAUTH;

    var root,
        http,
        location,
        cookies,
        storage;

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
        }

        setToken(token) {
            console.log(token);
            storage.set('token', token);
            cookies.token = token;
        }

        getToken() {
            return storage.get('token');
        }

        removeToken() {
            storage.remove('token');
            console.log(cookies);
            cookies.token = null;
        }

        isAuthenticated() {
            return (this.getUser() !== null);
        }

        oAuthLinks() {
            return {
                facebook : `https://www.facebook.com/dialog/oauth?`+
                    `client_id=${OAUTH.facebook.client_id}&` +
                    `&redirect_uri=${OAUTH.facebook.redirect_uri}` +
                    `&scope=email`
            };
        }

        oAuthExecute(provider, code) {
            var self = this;

            if (! provider in OAUTH) {
                throw new Error('Unsupported oAuth provider');
            }

            return new Promise(function(resolve, reject){
                http
                    .get(`/api/oauth/${provider}?code=${code}`)
                    .success(function(response, status) {
                        console.log(response);

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
                .post('/logout')
                .then(function(){
                    self.removeToken();
                    self.clear();
                })
        }

        register(data) {
            var self = this;
            return http
                .post('/users', data)
                .then(function(response) {
                    self.setToken(response.token);
                    self.setUser(response.user);
                });
        }
    }

    //AuthService.$inject = ['$rootScope', '$http', '$location', '$cookies', 'Storage'];

    angular
        .module('kangaroo')
        .service('Authentication', AuthenticationService);
})();