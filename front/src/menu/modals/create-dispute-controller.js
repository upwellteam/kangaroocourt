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

        this.dispute = {
            isPrivate : false,
            description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
                'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in ' +
                'reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            bet : 15,
            category : 'love',
            defendant : {
                email : 'elizstiltzkin@gmail.com'
            }
        };
    }

    submit() {
        var self = this;

        self.dispute.name = self.dispute.description.slice(0, 30)+'...';
        DisputesService
            .create(self.dispute)
            .then(function(result){
                state.go('disputes.single', { id : result.id });
                self.instance.close()
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