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

        if (file) {
            file.upload = Upload.upload({
                url: '/api/users/upload',
                method: 'POST',
                data: {
                    file: file
                }
            });

            file.upload.then(function(response) {

                console.log("Response: ", response);

                $timeout(function() {
                    file.result = response.data;
                });
            }, function(response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        }
    }
});
