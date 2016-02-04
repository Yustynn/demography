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

    // Initialize notice to user as false
    $scope.tellUserToCreateDataset = false;

    // Function to open up the modal for uploading a dataset
    $scope.openDatasetSettings = function (user, userDatasets) {
        $scope.tellUserToCreateDataset = false;

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
        // If the user tries to create a dashboard without a dataset, prompt them to upload one
        if ($scope.userDatasets.length === 0) $scope.tellUserToCreateDataset = true;
        else {
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
        }
    };

    $scope.removeDataset = function(dataset) {
        DatasetFactory.delete(dataset)
        .then(function(deletedDataset) {
            var userDatasetToDelete = $scope.userDatasets.filter(function(userDataset) {
                return userDataset._id === deletedDataset._id;
            })[0];
            var idx = $scope.userDatasets.indexOf(userDatasetToDelete);
            $scope.userDatasets.splice(idx, 1);
        })
        .then(null, console.error);
    };

    $scope.removeDashboard = function(dashboard) {
        DashboardFactory.delete(dashboard)
        .then(function(response) {
            var idx = $scope.userDashboards.indexOf(response.data);
            $scope.userDashboards.splice(idx, 1);
        })
        .then(null, console.error);
    };

    $scope.createDashboard = function(dataset) {
        return DashboardFactory.create({ user: $scope.user._id, dataset: dataset._id, title: dataset.title, shortDescription: dataset.shortDescription, isPublic: dataset.isPublic })
        .then(function(newDashboard){
            $state.go('dashboard', { userId: newDashboard.user, datasetId: newDashboard.dataset, dashboardId: newDashboard._id });
        });
    };

});
