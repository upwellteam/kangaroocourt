function authModal (Authentication) {
    var modal = this;
    this.Authentication = Authentication;
}

angular
    .module('kangaroo.disputes')
    .controller('authModal', authModal);

authModal.$inject = ['Authentication'];