angular
    .module('kangaroo.auth')
    .provider('Authentication', AuthenticationProvider);

function AuthenticationProvider() {
    this.$get = $get;

    $get.$inject = ['CONFIG', '$rootScope', '$location', '$q', '$timeout', '$http', 'Storage'];
    function $get(CONFIG, $root, location, $q, $timeout, $http, Storage) {
        class Authentication {
            constructor() {
                this.CONFIG = CONFIG;
                $root.Authentication = this;

                this.user = null;
                this.token = null;

                this.version = Date.now();

                this.tokenRefreshing = false;
            }

            initialize() {
                this.user = Storage.get('user');
                this.token = Storage.get('token');

                if (!this.isAuthenticated()) {
                    return;
                }

                if (!this.isTokenValid()) {
                    return this.refreshToken();
                }

                $timeout(() => this.refreshToken(), this.token.expires_in*1000);
            }

            setUser(user) {
                if (!this.user) {
                    this.user = user;
                } else {
                    this.user = angular.extend(this.user, user);
                }
                this.user.version = Date.now();
                Storage.set('user', this.user);
            }

            clearUser() {
                this.user = null;
                Storage.remove('user');
            }

            setToken(token) {
                this.token = token;

                Storage.set('token', token);
                Storage.set('token_expires', Date.now() + token.expires_in*1000);

                $timeout(() => this.refreshToken(), token.expires_in*1000);
            }

            clearToken() {
                this.token = null;
                Storage.remove('token');
                Storage.remove('token_expires');
            }

            isAuthenticated() {
                return (!! this.user);
            }

            isTokenValid() {
                return Storage.get('token_expires') > Date.now();
            }

            refreshToken() {
                var deferred = $q.defer();

                if (this.tokenRefreshing) {
                    var unsubscribe = $root.$on('auth:token-refreshed', function(){
                        deferred.resolve();
                        unsubscribe();
                    });
                }

                this.tokenRefreshing = true;

                $http
                    .post('/api/refresh-token', { refresh_token : this.token.refresh_token})
                    .success((response) => {
                        self.setToken(response.token);
                        self.tokenRefreshing  = false;

                        $root.$emit('auth:token-refreshed');

                        deferred.resolve();
                    })
                    .error((err) => {
                        console.warn(err);

                        self.clearUser();
                        self.clearToken();

                        deferred.reject(err);
                    });

                return deferred.promise;
            }

            oAuthLinks() {
                var invitation = location.search().invitation;
                return {
                    facebook: `https://www.facebook.com/dialog/oauth?` +
                    `client_id=${this.CONFIG.facebook_id}` +
                    `&redirect_uri=${this.CONFIG.facebook_uri}` +
                    `&scope=email` +
                    `&state=returnto:${location.path()}`
                    + (invitation ? `;invitation:${location.search().invitation}` : '')
                };
            }

            oAuthExecute(code, invitation) {
                var self = this, deferred = $q.defer();

                $http
                    .post(`/api/oauth/facebook?code=${code}` + (invitation ? `&invitation=${invitation}` : ''))
                    .success((response)=> {
                        self.setUser(response.user);
                        self.setToken(response.token);

                        $root.$emit('auth:login-success');

                        deferred.resolve(self.user);
                    })
                    .error(()=> {
                        $root.$emit('auth:login-error');

                        deferred.reject();
                    });

                return deferred.promise;
            }

            logout() {
                var self = this, deferred = $q.defer();

                $http({
                    method : 'GET',
                    url : '/api/logout',
                    ignoreInterceptors : true
                })
                    .then(()=>{
                        self.clearUser();
                        self.clearToken();

                        $root.$emit('auth:logout-success');

                        deferred.resolve();
                    })
                    .catch((err)=>{
                        $root.$emit('auth:logout-error');

                        self.clearUser();
                        self.clearToken();

                        deferred.reject(err);
                    });

                return deferred.promise;
            }
        }

        return new Authentication();
    }
}