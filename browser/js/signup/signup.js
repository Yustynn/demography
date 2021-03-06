app.config(function($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl'
    });

});

app.controller('SignupCtrl', function($scope, AuthService, $state) {

    $scope.signup = {};
    $scope.error = null;

    $scope.sendSignup = function(signupInfo) {

        $scope.error = null;

        AuthService.signup(signupInfo).then(function() {
            $state.go('stream');
        }).catch(function() {
            $scope.error = 'That user already exists.';
        });

    };

});
