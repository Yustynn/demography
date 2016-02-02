app.directive('graphTemplate', function(){
    return {
        restrict: 'E',
        scope: {
            thisId: '=',    //set thisId to widget.id from DashboardCtrl
        },
        controller: 'GraphTemplateCtrl',
        templateUrl: 'js/templates/graph.template.html',
        link: function(scope, element) {
            //console.log(scope.thisId);
        }
    };
});

app.controller('GraphTemplateCtrl', function($scope, GraphService){

})
