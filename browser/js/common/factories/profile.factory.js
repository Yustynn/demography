app.factory('ProfileFactory', function ($http, Upload, $timeout, AuthService) {

    var ProfileFactory = {};

    ProfileFactory.uploadDataset = function(file, metaData) {
        Upload.upload({
            url: '/api/datasets/',
            method: 'POST',
            data: { file: file, user: metaData.user, title: metaData.title, shortDescription: metaData.shortDescription}
        }).success(function(data, status, headers, config) {
            console.log('Dataset created: ', data);
            // console.log('File saved to filesystem: ', data);
        }).error(function(data, status, headers, config) {
            console.log('error status: ', status);
        });
    }

    //Assuming GET /api/datasets returns array of obj, w/ each obj containing a given data-set's meta info
    ProfileFactory.getAllDatasets = function(user) {
        return $http.get("/api/datasets/?user=" + user._id)
            .then(response => response.data)
    }

    ProfileFactory.getAllDashboards = function(user) {
        return $http.get("/api/dashboards/?user=" + user._id)
            .then(response => response.data)        
    }
    
    return ProfileFactory;

});
