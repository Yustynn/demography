app.factory('ProfileFactory', function (Upload, $timeout) {

    var ProfileFactory = {};

    ProfileFactory.submitProject = function(file) {

        console.log("Factory file: ", file);

        Upload.upload({
            url: '/api/users/uploads/' + file.projectName,
            file: file
        }).success(function(data, status, headers, config) {
            console.log('File saved to filesystem: ', data)
        }).error(function(data, status, headers, config) {
            console.log('error status: ', status);
        });
    }

    return ProfileFactory;

});
