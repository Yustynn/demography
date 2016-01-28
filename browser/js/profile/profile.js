app.config(function($stateProvider) {

    $stateProvider.state('profile', {
        url: '/:userId/profile',
        templateUrl: 'js/profile/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
            loggedInUser: function(AuthService, $stateParams) {
                return AuthService.getLoggedInUser()
                    .then(function(user) {
                        $stateParams.userId = user._id
                        return user
                    })
            }
        }
    });

});

app.controller('ProfileCtrl', function($scope, $state, loggedInUser) {

    $scope.user = loggedInUser.firstName + " " + loggedInUser.lastName

    // $scope.projects = DEFINE PROJECT FACTORY

});
