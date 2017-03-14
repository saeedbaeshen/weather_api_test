
var api_app = angular.module('APIAPP', 
	['ngRoute',
	 'API.Main']);

api_app.config(function($routeProvider){
	$routeProvider
		.when('/',{
			templateUrl: 'main/template/main.html',
			controller : 'MianController'
		})
		.when('/index.html',{
			templateUrl: 'main/template/main.html',
			controller : 'MianController'
		})
		.otherwise({
			templateUrl: 'error_page/template/error.html',
		});
});
