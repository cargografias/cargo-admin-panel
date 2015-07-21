angular.module('cargoNgApp')

 .controller('MembershipEditController', function($scope, $modalInstance, $http, item, mode) {

 	$scope.mode = mode;
 	$scope.membership = "add" == mode ? { person_id: item } : item;

 	if('edit'==mode){
 		loadOrganizationName();
 	}

 	function loadOrganizationName(){
	 	var url = "https://" + window.__bootstrapData.user.popitUrl + ".popit.mysociety.org/api/v0.1/organizations/" + item.organization_id + "?embed="
	 	$http.get(url).then(function(response){
	 		$scope.organization_name = response.data.result.name
	 	})
 	}

 	$scope.save = function(){

 		// window.__bootstrapData.popitKey
 		var url = "/proxy/memberships" + ( "edit" == mode ?  ("/" + item.id) : "" ) ;
 		
 		if($scope.membership.area && !$scope.membership.area.id){
 			delete $scope.membership.area;
 		}

 		$http({
 			method: "edit" == mode ? 'PUT' : 'POST',
 			url: url, 
 			data: $scope.membership
 		}).success(function(result){
            if("ok" != result.status){
                if(result.errors){
                    alert(result.errors.join('\n'))
                }else{
                    console.log("Error saving")
                    console.log(result);
                    alert('Error saving')
                }
            }else{
                $modalInstance.close("add" == mode ? result.id : null);
            }
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
