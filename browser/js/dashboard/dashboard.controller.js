//https://github.com/ManifestWebDesign/angular-gridster/blob/master/demo/dashboard/script.js
app.controller('DashboardCtrl', function ($scope, $timeout){

    $scope.gridsterOptions = {
        margins: [12, 12],  //spacing between widgets
        columns: 12,        // min widget size
        draggable: {
            handle: 'h3'    // which part of the widget is draggable
        }
    };

    $scope.dashboard = {
            id: '1',
            name: 'My First Dashboard',
            widgets: [{
                col: 0,
                row: 0,
                sizeY: 2,
                sizeX: 2,
                name: "Widget 1",
                type: 'widget'
            }, {
                col: 2,
                row: 1,
                sizeY: 4,
                sizeX: 4,
                name: "Graph 2",
                type: 'graph'
            }]
    };

    $scope.editMode = true;
    $scope.toggleEditMode = function() {
        $scope.editMode = !$scope.editMode;
    };

    $scope.clear = function() {
        $scope.dashboard.widgets = [];
    };

    $scope.addWidget = function() {
        $scope.dashboard.widgets.push({
            //default widget settings
            name: "New Widget",
            type: 'widget',
            sizeX: 2,
            sizeY: 2
        });
    };

    $scope.addGraph = function() {
        $scope.dashboard.widgets.push({
            name: "New Graph",
            type: 'graph',
            sizeX: 4,
            sizeY: 4
        });
    };

    $scope.addTextPanel = function() {
        $scope.dashboard.widgets.push({
            name: "New Text Panel",
            type: 'text',
            sizeX: 4,
            sizeY: 1
        });
    };

    // $scope.$watch('selectedDashboardId', function(newVal, oldVal) {
    //     if (newVal !== oldVal) {
    //         $scope.dashboard = $scope.dashboards[newVal];
    //     } else {
    //         $scope.dashboard = $scope.dashboards[1];
    //     }
    // });

    // // init dashboard
    // $scope.selectedDashboardId = '1';
});
