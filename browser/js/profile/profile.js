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

app.controller('ProfileCtrl', function($scope, $state, loggedInUser, ProfileFactory, DashboardFactory, DatasetFactory) {

    $scope.user = loggedInUser

    // Function to add the uploaded file to the scope
    // This is separate from "uploadDataset" so the file can be sent with the metadata on form submission
    $scope.chooseFile = function(file) {
        $scope.file = file;
    }

    // Function to send the file and metadata to the factory and then back-end
    $scope.uploadDataset = function(metaData) {
        metaData.user = loggedInUser._id;
        ProfileFactory.uploadDataset($scope.file, metaData);
    }

    $scope.getAllDatasets = function(loggedInUser) {
        return ProfileFactory.getAllDatasets(loggedInUser)
            .then(usersDatasets => {
                $scope.datasets = usersDatasets;
            })
    }

    // BOBBY NOTE: We need to have $scope updated when datasets are removed
    $scope.removeDataset = function(datasetId) {
        DatasetFactory.removeDataset(datasetId)
        .then(function(response) {
            console.log(response);
        });
    }

    $scope.getAllDashboards = function(loggedInUser) {
        return ProfileFactory.getAllDashboards(loggedInUser)
            .then(usersDashboards => {
                $scope.dashboards = usersDashboards;
            })
    }

    $scope.createDashboard = function(datasetId) {
        return DashboardFactory.create({user:$scope.user._id, dataset: datasetId, title: 'some Title', isPublic: true})
        .then(function(newDashboard){
            //render dashboard page
            $state.go('dashboard',{"dashboardId":newDashboard._id,"datasetId":newDashboard.dataset, userId:newDashboard.user});
            //$state.go('dashboard');
        });
    };

    //Toggle between dashboard and data-source views on profile
    $scope.dashboardsVisible = true;
    $scope.toggleView = function() {
        $scope.dashboardsVisible = !$scope.dashboardsVisible;
    }

});
