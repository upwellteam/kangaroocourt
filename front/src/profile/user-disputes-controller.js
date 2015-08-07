angular
    .module('kangaroo.profile')
    .controller('UserDisputesController', UserDisputesController);

UserDisputesController.$inject = ['$http'];

function UserDisputesController($http) {
    var self = this;

    self.disputes = [];
    $http
        .get(`/api/disputes/my`)
        .success(function(result) {
            self.disputes = result;

            self.disputes.judging.forEach(function(dispute){
                dispute.votes = 0;
                dispute.Juries.forEach(function(jury) {
                    if (jury.vote != null) {
                        dispute.votes++;
                    }
                })
            });

            self.disputes.myCases.forEach(function(dispute){
                dispute.votes = 0;
                dispute.Juries.forEach(function(jury) {
                    if (jury.vote != null) {
                        dispute.votes++;
                    }
                })
            })

        })
        .catch(function(){
            console.log('error');
        })
}