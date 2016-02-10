app.controller('WidgetSettingsCtrl', function($scope, $timeout, $rootScope, $uibModalInstance, $uibModalStack, widget, WidgetFactory, GraphService, ChartService, dataset, element, graphSize) {
    $scope.widget = widget;
    $scope.chartType;

    $scope.axisDropdowns = {
        objectKeys: Object.keys(dataset.jsonData[0])
            .map(function(key) {
                return {
                    key: key
                };
            })
    };

    // Collapse all "settings" accordions by default in the add chart modal
    function closeAllAccordions (accordionToKeepOpen) {
        if (accordionToKeepOpen !== "barChart") $scope.barChartCollapsed = true;
        if (accordionToKeepOpen !== "rowChart") $scope.rowChartCollapsed = true;
        if (accordionToKeepOpen !== "pieChart") $scope.pieChartCollapsed = true;
        if (accordionToKeepOpen !== "lineChart") $scope.lineChartCollapsed = true;
        if (accordionToKeepOpen !== "dataTable") $scope.datachart = true;
    }

    closeAllAccordions();

    // Functions to toggle accordions
    // Consider creating a single, dynamic function that can do all of this
    $scope.toggleBarChartAccordion = function() {
        closeAllAccordions("barChart");
        if ($scope.barChartCollapsed) {
            $scope.barChartCollapsed = false;
            $scope.chartType = "barChart";
        } else {
            $scope.barChartCollapsed = true;
            $scope.chartType = undefined;
        }
    }

    $scope.toggleRowChartAccordion = function() {
        closeAllAccordions("rowChart");
        if ($scope.rowChartCollapsed) {
            $scope.rowChartCollapsed = false;
            $scope.chartType = "rowChart";
        } else {
            $scope.rowChartCollapsed = true;
            $scope.chartType = undefined;
        }
    }

    $scope.togglePieChartAccordion = function() {
        closeAllAccordions("pieChart");
        if ($scope.pieChartCollapsed) {
            $scope.pieChartCollapsed = false;
            $scope.chartType = "pieChart";
        } else {
            $scope.pieChartCollapsed = true;
            $scope.chartType = undefined;
        }
    }

    $scope.toggleLineChartAccordion = function() {
        closeAllAccordions("lineChart");
        if ($scope.lineChartCollapsed) {
            $scope.lineChartCollapsed = false;
            $scope.chartType = "lineChart";
        } else {
            $scope.lineChartCollapsed = true;
            $scope.chartType = undefined;
        }
    }

    $scope.toggleDataTableAccordion = function() {
        closeAllAccordions("datachart");
        if ($scope.datachart) {
            $scope.datachart = false;
            $scope.chartType = "dataTable";
        } else {
            $scope.datachart = true;
            $scope.chartType = undefined;
        }
    }

    //This will be an map with different themes, for now a single array
    $scope.colorOptions = ['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d', '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476', '#a1d99b', '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc', '#dadaeb', '#636363', '#969696', '#bdbdbd', '#d9d9d9']
        //$scope.groupOptions = [{val:'sum'}, {val:'count'}];

    var selectedColumns = [];
    angular.copy($scope.axisDropdowns.objectKeys, selectedColumns);

    var selection = {
        group: 'count'
    }

    $scope.graphGroups = {
        options: WidgetFactory.getGraphGroups()
    }

    $scope.form = {
        title: widget.title, //update title
        labelX: widget.labelX, //update data on X
        labelY: widget.labelY, //update data on Y
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

    $scope.remove = function() {
        $uibModalStack.dismissAll();
        WidgetFactory.delete(widget._id);
        $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
    };

    $scope.submit = function() {
        angular.extend(widget, $scope.form); //update widget with settings from form
        $uibModalInstance.close(widget);
        $uibModalStack.dismissAll();

        var _chartOptions = {
            order: $scope.form.orderBy ? d3[$scope.form.orderBy] : d3.ascending,
            columns: $scope.form.columns.length > 0 ? $scope.form.columns.map(function(col) {
                return col.key;
            }) : null
        };

        if ($scope.chartType) {

            // Creates new graph
            var chartConfig = {
                id: widget.id,
                container: element,
                chartType: $scope.chartType,
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
        } else {
            //only get updated properties:
            console.error("UPDATING NOT YET WORKING");
            //widget.chartObject = ChartService.update(chartConfig);
        }
        WidgetFactory.update(widget);
    };

    // This is used to close the model with the escape key
        // Removing the widget from this failure callback currently doesn't work
    $uibModalInstance.result.then(function() {
        $uibModalStack.dismissAll();
    }, function() {
        $uibModalStack.dismissAll();
    });

    // BOBBY NOTE: Need to move this in so the statistics box works

    $scope.createDatacountWidget = function(widget, datasetId) {
        widget.title = "Statistics";
        widget.sizeX = 4;
        widget.sizeY = 1;

        var chartConstructor = {
            id: widget.id,
            container: $('#widget-container-'+widget.id).children()[1],
            chartType: 'dataCount',
            chartGroup: 'Group1',
            width: graphSize.width,
            height: graphSize.height
        };
        widget.chartObject = ChartService.create(chartConstructor);
        WidgetFactory.update(widget);
        $uibModalInstance.close(widget);
    }

});
