app.factory('ProfileFactory', function ($http, Upload, $timeout) {

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

    return ProfileFactory;

});
