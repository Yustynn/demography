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

app.controller('StreamCtrl', function($scope, $state, dashboards) {

    $scope.allDashboards = dashboards;

});
