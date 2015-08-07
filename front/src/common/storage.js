class LocalStorage {
    constructor() {}

    get(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }

    contains() {

    }

    remove(key) {
        localStorage.removeItem(key);
    }

    clear() {

    }
}

LocalStorage.$inject = [];


angular
    .module('kangaroo.common')
    .service('Storage', LocalStorage);