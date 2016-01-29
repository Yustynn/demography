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

    // Funtcion to add the uploaded file to the scope
    // This is separate from "uploadDataset" so the file can be sent with the metadata on form submission
    $scope.chooseFile = function(file) {
        $scope.file = file;
    }

    // Function to send the file and metadata to the factory and then back-end
    $scope.uploadDataset = function(metaData) {
        metaData.user = loggedInUser._id;
        ProfileFactory.uploadDataset($scope.file, metaData);
    }

    // $scope.projects;

});
