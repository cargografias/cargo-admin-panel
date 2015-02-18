angular.module('cargoNgApp')

 .controller('MainController', function($scope, $route, $routeParams, $location, $http) {

 	$http.get('/api/myinfo').then(function(response){
 		$scope.myinfo = response.data[0];
 		console.log($scope.myinfo)
 	})

 	$scope.updateInstance = function(){
 		console.log('this was clicked')
 	}

 })



// var cargoApp = angular.module('cargoApp', []);

// cargoApp.controller('MainCtrl', [

// 	'$scope', '$http', '$timeout',

// 	function ($scope, $http, $timeout){

// 		$scope.sendCreate = function(){

// 			$scope.responseLines = [];

// 			$http.post('/api/create', {
// 				name: $scope.cargoName, 
// 				popitInstance: $scope.popitInstance
// 			}).then(function(res){

// 				//Start watching:
// 				watchResponse($scope.cargoName);
				
// 			}).catch(function(err){
// 				alert('error creating');
// 			});

// 		};

// 		function watchResponse(instanceName){

// 			$http.get('/api/currentbuildstatus/' + instanceName).then(function(res){
				
// 				$scope.responseLines = res.data.log;
				
// 				if(res.data.importStatus === 'creating'){
// 					$timeout(function(){ watchResponse(instanceName); }, 1000);
// 				}
				
// 			});

// 		}


// }]);
