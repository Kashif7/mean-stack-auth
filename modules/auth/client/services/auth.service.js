angular.module('Auth').factory('AuthService', ['$http', '$window', AuthService]);

function AuthService($http, $window) {
    return {
        registration: registration,
        login: login,
        logout: logout,
        currentUser: currentUser,
        isLoggedIn: isLoggedIn
    }

    function registration(cred) {
        $http.post('/auth/register', cred).then(response => {
            saveToken(response.data);
        }).catch(response => {
            console.log(response);
        });
    }

    function login(cred) {
        $http.post('/auth/login', cred).then(response => {
            saveToken(response.data);
        }).catch(response => {
            console.log(response);
        });
    }

    function logout() {
        $window.localStorage.removeItem('mean-token');
    }

    function isLoggedIn() {
        let token = getToken();
        let payload;

        if (token) {
            payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    }

    function currentUser() {
        if (isLoggedIn()) {
            let token = getToken();
            let payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            return {
                userId: payload.id,
                fullname: payload.fullname
            };
        }
    }

    function saveToken(token) {
        $window.localStorage['mean-token'] = token;
    }

    function getToken() {
        return $window.localStorage['mean-token'];
    }
}