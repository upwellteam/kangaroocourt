var Interval, Timeout, location, state;

var DisputesService;

class CreateDisputeController {
    constructor(DISPUTE_CATEGORIES,
                $state,
                $modalInstance,
                $interval,
                $timeout,
                Authentication,
                $DisputesService
    ) {
        Interval = $interval;
        Timeout = $timeout;
        state = $state;
        DisputesService = $DisputesService;

        this.categories = DISPUTE_CATEGORIES;
        this.instance = $modalInstance;
        this.user = Authentication.user;

        // TEMP
        this.dispute = {
            name : 'Dispute name example',
            isPrivate : false,
            description : 'Dispute body example',
            bet : 15,
            category : 'love',
            defendant : {
                email : 'elizstiltzkin@gmail.com'
            }
        };
        // END TEMP
        //this.dispute = {
        //    name : '',
        //    isPrivate : false,
        //    description : '',
        //    bet : 15,
        //    category : 'love',
        //    defendant : {
        //        email : ''
        //    }
        //};
    }

    submit() {
        var self = this;
        DisputesService
            .create(self.dispute)
            .then(function(result){
                self.instance.close();
                state.go('disputes.single', { id : result.id });
            })
            .catch(() => {
                console.log('failed to create dispute');
                self.instance.close()
            });
    }

    close() {
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

CreateDisputeController.$inject = [
    'DISPUTE_CATEGORIES',
    '$state',
    '$modalInstance',
    '$interval',
    '$timeout',
    'Authentication',
    'DisputesService'
];

angular
    .module('kangaroo.menu')
    .controller('CreateDisputeController', CreateDisputeController);