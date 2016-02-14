app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, AuthService, $state) {
    $scope.login = {};
    $scope.error = null;
    //does not get called from google button, only from login button
    $scope.sendLogin = function (loginInfo) {
        $scope.error = null;

        AuthService.login(loginInfo).then(function () {
            $state.go('stream');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

});
