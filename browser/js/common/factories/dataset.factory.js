app.factory('DatasetFactory', function ($http) {
    return {
        fetchById: function(datasetId) {
            return $http.get("/api/datasets/" + datasetId)
                .then(function(response) {
                    return response.data
                })
        }
    };
});