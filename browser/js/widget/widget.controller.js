//https://github.com/ManifestWebDesign/angular-gridster/blob/master/demo/dashboard/script.js
app.controller('WidgetCtrl', function ($scope, $uibModal, WidgetFactory) {

    $scope.remove = function (widget) {
        if(widget._id) WidgetFactory.delete(widget._id);
        $scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
    };

    $scope.openSettings = function (widget) {
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

    $scope.$on('gridster-item-transition-end', function (item) {
        console.log("RESIZED in custom widget ctrl");
        console.log(item);
        var updatedWidget = {
            col: item.targetScope.widget.col,
            row: item.targetScope.widget.row,
            sizeX: item.targetScope.widget.sizeX,
            sizeY: item.targetScope.widget.sizeY,
            _id: item.targetScope.widget._id
        };
        WidgetFactory.update(updatedWidget);    //no ().then necessary here
    });
});
