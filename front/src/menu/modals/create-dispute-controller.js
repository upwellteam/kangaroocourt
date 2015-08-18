var Interval, Timeout, location, state, FileUploader;

var DisputesService;

class CreateDisputeController {
    constructor(DISPUTE_CATEGORIES,
                $state,
                $modalInstance,
                $interval,
                $timeout,
                $FileUploader,
                Authentication,
                $DisputesService
    ) {
        Interval = $interval;
        Timeout = $timeout;
        state = $state;
        DisputesService = $DisputesService;
        FileUploader = $FileUploader;

        this.categories = DISPUTE_CATEGORIES;
        this.instance = $modalInstance;
        this.user = Authentication.user;

        this.dispute = {
            name : 'Name',
            isPrivate : false,
            description : 'Description',
            bet : 15,
            category : 'love',
            defendant : {
                email : 'elizstiltzkin@gmail.com'
            }
        };

        var dispute = this.dispute;

        var uploader = this.uploader = new FileUploader({
            url : '/api/dispute/photo',
            method : 'POST',
            alias : 'photo',
            headers : { Authentication : Authentication.token.access_token },
            formData : [],
            removeAfterUpload : true,
            queueLimit : 1
        });
        this.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
    }

    submit() {
        var self = this,
            disputeId;

        DisputesService
            .create(self.dispute)
            .then(function(result){
                disputeId = result.id;

                self.uploader.onBeforeUploadItem = function(item) {
                    item.formData.push({ disputeId : result.id });
                };

                return self.uploader.uploadAll();
            })
            .then(function(){
                state.go('disputes.single', { id : disputeId });
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
    'FileUploader',
    'Authentication',
    'DisputesService'
];

angular
    .module('kangaroo.menu')
    .controller('CreateDisputeController', CreateDisputeController);