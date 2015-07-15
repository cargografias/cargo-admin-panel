angular.module('cargoNgApp')

 .controller('MembershipEditController', function($scope, $modalInstance, $http, item) {

 	$scope.membership = item;

 	loadOrganizationName();

 	function loadOrganizationName(){
	 	var url = "https://" + window.__bootstrapData.user.popitUrl + ".popit.mysociety.org/api/v0.1/organizations/" + item.organization_id + "?embed="
	 	$http.get(url).then(function(response){
	 		$scope.organization_name = response.data.result.name
	 	})
 	}

 	$scope.save = function(){

 		// window.__bootstrapData.popitKey
 		var url = "/proxy/memberships/" + item.id;

 		$http({
 			method: 'PUT',
 			url: url, 
 			data: $scope.membership
 		}).success(function(){
	 		$modalInstance.close();
 		}).error(function(){
 			console.log('Error saving membership', arguments)
 			alert('Error saving membership')
 		});

 	};

 	$scope.cancel = function(){
 		$modalInstance.close();
 	};

 	$scope.getOrganizations = function(val) {
	    return $http.get('https://' + window.__bootstrapData.user.popitUrl + '.popit.mysociety.org/api/v0.1/search/organizations', {
	      params: {
	        q: "name:" + val + "*",
	        embed: ""
	      }
	    }).then(function(response){
	      return response.data.result.map(function(item){
	        return {id: item.id, name: item.name};
	      });
	    });
	  };

	  $scope.selectOrganization = function($item, $model, $label){
	  	$scope.membership.organization_id = $model.id;
	  	$scope.organization_name = $model.name;
	  	$scope.orgSearch = false;
	  };

 });
