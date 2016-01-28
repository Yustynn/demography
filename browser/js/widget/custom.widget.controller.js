//https://github.com/ManifestWebDesign/angular-gridster/blob/master/demo/dashboard/script.js
app.controller('CustomWidgetCtrl', function($scope, $uibModal) {

    $scope.remove = function(widget) {
        $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
    };

    $scope.openSettings = function(widget) {
        $uibModal.open({
            scope: $scope,
            templateUrl: 'js/widget/widget.settings.html',
            controller: 'WidgetSettingsCtrl',
            resolve: {
                widget: function() {
                    return widget;
                }
            }
        });
    };
});
