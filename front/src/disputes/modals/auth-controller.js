function authModal (Authentication) {
    var modal = this;
    this.Authentication = Authentication;
    console.log(modal.Authentication);
}

angular
    .module('kangaroo.disputes')
    .controller('authModal', authModal);

authModal.$inject = ['Authentication'];