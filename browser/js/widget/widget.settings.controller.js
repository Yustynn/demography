//https://github.com/ManifestWebDesign/angular-gridster/blob/master/demo/dashboard/script.js
app.controller('WidgetSettingsCtrl', function ($scope, $timeout, $rootScope, $uibModalInstance, widget, WidgetFactory, GraphService) {
    $scope.widget = widget;

    $scope.form = {
        title: widget.title,
        labelX: widget.labelX,
        labelY: widget.labelY
    };


    $scope.chartTypes = {
        graphs:[
            {id:'barChart', name:'Bar Chart'},
            {id:'pieChart', name:'Pie Chart'}
        ]
    };

    $scope.addGraph = function() {
        if($scope.chartTypes.selectedType) {
           var chartObj = GraphService.create(widget.id,$scope.chartTypes.selectedType, 'League','HR','sum');
           widget.chartObject = chartObj;
           WidgetFactory.update(widget);
        }
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
        WidgetFactory.update(widget);
    };

});
