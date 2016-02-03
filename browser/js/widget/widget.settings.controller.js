//https://github.com/ManifestWebDesign/angular-gridster/blob/master/demo/dashboard/script.js
app.controller('WidgetSettingsCtrl', function ($scope, $timeout, $rootScope, $uibModalInstance, widget, graphTypeToCreate, WidgetFactory, GraphService, dataset) {
    $scope.widget = widget;

    //TODO: dropdown for labels from dataset once we have data loaded
    $scope.form = {
        title: widget.title,    //update title
        labelX: widget.labelX,  //update data on X
        labelY: widget.labelY   //update data on Y
    };

    $scope.dismiss = function() {
        $uibModalInstance.dismiss();
    };

    $scope.remove = function() {
        $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
        $uibModalInstance.close();
    };

    $scope.submit = function() {
        angular.extend(widget, $scope.form); //update widget with settings from form
        $uibModalInstance.close(widget);

        //this widget is used to both create and update graphs. hence this logic:
        if(graphTypeToCreate) {
            //'TEAM', 'AB'
           var chartObj = GraphService.create(widget.id,graphTypeToCreate, widget.labelX, widget.labelY,'sum');
           widget.chartObject = chartObj;
        }
        else WidgetFactory.update(widget);
    };

});
