app.config(function ($stateProvider) {
    $stateProvider.state('dashboard', {
        url: '/:userId/datasets/:datasetId/dashboards/:dashboardId',
        templateUrl: 'js/dashboard/dashboard.edit.html',
        controller: 'DashboardCtrl',
        resolve: {
            loggedInUser: function(AuthService ) {
                return AuthService.getLoggedInUser()
                .then(function(user) {
                    return user;
                });
            },
            currentDashboard:function(DashboardFactory, $stateParams ) {
                return DashboardFactory.fetchOne($stateParams.dashboardId)
                .then(function(dash){
                    //merge and return stuff
                    return dash;
                });
            },
            currentDataset: function(DatasetFactory, $stateParams ) {

                return DatasetFactory.fetchById($stateParams.datasetId)
                .then(function(dataset){
                    return dataset;
                })
            }
        }
    });
});
