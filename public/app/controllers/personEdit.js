angular.module('cargoNgApp')

.controller('PersonEditController', function($scope, $modalInstance, $http, item, $filter) {
	
	$scope.person = {};
	loadPerson(item.id);

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

 	$scope.addContact = function(){
 		$scope.person.contact_details = $scope.person.contact_details || []; 
 		$scope.person.contact_details.push({});
 	};

 	$scope.removeContact = function(ix){
 		$scope.person.contact_details.splice(ix, 1);
 	}

    $scope.birthUpdated = function() {
        try {
            $scope.person.birth_date = $filter('date')($scope.birthDT, 'yyyy-MM-dd')
        } catch (ex) {
            $scope.person.birth_date = null;
        }
    };

    $scope.deathUpdated = function() {
        try {
            $scope.person.death_date = $filter('date')($scope.deathDT, 'yyyy-MM-dd')
        } catch (ex) {
            $scope.person.death_date = null;
        }
    };

    $scope.openB = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openedB = true;
    };

    $scope.openD = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.openedD = true;
    };

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

        var url = "/proxy/persons/" + item.id;

        $http({
            method: 'PUT',
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

		    if($scope.person.birth_date){
		    	try{
		    		$scope.birthDT = moment($scope.person.birth_date, "YYYY-MM-DD").toDate()
		    	}catch(ex){
		    		console.log("not valid birth date")	
		    	}
		    }

		    if($scope.person.death_date){
		    	try{
		    		$scope.deathDT = moment($scope.person.death_date, "YYYY-MM-DD").toDate()
		    	}catch(ex){
		    		console.log("not valid death date")	
		    	}
		    }

		    if($scope.person.other_names && $scope.person.other_names.length){
		    	$scope.other_names = $scope.person.other_names.map(function(item){return item.name;}).join('\n');
		    }

	 	})
 	}

});