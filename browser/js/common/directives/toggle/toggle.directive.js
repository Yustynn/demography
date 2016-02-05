//http://stackoverflow.com/questions/25141139/toggle-class-with-ng-click-on-several-elements
app.directive('toggleClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                element.toggleClass(attrs.toggleClass);
            });
        }
    };
});

/*
    so you can make any element toggle class you need
    <button id="btn" toggle-class="active">Change Class</button>
    <div toggle-class="whatever"></div>
*/
