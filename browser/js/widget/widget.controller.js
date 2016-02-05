//https://github.com/ManifestWebDesign/angular-gridster/blob/master/demo/dashboard/script.js
app.controller('WidgetCtrl', function ($scope, $uibModal, WidgetFactory, DatasetFactory, GraphService) {

    $scope.remove = function (widget) {
        if(widget._id) WidgetFactory.delete(widget._id);
        $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
    };

    $scope.createDatacountWidget = function(widget, datasetId) {

        //set title
        widget.title = "Statistics";
        widget.sizeX = 4;
        widget.sizeY = 1;
        //set width and height

        var chartObj = GraphService.create(widget.id,'dataCount');
        widget.chartObject = chartObj;
        WidgetFactory.update(widget);
    }

    $scope.openSettings = function (widget, datasetId, graphTypeToCreate) {
        $uibModal.open({
            scope: $scope,
            templateUrl: 'js/widget/widget.settings.html',
            controller: 'WidgetSettingsCtrl',
            resolve: {
                widget: function() {
                    return widget;
                },
                graphTypeToCreate: function() {
                    return graphTypeToCreate || null;
                },
                dataset: function() {
                    return DatasetFactory.fetchOne(datasetId)
                    .then(function(dataset){
                        return dataset;
                    });
                }
            }
        });
    };

    //used to ng-hide new-widget-selector
    $scope.noGraph = function (widget){
        return widget.chartObject && widget.chartObject!={};
    }

    $scope.$on('gridster-item-transition-end', function (item) {
        var updatedWidget = {
            col: item.targetScope.widget.col,
            row: item.targetScope.widget.row,
            sizeX: item.targetScope.widget.sizeX,
            sizeY: item.targetScope.widget.sizeY,
            _id: item.targetScope.widget._id
        };
        WidgetFactory.update(updatedWidget);    //no ().then necessary here
    });
});
