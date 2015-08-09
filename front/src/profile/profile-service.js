var $http, $q;

class ProfileService {
    constructor($$http, $$q) {
        $http = $$http;
        $q = $$q;
    }

    loadDisputes() {
        return $q(function(resolve, reject){
            $http
                .get('/api/disputes/my')
                .success(function(result) {
                    result.judging.forEach(function(dispute){
                        dispute.votes = 0;
                        dispute.Juries.forEach(function(jury) {
                            if (jury.vote != null) {
                                dispute.votes++;
                            }
                        })
                    });
                    result.my.forEach(function(dispute){
                        dispute.votes = 0;
                        dispute.Juries.forEach(function(jury) {
                            if (jury.vote != null) {
                                dispute.votes++;
                            }
                        })
                    });
                    resolve(result);
                })
                .error((error, status) => { reject(error, status); })
        })
    }
}

ProfileService.$inject = ['$http', '$q'];

angular
    .module('kangaroo.profile')
    .service('ProfileService', ProfileService);