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
                        return user;
                    });
            }
        }
    });

});

app.controller('ProfileCtrl', function($scope, $state, loggedInUser, ProfileFactory) {

    $scope.user = loggedInUser.firstName + " " + loggedInUser.lastName;

    $scope.chooseFile = function(file) {
        $scope.file = file;
    }

    $scope.submitProject = function(projectName) {
        var projectObj = {
            user: loggedInUser._id,
            title: projectName
        };

        ProfileFactory.submitProject($scope.file, projectObj);
    }

    // $scope.projects;

});
