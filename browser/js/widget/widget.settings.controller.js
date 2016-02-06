//https://github.com/ManifestWebDesign/angular-gridster/blob/master/demo/dashboard/script.js
app.controller('WidgetSettingsCtrl', function ($scope, $timeout, $rootScope, $uibModalInstance, widget, graphTypeToCreate, WidgetFactory, GraphService, dataset,element,graphSize) {
    $scope.widget = widget;
    $scope.chartType = graphTypeToCreate;
    //TODO: dropdown for labels from dataset once we have data loaded
    $scope.axisDropdowns = {
        availableOptions : Object.keys(dataset.jsonData[0])
        .map(function(key){
            return {key: key};
        })
    };
    //This will be an map with different themes, for now a single array
    $scope.colorOptions = ['#3182bd','#6baed6','#9ecae1', '#c6dbef','#e6550d','#fd8d3c','#fdae6b','#fdd0a2','#31a354','#74c476','#a1d99b','#c7e9c0','#756bb1','#9e9ac8','#bcbddc','#dadaeb','#636363','#969696','#bdbdbd','#d9d9d9']
    //$scope.groupOptions = [{val:'sum'}, {val:'count'}];
 

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
        graphGroup: 'Group1'
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
        //this widget is used to both create and update graphs. hence this logic:
        if(graphTypeToCreate) {
            //'TEAM', 'AB'
           var chartObj = GraphService.create(element,widget.id,graphTypeToCreate, widget.labelX.key, widget.labelY.key,$scope.form.group,{},graphSize,widget.graphGroup,widget.color);
           widget.chartObject = chartObj;
        }
        WidgetFactory.update(widget);
    };

});
