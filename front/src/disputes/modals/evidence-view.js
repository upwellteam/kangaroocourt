angular
    .module('kangaroo.disputes')
    .controller('EvidenceModalController', EvidenceModalController);

function EvidenceModalController ($modalInstance, image, dispute, DisputesService) {
    var modal = this;

    modal.dispute = dispute;
    modal.image = image;

    modal.deleteEvidence = () => {
        DisputesService
            .deleteEvidence(modal.image.id)
            .then(() => {
                console.log('success');
            })
    };
}