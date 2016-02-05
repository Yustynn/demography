//use this to save widgets of all sorts. checkout the widget model to undrstand the properties
app.factory('WidgetFactory', function ($http){
    return {

        //save new widget upon creation
        // create: function(widget) {
        //     return $http.post('/api/widgets', widget)
        //     .then(function(response){
        //         return response.data;
        //     });
        // },

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
        },

        addWidgetToDashboard: function(dashboard) {
            var newWidget = {
                //default widget settings
                id: dashboard.nextWidgetId,
                title: "New Graph",
                type: 'graph',
                sizeX: 4,
                sizeY: 4,
                chartObject: {}
            };
            dashboard.widgets.push(newWidget);
            dashboard.nextWidgetId = dashboard.nextWidgetId + 1;
            newWidget.dashboard = dashboard._id;
            return $http.post('/api/widgets', newWidget)
            .then(function(createdWidget){
                for(var i = 0; i < dashboard.widgets.length; i++) {
                    if (dashboard.widgets[i].id === newWidget.id) {
                        dashboard.widgets[i] = createdWidget;
                    }
                }
                return dashboard;
            });
        }
    }
});
