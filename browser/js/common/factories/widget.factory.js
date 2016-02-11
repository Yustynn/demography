//use this to save widgets of all sorts. checkout the widget model to undrstand the properties
app.factory('WidgetFactory', function ($http){
    
    var graphGroups = ['Group1']

    return {
        //save new widget upon creation
        create: function(widget) {
            return $http.post('/internalapi/widgets', widget)
            .then(function(response){
                return response.data;
            });
        },

        update: function(widget) {
            $http.put('/internalapi/widgets/' + widget._id, widget)
            .then(function(response) {
                return response.data;
            });
        },

        delete: function(widgetId) {
            return $http.delete('/internalapi/widgets/' + widgetId)
            .then(function(response){
                return response.data;
            });
        },
        addGraphGroup: function(groupName){
            graphGroups.push(groupName);
        },
        getGraphGroups: function(){
            return graphGroups;
        }
    }
});
