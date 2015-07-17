angular.module('cargoNgApp')

.controller('PersonEditController', function($scope, $modalInstance, $http, item, $filter) {
	
	$scope.person = {};
	
	var mode = $scope.mode = item ? 'edit' : 'add';
	
	if("edit" == mode){
		loadPerson(item.id);
	}
		

 	$scope.addContact = function(){
 		$scope.person.contact_details = $scope.person.contact_details || []; 
 		$scope.person.contact_details.push({});
 	};

 	$scope.removeContact = function(ix){
 		$scope.person.contact_details.splice(ix, 1);
 	}

    $scope.calcName = function() {
        $scope.person.name = ($scope.person.given_name || '') + ' ' + ($scope.person.family_name || '');
    };

    $scope.save = function() {
        // window.__bootstrapData.popitKey
        var personToSave = angular.extend({}, $scope.person);

        if ($scope.idnumber || $scope.idtype) {
            personToSave.identifiers = [{
                identifier: $scope.idnumber,
                scheme: $scope.idtype
            }]
        }

        if ($scope.other_names){
        	personToSave.other_names = $scope.other_names.split('\n').map(function(item){ return { name: item } })
        }

        var url = "/proxy/persons";

        if("edit" == mode) url += "/" + item.id;

        $http({
            method: "edit" == mode ? 'PUT' : 'POST',
            url: url,
            data: personToSave,
        }).success(function() {
            $modalInstance.close();
        }).error(function() {
            console.log('Error saving person', arguments)
            alert('Error saving person')
        });

    };

    $scope.cancel = function() {
        $modalInstance.close();
    };

 	function loadPerson(personId){
	 	var url = "https://" + window.__bootstrapData.user.popitUrl + ".popit.mysociety.org/api/v0.1/persons/" + personId + "?embed="
	 	$http.get(url).then(function(response){
	 		$scope.person = response.data.result;
		    if ($scope.person.identifiers && $scope.person.identifiers.length > 0) {
		        if ($scope.person.identifiers[0].scheme) $scope.idtype = $scope.person.identifiers[0].scheme;
		        if ($scope.person.identifiers[0].identifier) $scope.idnumber = $scope.person.identifiers[0].identifier;
		    }

		    if($scope.person.other_names && $scope.person.other_names.length){
		    	$scope.other_names = $scope.person.other_names.map(function(item){return item.name;}).join('\n');
		    }

	 	})
 	}

});