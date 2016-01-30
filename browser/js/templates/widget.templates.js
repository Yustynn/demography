app.directive('graphTemplate', function(){
    return {
        restrict: 'E',
        scope: {
            thisId: '=',    //set thisId to widget.id from DashboardCtrl
        },
        controller: 'DashboardCtrl',
        templateUrl: 'js/templates/graph.template.html',
        link: function(scope, element) {
            //console.log(scope.thisId);
        }
    };
});
