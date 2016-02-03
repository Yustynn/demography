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

app.controller('DatasetCtrl', function($scope, theDataset) {

    $scope.dataset = theDataset;

});
