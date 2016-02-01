app.config(function($stateProvider) {

    $stateProvider.state('stream', {
        url: '/stream',
        templateUrl: 'js/stream/stream.html',
        controller: 'StreamCtrl'
    });

});

app.controller('StreamCtrl', function($scope, $state) {


});
