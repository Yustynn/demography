app.config(function($stateProvider) {
    $stateProvider.state('profile', {
        url: '/:userId/profile',
        abstract: true,
        templateUrl: 'js/profile/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
            loggedInUser: function(AuthService, $stateParams) {
                return AuthService.getLoggedInUser()
                    .then(function(user) {
                        $stateParams.userId = user._id;
                        return user;
                    });
            },
            userDashboards: function(DashboardFactory, loggedInUser, $state) {
                return DashboardFactory.fetchAllByUser(loggedInUser._id)
                .then(dashboards => dashboards)
                .then(null, console.error);
            },
            userDatasets: function(DatasetFactory, loggedInUser) {
                return DatasetFactory.fetchAllByUser(loggedInUser._id)
                .then(datasets => datasets)
                .then(null, console.error);
            }
        }
    })
    .state('userDashboards', {
        parent: 'profile',
        url: '/dashboards',
        templateUrl: 'js/profile/profile-dashboards.html',
        controller: 'ProfileCtrl'
    })
    .state('userDatasets', {
        parent: 'profile',
        url: '/datasets',
        templateUrl: 'js/profile/profile-datasets.html',
        controller: 'ProfileCtrl'
    });

});

app.controller('ProfileCtrl', function($scope, $state, loggedInUser, userDashboards, userDatasets, DashboardFactory, DatasetFactory) {
    $scope.user = loggedInUser;
    $scope.userDashboards = userDashboards;
    $scope.userDatasets = userDatasets;

    // Function to add the uploaded file to the scope
    // This is separate from "uploadDataset" so the file can be sent with the metadata on form submission
    $scope.chooseFile = function(file) {
        $scope.file = file;
    }

    // Function to send the file and metadata to the factory and then back-end
    $scope.uploadDataset = function(metaData) {
        metaData.user = loggedInUser._id;
        DatasetFactory.create($scope.file, metaData)
        .then(function(response) {
            $scope.userDatasets.push(response.data);
        })
        .then(null, console.error);
    }

    $scope.removeDataset = function(dataset) {
        DatasetFactory.delete(dataset)
        .then(function(response) {
            var idx = $scope.userDatasets.indexOf(response.data);
            $scope.userDatasets.splice(idx, 1);
        })
        .then(null, console.error);
    }

    $scope.createDashboard = function(datasetId) {
        return DashboardFactory.create({user: $scope.user._id, dataset: datasetId, title: 'some Title', isPublic: true})
        .then(function(newDashboard){
            $state.go('dashboard', { userId: newDashboard.user, datasetId: newDashboard.dataset, dashboardId: newDashboard._id });
        });
    };

    $scope.removeDashboard = function(dashboard) {
        DashboardFactory.delete(dashboard)
        .then(function(response) {
            var idx = $scope.userDashboards.indexOf(response.data);
            $scope.userDashboards.splice(idx, 1);
        })
        .then(null, console.error);
    }
});
