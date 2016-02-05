app.controller('ProfileDashboardsSettingsCtrl', function ($scope, $timeout, $rootScope, $state, $uibModalInstance, user, userDatasets, DashboardFactory) {

    $scope.user = user;
    $scope.userDatasets = userDatasets;

    $scope.dismiss = function() {
        $uibModalInstance.dismiss();
    };

    $scope.createDashboard = function(newDashboard) {
        return DashboardFactory.create({ user: $scope.user._id, dataset: newDashboard.dataset._id, title: newDashboard.title, shortDescription: newDashboard.shortDescription, isPublic: newDashboard.isPublic })
        .then(function(addedDashboard){
            $uibModalInstance.close();
            $state.go('dashboard', { userId: addedDashboard.user, datasetId: addedDashboard.dataset, dashboardId: addedDashboard._id });
        });
    }

});
