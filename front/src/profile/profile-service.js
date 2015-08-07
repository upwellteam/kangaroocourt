(function(){
    var $http, $q;

    class ProfileService {
        constructor($$http, $$q) {
            $http = $$http;
            $q = $$q;
        }

        loadDisputes(category) {
            return $q(function(resolve, reject){
                $http
                    .get('/api/disputes', {
                        params : category
                            ? { category : category }
                            : {}
                    })
                    .success(function(result) {
                        resolve(result);
                    })
                    .error((error, status) => { reject(error, status); })
            })
        }
    }

    ProfileService.$inject = ['$http', '$location', '$q'];

    angular
        .module('kangaroo.profile')
        .service('ProfileService', ProfileService);
})();