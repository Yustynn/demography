app.factory('DashboardFactory', function ($http) {
    return {

        //save new dashboard upon creation
        create: function(dashboard) {
            $http.post(dashboard)
            .then(function(response){
                return response.data;
            });
        },

        fetchAllPublic: function() {
            //write special route
        },

        fetchAllByUser: function(user) {

        },

        fetchOne: function(id) {
            //must write backend logic to make sure the user
            //has access to this dashboard
        },

        update: function(dashboard) {
            $http.put(dashboard)
            .then(function(response) {
                return response.data;
            });
        },

        delete: function(dashboard) {
            $http.delete(dashboard._id)
            .then(function(response){
                return response.data;
            });
        }
    };
});
