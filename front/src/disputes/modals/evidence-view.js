angular
    .module('kangaroo.disputes')
    .controller('EvidenceModalController', EvidenceModalController);

function EvidenceModalController (image) {
    var modal = this;
    modal.image = image;
}