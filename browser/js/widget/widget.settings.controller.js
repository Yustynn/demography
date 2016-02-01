//https://github.com/ManifestWebDesign/angular-gridster/blob/master/demo/dashboard/script.js
app.controller('WidgetSettingsCtrl', function($scope, $timeout, $rootScope, $uibModalInstance, widget) {
    $scope.widget = widget;

    $scope.form = {
        title: widget.title,
        labelX: widget.labelX,
        labelY: widget.labelY
    };

    $scope.dismiss = function() {
        $uibModalInstance.dismiss();
    };

    $scope.remove = function() {
        $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
        $uibModalInstance.close();
    };

    $scope.submit = function() {
        angular.extend(widget, $scope.form);
        $uibModalInstance.close(widget);
    };

});
