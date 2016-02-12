app.factory('UserFactory',function($http){

	return {

		fetchAll: function(){
			return $http({
				method: 'GET',
				url: '/api/users'
			})
			.then(res => res.data)
		},

		fetchOne: function(userId){
			return $http({
				method: 'GET',
				url: '/api/users/'+userId
			})
			.then(res => res.data)
		},

        generateToken: function(userId) {
            return $http({
                method: 'GET',
                url: '/api/users/'+userId+'/generateToken'
            })
            .then(res => res.data.token)
        }

	}
})
