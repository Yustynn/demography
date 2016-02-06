//https://github.com/ManifestWebDesign/angular-gridster/blob/master/demo/dashboard/script.js
app.controller('WidgetSettingsCtrl', function ($scope, $timeout, $rootScope, $uibModalInstance, widget, graphTypeToCreate, WidgetFactory, GraphService, dataset,element,graphSize) {
    $scope.widget = widget;
    $scope.chartType = graphTypeToCreate;
    console.log($scope.chartType)
    //TODO: dropdown for labels from dataset once we have data loaded
    $scope.axisDropdowns = {
        objectKeys : Object.keys(dataset.jsonData[0])
        .map(function(key){
            return {key: key};
        })
    };

    var selectedColumns = [];
    angular.copy($scope.axisDropdowns.objectKeys, selectedColumns);

    var selection = {
        group:'count'
    }

    $scope.graphGroups = {
        options: WidgetFactory.getGraphGroups()
    }
    //2-way binding!

    $scope.form = {
        title: widget.title,    //update title
        labelX: widget.labelX,  //update data on X
        labelY: widget.labelY,   //update data on Y
        group: selection.group,
        graphGroup: 'Group1',
        orderBy: 'ascending',
        columns: selectedColumns
    };

    $scope.addGraphGroup = function() {
        var newGroup = 'Group'+ ($scope.graphGroups.options.length+1);
        WidgetFactory.addGraphGroup(newGroup);
        $scope.form.graphGroup= newGroup;
        $scope.graphGroups.options = WidgetFactory.getGraphGroups();
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
        //debugger;
        $uibModalInstance.close(widget);

        var _chartOptions = {
            order: $scope.form.orderBy ? d3[$scope.form.orderBy] : d3.ascending,
            columns: $scope.form.columns.length > 0 ? $scope.form.columns.map(function(col){return col.key; }) : null
        };
        //this widget is used to both create and update graphs. hence this logic:
        if(graphTypeToCreate) {
            //'TEAM', 'AB'
           var chartObj = GraphService.create(element,widget.id,graphTypeToCreate, widget.labelX.key, widget.labelY.key,widget.group,_chartOptions,graphSize,widget.graphGroup);
           widget.chartObject = chartObj;
        }
        WidgetFactory.update(widget);
    };
});
