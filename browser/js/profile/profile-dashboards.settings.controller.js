app.controller('ProfileDashboardsSettingsCtrl', function ($scope, $timeout, $rootScope, $uibModalInstance, user, userDatasets, DashboardFactory) {

    $scope.user = user;
    $scope.userDatasets = userDatasets;

    $scope.dismiss = function() {
        $uibModalInstance.dismiss();
    };

    $scope.createDashboard = function() {
        console.log("Creating dashboard!");
        $uibModalInstance.close();
    }

});
