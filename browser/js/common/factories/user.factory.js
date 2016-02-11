app.factory('UserFactory',function($http){

    return {
        
        fetchAll: function(){
            return $http({
                method: 'GET',
                url: '/internalapi/users'
            })
            .then(res => res.data)
        },

        fetchOne: function(userId){
            return $http({
                method: 'GET',
                url: '/internalapi/users/'+userId
            })
            .then(res => res.data)
        }

    }
})