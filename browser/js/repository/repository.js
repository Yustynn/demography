app.config(function($stateProvider) {

    $stateProvider.state('repository', {
        url: '/repository',
        templateUrl: 'js/repository/repository.html',
        controller: 'RepositoryCtrl',
        resolve: {
            loggedInUser: function(AuthService, $stateParams) {
                return AuthService.getLoggedInUser()
                    .then(function(user) {
                        $stateParams.userId = user._id
                        return user;
                    });
            }
        }
    });

});

app.controller('RepositoryCtrl', function($scope, $state, loggedInUser) {

    $scope.user = loggedInUser.firstName + " " + loggedInUser.lastName;

});
