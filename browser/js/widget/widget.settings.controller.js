app.controller('WidgetSettingsCtrl', function ($scope, $timeout, $rootScope, $uibModalInstance, widget, graphTypeToCreate, WidgetFactory, GraphService, ChartService, dataset,element,graphSize) {
    $scope.widget = widget;
    $scope.chartType = graphTypeToCreate;
    $scope.axisDropdowns = {
        objectKeys : Object.keys(dataset.jsonData[0])
        .map(function(key){
            return {key: key};
        })
    };
    //This will be an map with different themes, for now a single array
    $scope.colorOptions = ['#3182bd','#6baed6','#9ecae1', '#c6dbef','#e6550d','#fd8d3c','#fdae6b','#fdd0a2','#31a354','#74c476','#a1d99b','#c7e9c0','#756bb1','#9e9ac8','#bcbddc','#dadaeb','#636363','#969696','#bdbdbd','#d9d9d9']
    //$scope.groupOptions = [{val:'sum'}, {val:'count'}];

    var selectedColumns = [];
    angular.copy($scope.axisDropdowns.objectKeys, selectedColumns);

    var selection = {
        group:'count'
    }

    $scope.graphGroups = {
        options: WidgetFactory.getGraphGroups()
    }

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
        $uibModalInstance.close(widget);

        var _chartOptions = {
            order: $scope.form.orderBy ? d3[$scope.form.orderBy] : d3.ascending,
            columns: $scope.form.columns.length > 0 ? $scope.form.columns.map(function(col){return col.key; }) : null
        };

        //this modal is used to both create and update graphs. hence this logic:
        if(graphTypeToCreate) {

            var chartConfig = {
                id: widget.id,
                container: element,
                chartType: graphTypeToCreate,
                chartGroup: widget.graphGroup,
                xAxis: widget.labelX.key,
                yAxis: widget.labelY.key,
                groupType: widget.group,
                colorSettings: widget.color,
                width: graphSize.width,
                height: graphSize.height,
                columns: _chartOptions.columns,
                order: _chartOptions.order
            };

            widget.chartObject = ChartService.create(chartConfig);
        }
        else {
            //only get updated properties:
           console.error("UPDATING NOT YET WORKING");
            //widget.chartObject = ChartService.update(chartConfig);
        }
        WidgetFactory.update(widget);
    };
});
