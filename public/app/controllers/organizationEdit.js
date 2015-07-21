angular.module('cargoNgApp')

 .controller('OrganizationEditController', function($scope, $modalInstance, $http, item) {

 	$scope.item = {};
    var mode = $scope.mode = item ? 'edit' : 'add';

    if("edit" == mode){
        loadItem(item.id);
    }

 	$scope.save = function(){

        var itemToSave = angular.extend({}, $scope.item);

 		var url = "/proxy/organizations" +  ( 'edit' == mode   ? ( "/" + item.id) : '' ) ;
 		
 		$http({
 			method: 'edit' == mode ? 'PUT' : 'POST',
 			url: url, 
 			data: itemToSave, 
 		}).success(function(result){
            $modalInstance.close("add" == mode ? result.id : null);
 		}).error(function(){
 			console.log('Error saving organization', arguments)
 			alert('Error saving organization')
 		});
	
 	};

 	$scope.cancel = function(){
 		$modalInstance.close();
 	};

    function loadItem(itemId){
        var url = "https://" + window.__bootstrapData.user.popitUrl + ".popit.mysociety.org/api/v0.1/organizations/" + itemId + "?embed="
        $http.get(url).then(function(response){
            $scope.item = response.data.result;
        })
    }

 });
