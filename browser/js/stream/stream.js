app.config(function($stateProvider) {

    $stateProvider.state('stream', {
        url: '/stream',
        templateUrl: 'js/stream/stream.html',
        controller: 'StreamCtrl',
        resolve: {
            dashboards: function(DashboardFactory){
                return DashboardFactory.fetchAll()
            }
        }
    });

});

app.controller('StreamCtrl', function($scope, $state, dashboards, DashboardFactory) {
    $scope.allDashboards = dashboards;

    var listenerFunc = function(event, newDashboard) {
        var changingIndex = $scope.allDashboards.findIndex(dashboard => {
            return dashboard._id === newDashboard._id;
        });
        $scope.allDashboards[changingIndex].screenshot = $scope.allDashboards[changingIndex].screenshot + '?x=' + Math.floor(Math.random() * 1000)
        $scope.$off("screenshotUpdated", listenerFunc)
    }

    $scope.$on("screenshotUpdated", listenerFunc)

    $scope.forkDashboard = function(dashboard) {
        DashboardFactory.fork(dashboard)
    }

});


