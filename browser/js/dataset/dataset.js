app.config(function($stateProvider) {

    $stateProvider.state('dataset', {
        url: '/dataset/:datasetId',
        templateUrl: 'js/dataset/dataset.html',
        controller: 'DatasetCtrl',
        resolve: {
            theDataset: function($stateParams, DatasetFactory) {
                return DatasetFactory.fetchOne($stateParams.datasetId)
                    .then(function(dataset) {
                        return dataset;
                    });
            }
        }
    });

});

app.controller('DatasetCtrl', function($scope, theDataset, ChartService) {

    //$scope.dataset = theDataset;  //this was used by dataset_json view

    var colNames = Object.keys(theDataset.jsonData[0]);
    console.log('colNames:', colNames);


    var element = $('#dataViewContainer')[0];
    var gridWidth = element.offsetWidth;
    //Temporary size stuff
    var graphSize = {
        width: gridWidth,
        height: gridWidth*2
    };

    // Creates new graph
    var chartConfig = {
        id: 0,
        container: element,
        chartType: 'dataTable',
        chartGroup: "none",
        //xAxis: 'dashIndex',
        //yAxis: 'dashIndex',
        groupType: 'count',
        width: graphSize.width,
        height: graphSize.height,
        columns: colNames,
        order: d3.ascending
    };

    ChartService.loadData(theDataset.jsonData)
    var chartObject = ChartService.create(chartConfig);

});
