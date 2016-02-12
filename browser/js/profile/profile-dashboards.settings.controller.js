app.controller('ProfileDashboardsSettingsCtrl', function ($scope, $timeout, $rootScope, $state, $uibModalInstance, user, userDatasets, currentDashboard, DashboardFactory) {

    $scope.user = user;
    $scope.userDatasets = userDatasets;

    // editMode to controle UI for uploading a new dashboard vs updating an existing dashboard
    $scope.editMode = false;
    $scope.dontChangeStates = false;

    // If editing an existing dashboard, pre-populate the metadata
    if (currentDashboard) {
        $scope.editMode = true;
        $scope.newDashboard = {
            title: currentDashboard.title,
            shortDescription: currentDashboard.shortDescription,
            isPublic: currentDashboard.isPublic,
            dataset: currentDashboard.dataset
        }
    }

    $scope.dismiss = function() {
        $scope.dontChangeStates = true;
        $uibModalInstance.dismiss();
    };

    $scope.createDashboard = function(newDashboard) {
        // Prevent "createDashboard" from being Inadvertently called after the cancel button is clicked
        if ($scope.dontChangeStates) {
            $scope.dontChangeStates = false;
            return;
        };

        // If a new dashboard, use create route, otherwise use update
        if (!$scope.editMode) {
            DashboardFactory.create({ user: $scope.user._id, dataset: newDashboard.dataset._id, title: newDashboard.title, shortDescription: newDashboard.shortDescription, isPublic: newDashboard.isPublic })
            .then(function(addedDashboard){
                $uibModalInstance.close();
                $state.go('dashboard', { userId: addedDashboard.user, datasetId: addedDashboard.dataset, dashboardId: addedDashboard._id });
            });
        } else {
            DashboardFactory.update({ dataset: newDashboard.dataset._id, title: newDashboard.title, shortDescription: newDashboard.shortDescription, isPublic: newDashboard.isPublic }, currentDashboard._id)
            .then(function(updatedDashboard){
                $uibModalInstance.close();
                $state.go('dashboard', { userId: updatedDashboard.user, datasetId: updatedDashboard.dataset, dashboardId: updatedDashboard._id });
            });
        }
    }

});
