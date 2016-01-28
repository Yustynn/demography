//https://github.com/ManifestWebDesign/angular-gridster/blob/master/demo/dashboard/script.js
app.controller('DashboardCtrl', function ($scope, $timeout){

    $scope.gridsterOptions = {
        margins: [20, 20],
        columns: 4,
        draggable: {
            handle: 'h3'
        }
    };

    $scope.dashboard = {
            id: '1',
            name: 'My First Dashboard',
            widgets: [{
                col: 0,
                row: 0,
                sizeY: 1,
                sizeX: 1,
                name: "Graph 1"
            }, {
                col: 2,
                row: 1,
                sizeY: 1,
                sizeX: 1,
                name: "Graph 2"
            }]
    };

    $scope.clear = function() {
        $scope.dashboard.widgets = [];
    };

    $scope.addWidget = function() {
        $scope.dashboard.widgets.push({
            name: "New Graph",
            sizeX: 1,
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
