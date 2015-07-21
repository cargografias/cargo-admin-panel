angular.module('cargoNgApp')

 .controller('OrganizationEditController', function($scope, $modalInstance, $http, item) {

 	$scope.item = {};
    var mode = $scope.mode = item ? 'edit' : 'add';

    if("edit" == mode){
        loadItem(item.id);
    }

    function loadOrganizationName(){
        var url = "https://" + window.__bootstrapData.user.popitUrl + ".popit.mysociety.org/api/v0.1/organizations/" + item.parent_id + "?embed="
        $http.get(url).then(function(response){
            $scope.organization_name = response.data.result.name
        })
    }

 	$scope.save = function(){

        var itemToSave = angular.extend({}, $scope.item);

 		var url = "/proxy/organizations" +  ( 'edit' == mode   ? ( "/" + item.id) : '' ) ;
 		
 		$http({
 			method: 'edit' == mode ? 'PUT' : 'POST',
 			url: url, 
 			data: itemToSave, 
 		}).success(function(result){
            if("ok" != result.status){
                if(result.errors){
                    alert(result.errors.join('\n'))
                }else{
                    console.log("Error saving organization")
                    console.log(result);
                    alert('Error saving organization')
                }
            }else{
                $modalInstance.close("add" == mode ? result.id : null);
            }
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
            loadOrganizationName();
        })
    }

    $scope.removeName = function(ix){
        $scope.item.other_names.splice(ix, 1);
    };

    $scope.addName = function(){
        $scope.item.other_names = $scope.item.other_names || [];
        $scope.item.other_names.push({});
    }

    $scope.addContact = function(){
        $scope.item.contact_details = $scope.item.contact_details || []; 
        $scope.item.contact_details.push({});
    };

    $scope.removeContact = function(ix){
        $scope.item.contact_details.splice(ix, 1);
    }

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
        $scope.item.parent_id = $model.id;
        $scope.organization_name = $model.name;
        $scope.orgSearch = false;
    };

 });
