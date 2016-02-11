app.controller('ProfileDatasetsSettingsCtrl', function ($scope, $timeout, $rootScope, $state, $uibModalInstance, user, userDatasets, currentDataset, DatasetFactory) {

    $scope.user = user;
    $scope.userDatasets = userDatasets;

    // editMode to controle UI for uploading a new dataset vs updating an existing dataset
    $scope.editMode = false;

    // If editing an existing dataset, pre-populate the metadata
    if (currentDataset) {
        $scope.editMode = true;
        $scope.metaData = {
            title: currentDataset.title,
            shortDescription: currentDataset.shortDescription,
            isPublic: currentDataset.isPublic
        }
    }

    $scope.dismiss = function() {
        $uibModalInstance.dismiss();
    };

    // Function to add the uploaded file to the scope
    // This is separate from "uploadDataset" so the file can be sent with the metadata on form submission
    $scope.chooseFile = function(file) {
        $scope.file = file;
    }

    // Function to send the file and metadata to the factory and then back-end
    $scope.uploadDataset = function(metaData) {
        // If a new dataset, use create route, otherwise use update
        if (!$scope.editMode) {
            metaData.user = user._id;
            DatasetFactory.create($scope.file, metaData)
            .then(function(response) {
                $scope.userDatasets.push(response.data);
                $uibModalInstance.close();
                $state.go('userDatasets');
            })
            .then(null, console.error);
        } else {
            metaData.id = currentDataset._id;
            DatasetFactory.update($scope.file, metaData)
            .then(function(response) {
                // Update the $scope array with the updated dataset
                var userDatasetIndex = $scope.userDatasets.findIndex(userDataset => {
                    return userDataset._id === response.data._id;
                });
                $scope.userDatasets[userDatasetIndex] = response.data;
                $uibModalInstance.close();
                $state.go('userDatasets');
            })
            .then(null, console.error);
        }
    }

});
