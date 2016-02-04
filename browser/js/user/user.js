app.config(function($stateProvider){
	$stateProvider.state('user',{
		url: '/user/:userId',
		abstract: true,
		templateUrl: 'js/user/user.html',
		resolve : {
			userInfo: function($stateParams,UserFactory){
				var userId = $stateParams.userId;
				return UserFactory.fetchOne(userId)
			},
			userDashboards: function(DashboardFactory, $stateParams){
				var userId = $stateParams.userId;
				return DashboardFactory.fetchAllByUser(userId)
				.then(dashboards => dashboards)
				.then(null,console.error.bind(console));
			},
			userPublicData: function(DatasetFactory,$stateParams){
				var userId = $stateParams.userId;
				return DatasetFactory.fetchAllByUser(userId)
				.then(datasets => datasets)
				.then(null,console.error.bind(console))
			}
		}
	})
	.state('user.dashboards',{
		url: '',
		templateUrl: 'js/user/user.dashboards.html',
		controller: 'UserCtrl'
	})
	.state('user.datasets',{
		url: '/datasets',
		templateUrl: 'js/user/user.datasets.html',
		controller: 'UserCtrl'	
	})
})

app.controller('UserCtrl',function($scope,userInfo,userPublicData,userDashboards){
	$scope.dashboards = userDashboards;
	$scope.userInfo = userInfo;
	$scope.datasets = userPublicData;
})