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

    editDispute(disputeId, data) {
        return $q(function(resolve, reject){
            $http
                .patch(`/api/disputes/${disputeId}`, data)
                .success(function(result) {
                    resolve(result);
                })
                .error((error, status) => { reject(error, status); })
        })
    }

    saveArgument(argument, disputeId) {
        return $q(function(resolve, reject){
            $http
                .post('/api/argument', {
                    disputeId : disputeId,
                    argument : argument
                })
                .success((result) => { resolve(result) })
                .error(() => { reject(); })
        })
    }

    saveComment(comment, disputeId) {
        return $q(function(resolve, reject){
            $http
                .post('/api/comments', {
                    dispute : disputeId,
                    text : comment
                })
                .success((result) => { resolve(result) })
                .error(() => { reject(); })
        })
    }

    removeComment(id) {
        return $q(function(resolve, reject){
            $http
                .delete('/api/comments/'+id)
                .success((result) => { resolve(result) })
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

    saveIntroState() {
        return $q(function(resolve, reject){
            $http
                .post('/api/intro', { state : true})
                .success(() => { resolve() })
                .error(() => { reject(); })
        })
    }

    getIntroStatus() {
        return $q(function(resolve, reject){
            $http
                .get('/api/intro')
                .success((result) => { resolve(result) })
                .error(() => { reject(); })
        })
    }

    vote(vote, disputeId) {
        return $q(function(resolve, reject){
            $http
                .post('/api/jury/vote', {
                    dispute : disputeId,
                    vote : vote
                })
                .success(() => { resolve() })
                .error(() => { reject(); })
        })
    }

}

DisputesService.$inject = ['$http', '$location', '$q'];

angular
    .module('kangaroo.disputes')
    .service('DisputesService', DisputesService);