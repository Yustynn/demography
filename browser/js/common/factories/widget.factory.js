//use this to save widgets of all sorts. checkout the widget model to undrstand the properties
app.factory('WidgetFactory', function ($http){
    return {

        //save new widget upon creation
        create: function(widget) {
            return $http.post('/api/widgets', widget)
            .then(function(response){
                return response.data;
            });
        },

        update: function(widget) {
            $http.put('/api/widgets/' + widget._id, widget)
            .then(function(response) {
                return response.data;
            });
        },

        delete: function(widgetId) {
            return $http.delete('/api/widgets/' + widgetId)
            .then(function(response){
                return response.data;
            });
        }
    }
});
