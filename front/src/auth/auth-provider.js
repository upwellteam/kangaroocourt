angular
    .module('kangaroo.auth')
    .provider('Authentication', AuthenticationProvider);

function AuthenticationProvider() {
    this.$get = $get;

    $get.$inject = ['OAUTH_PROVIDERS', '$rootScope', '$location', '$q', '$timeout', '$http', 'Storage'];
    function $get(OAUTH_PROVIDERS, $root, location, $q, $timeout, $http, Storage) {
        class Authentication {
            constructor() {
                this.OAUTH = OAUTH_PROVIDERS;
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
                this.version = Date.now();
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
                var self = this,
                    deferred = $q.defer();

                if (this.tokenRefreshing) {
                    var unsubscribe = $root.$on('auth:token-refreshed', function(){
                        deferred.resolve();
                        unsubscribe();
                    });
                }

                this.tokenRefreshing = true;

                $http
                    .post('/api/refresh-token', { refresh_token : self.token.refresh_token})
                    .success((response) => {
                        this.setToken(response);
                        this.tokenRefreshing  = false;

                        $root.$emit('auth:token-refreshed');

                        deferred.resolve();
                    })
                    .error(console.error);

                return deferred.promise;
            }

            oAuthLinks() {
                var invitation = location.search().invitation;
                return {
                    facebook: `https://www.facebook.com/dialog/oauth?` +
                    `client_id=${this.OAUTH.facebook.client_id}` +
                    `&redirect_uri=${this.OAUTH.facebook.redirect_uri}` +
                    `&scope=email` +
                    `&state=returnto:${location.path()}`
                    + (invitation ? `;invitation:${location.search().invitation}` : '')
                };
            }

            oAuthExecute(provider, code, invitation) {
                var self = this, deferred = $q.defer();

                $http
                    .post(`/api/oauth/${provider}?code=${code}` + (invitation ? `&invitation=${invitation}` : ''))
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

                $http
                    .get('/api/logout')
                    .success(()=> {

                        self.clearUser();
                        self.clearToken();

                        $root.$emit('auth:logout-success');

                        deferred.resolve();
                    })
                    .error(()=> {
                        $root.$emit('auth:logout-error');

                        self.clearUser();
                        self.clearToken();

                        deferred.reject();
                    });

                return deferred.promise;
            }
        }

        return new Authentication();
    }
}