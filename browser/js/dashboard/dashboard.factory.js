app.factory('DashboardFactory', function ($http) {
    return {

        //save new dashboard upon creation
        create: function(dashboard) {
            $http.post('/api/dashboards',dashboard)
            .then(function(response){
                return response.data;
            })
        },

        fetchAllByUser: function(user) {

        },

        fetchOne: function(id) {

        },

        update: function(dashboard) {

        },

        delete: function(dashboard) {

        }
    };
});
