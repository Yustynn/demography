app.factory('DatasetFactory', function($http) {

    var DatasetFactory = {};

    DatasetFactory.fetchById = function(datasetId) {
        return $http.get("/api/datasets/" + datasetId)
            .then(response => response.data)
            .then(null, console.error);
    }

    DatasetFactory.removeDataset = function(dataset) {
        return $http.delete("/api/datasets/" + dataset._id)
            .then(response => response.data)
            .then(null, console.error);
    }

    return DatasetFactory;
});
