app.controller('ProfileDashboardsSettingsCtrl', function ($scope, $timeout, $rootScope, $state, $uibModalInstance, user, userDatasets, currentDashboard, DashboardFactory) {

    $scope.user = user;
    $scope.userDatasets = userDatasets;

    // editMode to controle UI for uploading a new dashboard vs updating an existing dashboard
    $scope.editMode = false;

    // If editing an existing dashboard, pre-populate the metadata
    if (currentDashboard) {
        console.log("currentDashboard: ", currentDashboard);
        $scope.editMode = true;
        $scope.newDashboard = {
            title: currentDashboard.title,
            shortDescription: currentDashboard.shortDescription,
            isPublic: currentDashboard.isPublic,
            dataset: currentDashboard.dataset
        }
    }

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
