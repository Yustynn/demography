app.directive('listener', function(){
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: true,
        link: function(scope, element) {
            scope.$on('gridster-item-transition-end', function(item) {
                console.log("listener is listening", item);
                scope.$emit('item-needs-update', item);
            });
        }
    }

})
