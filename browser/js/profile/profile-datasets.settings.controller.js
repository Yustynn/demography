app.controller('ProfileDatasetsSettingsCtrl', function ($scope, $timeout, $rootScope, $uibModalInstance, user, userDatasets, DatasetFactory) {

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
        })
        .then(null, console.error);
    }

    // $scope.remove = function() {
    //     $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
    //     $uibModalInstance.close();
    // };

    // $scope.submit = function() {
    //     angular.extend(widget, $scope.form); //update widget with settings from form
    //     $uibModalInstance.close(widget);

    //     //this widget is used to both create and update graphs. hence this logic:
    //     if(graphTypeToCreate) {
    //         //'TEAM', 'AB'
    //        var chartObj = GraphService.create(widget.id,graphTypeToCreate, widget.labelX.key, widget.labelY.key,selection.group);
    //        widget.chartObject = chartObj;
    //     }
    //     WidgetFactory.update(widget);
    // };

});
