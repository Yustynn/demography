app.controller('ProfileDatasetsSettingsCtrl', function ($scope, $timeout, $rootScope, $state, $uibModalInstance, user, userDatasets, DatasetFactory) {

    $scope.user = user;
    $scope.userDatasets = userDatasets;

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
        metaData.user = user._id;
        DatasetFactory.create($scope.file, metaData)
        .then(function(response) {
            $scope.userDatasets.push(response.data);
            $uibModalInstance.close();
            $state.go('userDatasets');
        })
        .then(null, console.error);
    }

});
