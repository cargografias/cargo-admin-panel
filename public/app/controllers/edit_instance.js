angular.module('cargoNgApp')

.controller('EditInstanceController', function($scope, $route, $routeParams, $location, $http) {

  $http.get('/api/myinfo').then(function(response) {
    $scope.myinfo = response.data[0];
  });

  $scope.save = function() {

    $http.put('/api/instance', $scope.myinfo).then(function(res) {

      if (res.data.status && res.data.status == 'ok') {
        alert('Data Updated')
      } else {
        alert('Error updating instance')
        console.log('error', res.data)
      }

    }).catch(function(err) {
      alert('error updating');
    });

  }

})