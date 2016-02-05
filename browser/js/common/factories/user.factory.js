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
		}

	}
})