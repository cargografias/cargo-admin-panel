angular.module('cargoNgApp')

 .controller('InstancesController', function($scope, $route, $routeParams, $location, $http) {

 	$scope.instances = [];

 	$http.get('/api/instances')
 		.then(function(response){
 			$scope.instances = response.data;
 		});

 })
