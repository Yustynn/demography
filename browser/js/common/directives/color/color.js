app.directive('myColor',function(){

	return {
		restrict: "E",
		templateUrl: 'js/common/directives/color/color.html',
		scope: {
			color: '='
		},
		link: function(scope,element,attrs){
			element.css('background-color',scope.color)
			element.on('click',function(el){
				$('my-color').removeClass('active')
				element.addClass('active')
			})
		}
	}
})