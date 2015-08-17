var $http, $location, $q;

class DisputesService {
    constructor($$http, $$location, $$q) {
        $http = $$http;
        $location = $$location;
        $q = $$q;
    }

    create(dispute) {
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

    loadDispute(id) {
        return $q(function(resolve, reject){
            $http
                .get(`/api/disputes/${id}`)
                .success(function(result) {
                    resolve(result);
                })
                .error((error, status) => { reject(error, status); })
        })
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

    del(dispute) {
        return $q(function(resolve, reject){
            $http
                .delete(`/api/disputes/${dispute.id}`)
                .success(() => { resolve() })
                .error(() => { reject(); })
        })
    }

    deleteEvidence(id) {
        return $q(function(resolve, reject){
            $http
                .delete(`/api/dispute/evidence/${id}`)
                .success(() => { resolve() })
                .error(() => { reject(); })
        })
    }

}

DisputesService.$inject = ['$http', '$location', '$q'];

angular
    .module('kangaroo.disputes')
    .service('DisputesService', DisputesService);