app.config(function($stateProvider) {

    $stateProvider.state('stream', {
        url: '/stream',
        templateUrl: 'js/stream/stream.html',
        controller: 'StreamCtrl'
    });

});

app.controller('StreamCtrl', function($scope, $state, DashboardFactory) {

    DashboardFactory.fetchAll()
        .then(function(allDashboards) {
            

            $scope.allDashboards = _.shuffle(allDashboards);

        })
        .then(null, console.error);


});


