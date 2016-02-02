//https://github.com/ManifestWebDesign/angular-gridster/blob/master/demo/dashboard/script.js
app.controller('WidgetCtrl', function ($scope, $uibModal, WidgetFactory) {

    $scope.remove = function(widget) {
        if(widget._id) WidgetFactory.delete(widget._id);
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

    // $scope.$on('gridster-item-initialized', function(item) {
    //     console.log("INIT in custom widget ctrl");
    //     console.log(item);

    //     // item.$element
    //     // item.gridster
    //     // item.row
    //     // item.col
    //     // item.sizeX
    //     // item.sizeY
    //     // item.minSizeX
    //     // item.minSizeY
    //     // item.maxSizeX
    //     // item.maxSizeY
    // });

    $scope.$on('gridster-item-transition-end', function (item) {
        console.log("RESIZED in custom widget ctrl");
        console.log(item);
    // item.$element
    // item.gridster
    // item.row
    // item.col
    // item.sizeX
    // item.sizeY
    // item.minSizeX
    // item.minSizeY
    // item.maxSizeX
    // item.maxSizeY
})
});
