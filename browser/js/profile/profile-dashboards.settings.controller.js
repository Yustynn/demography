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

// Function to send the file and metadata to the factory and then back-end
// $scope.uploadDataset = function(metaData) {
//     // If a new dataset, use create route, otherwise use update
//     if (!$scope.editMode) {
//         metaData.user = user._id;
//         DatasetFactory.create($scope.file, metaData)
//         .then(function(response) {
//             $scope.userDatasets.push(response.data);
//             $uibModalInstance.close();
//             $state.go('userDatasets');
//         })
//         .then(null, console.error);
//     } else {
//         metaData.id = currentDataset._id;
//         DatasetFactory.update($scope.file, metaData)
//         .then(function(response) {
//             // Update the $scope array with the updated dataset
//             var userDatasetIndex = $scope.userDatasets.findIndex(userDataset => {
//                 return userDataset._id === response.data._id;
//             });
//             $scope.userDatasets[userDatasetIndex] = response.data;
//             $uibModalInstance.close();
//             $state.go('userDatasets');
//         })
//         .then(null, console.error);
//     }
// }
