app.factory('ProfileFactory', function ($http, Upload, $timeout) {

    var ProfileFactory = {};

    ProfileFactory.submitProject = function(file, projectObj) {

        $http.post('/api/users/' + projectObj.user + '/projects', projectObj)
        .then(response => response.data)
        .then(project => {
            Upload.upload({
                url: '/api/users/' + project.user + '/uploads/' + project._id,
                file: file
            }).success(function(data, status, headers, config) {
                console.log('File saved to filesystem: ', data);
            }).error(function(data, status, headers, config) {
                console.log('error status: ', status);
            });
        }).then(null, console.error);
    }

    return ProfileFactory;

});
