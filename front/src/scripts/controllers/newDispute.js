(function(){
    var Interval, Timeout, location;

    var DisputesService;

    class NewDisputeController {
        constructor(DISPUTE_CATEGORIES, $location, $modalInstance, $interval, $timeout, Authentication, $DisputesService) {
            Interval = $interval;
            Timeout = $timeout;
            location = $location;

            DisputesService = $DisputesService;


            this.categories = DISPUTE_CATEGORIES;

            this.instance = $modalInstance;
            this.user = Authentication.getUser();

            this.dispute = {
                name : '',
                description : '',
                bet : 15,
                category : 'Miscellaneous',
                defendant : {
                    email : ''
                }
            };
        }

        submit() {
            var self = this;

            DisputesService
                .create(this.dispute)
                .then(function(result){
                    self.instance.close();
                    location.path(`/disputes/${result.id}`);
                })
        }

        cancel() {
            this.instance.dismiss('cancel');
        }

        changeBet(value) {
            this.dispute.bet += value;
            if (this.dispute.bet > 100) { this.dispute.bet = 100; }
            if (this.dispute.bet < 0) { this.dispute.bet = 0; }
        }

        startChange(value) {
            var self = this;
            self.timeout = Timeout(()=>{
                self.interval = Interval(function(){
                    self.changeBet(value);
                }, 100)
            }, 500);
        }
        endChange() {
            Timeout.cancel(this.timeout);
            Interval.cancel(this.interval);
        }
    }

    NewDisputeController.$inject = ['DISPUTE_CATEGORIES', '$location', '$modalInstance', '$interval', '$timeout', 'Authentication', 'DisputesService'];

    angular
        .module('kangaroo')
        .controller('ModalNewDisputeController', NewDisputeController);
})();

