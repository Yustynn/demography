app.directive('graphTemplate', function(){
    return {
        restrict: 'E',
        scope: {
        },
        controller: 'DashboardCtrl',
        templateUrl: 'js/templates/graph.template.html',
        link: function(scope, element) {

        }
    };
});
