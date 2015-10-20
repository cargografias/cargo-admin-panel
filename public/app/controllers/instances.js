angular.module('cargoNgApp')

 .controller('InstancesController', function($scope, $route, $routeParams, $location, $http) {

 	$scope.instances = [];

  function loadInstances(){
    $scope.instances = [];
    $http.get('/api/instances')
    .then(function(response){
      $scope.instances = response.data;
    });
  }

  loadInstances();

  $scope.impersonate = function(username){
    $http.post('/api/impersonate', {username: username})
    .then(function(res){
      if(res.data.status =='ok'){
        window.location = "/"
      }else{
        alert('error impersonating')
      }
    })
    .catch(function(){
      alert('error impersonating')
    })
  }

  $scope.deleteInstance = function(id, name){
    if(confirm("Confirm delete instance '" + name+ "' (" + id + ")")){
      $http.delete('/api/instances/' + id)
      .then(function(res){
        loadInstances();
      })
      .catch(function(){
        alert('error deleteing instances')
        loadInstances();
      })
    }
  }

 })
