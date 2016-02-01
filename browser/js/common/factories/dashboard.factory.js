app.factory('DashboardFactory', function ($http) {
    return {

        //save new dashboard upon creation
        create: function(dashboard) {
            $http.post('/api/dashboards',dashboard)
            .then(function(response){
                return response.data;
            });
        },

        fetchAll: function() {
            //route makes sure to only return public dashboards
            //and those created by current user
            $http.get('/api/dashboards')
            .then(function(response){
                return response.data;
            });
        },

        fetchAllByUser: function(userId) {
            $http.get('/api/dashboards?user=' + userId)
            .then(function(response){
                return response.data;
            });
        },

        fetchOne: function(id) {
            //route makes sure to only return public dashboards
            //and those created by current user
            $http.get('api/dashboards/' + id)
            .then(function(response){
                return response.data;
            });
        },

        update: function(dashboard) {
            $http.put('/api/dashboards/' + dashboard._id, dashboard)
            .then(function(response) {
                return response.data;
            });
        },

        delete: function(dashboard) {
            $http.delete('/api/dashboards/' + dashboard._id)
            .then(function(response){
                return response.data;
            });
        }
    };
});
