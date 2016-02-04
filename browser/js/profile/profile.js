app.config(function($stateProvider) {
    $stateProvider.state('profile', {
        url: '/profile',
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

app.controller('ProfileCtrl', function($scope, $state, $uibModal, loggedInUser, userDashboards, userDatasets, DashboardFactory, DatasetFactory) {
    $scope.user = loggedInUser;
    $scope.userDashboards = userDashboards;
    $scope.userDatasets = userDatasets;

    // Function to open up the modal for uploading a dataset
    $scope.openDatasetSettings = function (user, userDatasets) {
        $uibModal.open({
            scope: $scope,
            templateUrl: 'js/profile/profile-datasets.settings.html',
            controller: 'ProfileDatasetsSettingsCtrl',
            resolve: {
                user: function() {
                    return user;
                },
                userDatasets: function() {
                    return userDatasets;
                }
            }
        });
    };

    // Function to open up the modal for creating a dashboard
    $scope.openDashboardSettings = function (user, userDatasets) {
        $uibModal.open({
            scope: $scope,
            templateUrl: 'js/profile/profile-dashboards.settings.html',
            controller: 'ProfileDashboardsSettingsCtrl',
            resolve: {
                user: function() {
                    return user;
                },
                userDatasets: function() {
                    return userDatasets;
                }
            }
        });
    };

    $scope.removeDataset = function(dataset) {
        console.log("$scope.userDatasets at delete: ", $scope.userDatasets);
        console.log("dataset to delete: ", dataset);
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
