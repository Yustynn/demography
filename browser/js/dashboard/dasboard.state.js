app.config(function ($stateProvider) {
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'js/dashboard/dashboard.edit.html',
        controller: 'DashboardCtrl'
    });
});
