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
    $scope.chartTypes = {
        graphs:[
            {id:'barChart', name:'Bar Chart'},
            {id:'pieChart', name:'Pie Chart'}
        ]
    };

    $scope.addGraph = function(graphId) {
        if($scope.chartTypes.selectedType) {
            GraphService.create(graphId,$scope.chartTypes.selectedType, 'League','HR','sum')
        }
    };

})
