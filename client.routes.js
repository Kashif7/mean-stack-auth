function config($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            template: '<auth></auth>'
        })
        .otherwise({ redirectTo: '/' });

    // use the HTML5 History API
    // $locationProvider.html5Mode(true);
}

function run($rootScope, $location, AuthService) {
    $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
        if ($location.path() === '/' && !AuthService.isLoggedIn()) {
            $location.path('/');
        }
    });
}

angular
    .module('mean-app')
    .config(['$routeProvider', '$locationProvider', config])
    .run(['$rootScope', '$location', 'AuthService', run]);

