angular
    .module('kangaroo.disputes')
    .controller('EvidenceModalController', EvidenceModalController);

function EvidenceModalController ($modalInstance, image, dispute, DisputesService, Authentication) {
    var modal = this;

    modal.dispute = dispute;
    modal.image = image;
    modal.user = Authentication.user;

    modal.dismiss = function () {
        $modalInstance.dismiss('cancel');
    };
    modal.deleteEvidence = () => {
        DisputesService
            .deleteEvidence(modal.image.id)
            .then(() => {
                modal.dispute.Evidences.Plaintiff.forEach(function(el, i){
                    if (modal.image.id == el.id) {
                        modal.dispute.Evidences.Plaintiff.splice(i, 1);
                        modal.dismiss();
                    }
                });
                modal.dispute.Evidences.Defendant.forEach(function(el, i){
                    if (modal.image.id == el.id) {
                        modal.dispute.Evidences.Plaintiff.splice(i, 1);
                        modal.dismiss();
                    }
                });
            })
    };
}