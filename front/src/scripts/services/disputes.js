(function(){
    var $http, $location, $q;

    class DisputesService {
        constructor($$http, $$location, $$q) {
            $http = $$http;
            $location = $$location;
            $q = $$q;
        }

        create(dispute) {
            // TODO: validate before submitting
            return $q(function(resolve, reject){
                $http
                    .post('/api/disputes', dispute)
                    .success((result) => {
                        resolve(result);
                    })
                    .error(() => {
                        console.log('services:dispute: failed to create dispute');
                        reject();
                    })
            });
        }

        load(id) {
            return $q(function(resolve, reject){
                $http
                    .get(`/api/disputes/${id}`)
                    .success(function(result) {
                        resolve(result);
                    })
                    .error((error, status) => { reject(error, status); })
            })
        }

        del(dispute) {
            return $q(function(resolve, reject){
                $http
                    .delete(`/api/disputes/${dispute.id}`)
                    .success(() => { resolve() })
                    .error(() => { reject(); })
            })
        }
    }

    DisputesService.$inject = ['$http', '$location', '$q'];

    angular
        .module('kangaroo')
        .service('DisputesService', DisputesService);
})();