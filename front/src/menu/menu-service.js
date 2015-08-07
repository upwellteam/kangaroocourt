var $q, $http;

class MenuService {
    constructor($$q, $$http) {
        $q = $$q;
        $http = $$http;

    }
}

MenuService.$inject = ['$q', '$http'];

angular
    .module('kangaroo.menu')
    .service('MenuService', MenuService);