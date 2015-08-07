class CommonService {
    constructor() {
    }

    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
}


CommonService.$inject = [];

angular
    .module('kangaroo.common')
    .service('CommonService', CommonService);
