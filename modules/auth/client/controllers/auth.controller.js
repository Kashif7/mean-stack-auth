angular.module('Auth').controller('AuthController',['AuthService',AuthController]);

function AuthController(AuthService) {
    let vm = this;

    vm.registration = registration;
    vm.login = login;

    AuthService.logout();

    function registration(cred) {
        AuthService.registration(cred);
    }

    function login(cred) {
        AuthService.login(cred);
    }
}