app.config(function ($stateProvider) {
    $stateProvider.state('dashboard', {
        url: '/:userId/dashboards/:dashboardId',
        templateUrl: 'js/dashboard/dashboard.edit.html',
        controller: 'DashboardCtrl',
        resolve: {
            loggedInUser: function(AuthService, $stateParams) {
                return AuthService.getLoggedInUser()
                    .then(function(user) {
                        $stateParams.userId = user._id
                        return user;
                    });
            }
        }
    });
});
