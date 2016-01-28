'use strict';

app.directive('loadFile', function() {
    return {
        restrict: 'E',
        templateUrl: '/js/common/directives/load-file/load-file.html',
        controller: 'LoadFileCtrl'
    }
});

app.controller('LoadFileCtrl', function($scope, Upload, $timeout) {
    $scope.uploadFiles = function(file, errFiles) {

        console.log("File: ", file);

        $scope.file = file;
        $scope.errFile = errFiles && errFiles[0];

        Upload.upload({
            url: '/api/users/uploads',
            file: file
        }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
            console.log("Data: ", data);
            // console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
        }).error(function (data, status, headers, config) {
            console.log('error status: ' + status);
        });

        // if (file) {
        //     file.upload = Upload.upload({
        //         url: '/api/users/upload',
        //         method: 'POST',
        //         data: {
        //             file: file
        //         }
        //     });

        //     file.upload.then(function(response) {

        //         console.log("Response: ", response);

        //         $timeout(function() {
        //             file.result = response.data;
        //         });
        //     }, function(response) {
        //         if (response.status > 0)
        //             $scope.errorMsg = response.status + ': ' + response.data;
        //     }, function(evt) {
        //         file.progress = Math.min(100, parseInt(100.0 *
        //             evt.loaded / evt.total));
        //     });
        // }
    }
});
