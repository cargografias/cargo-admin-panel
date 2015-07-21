angular.module('cargoNgApp')

 .controller('PersonsController', function($scope, $http, $timeout, $modal) {

	$scope.search = {}; 	
 	$scope.rows = [];
 	$scope.result = {};
 	$scope.page = 1;

 	$scope.search.name = "*";

 	$scope.doSearch = function(){
 		$scope.page = 1;
 		if($scope.search.id){
 			loadById($scope.search.id);
 		}else{
 			loadSearch();
 		}
 	};

 	$scope.doSearch();

 	$scope.goToPage = function(page){
 		$scope.page = page;
 		loadSearch();
 	};

 	$scope.delete = function(item){
 		var message = "DELETE?: \n\n"
 		message+= item.name + "\n";
 		message+= "ID: " + item.id + "\n";
 		if(confirm(message)){
	 		var url = "/proxy/persons/" + item.id;
	 		$http({
	 			method: 'DELETE',
	 			url: url
	 		}).success(function(){
		 		$scope.doSearch();
	 		}).error(function(){
	 			console.log('Error deleting person', arguments)
	 			alert('Error deleting person')
	 		});

 		}
 	}

 	$scope.deleteMembership = function(item){
 		var message = "DELETE?: \n\n"
 		message+= item.label + "\n";
 		message+= "ID: " + item.id + "\n";
 		if(confirm(message)){
	 		var url = "/proxy/memberships/" + item.id;
	 		$http({
	 			method: 'DELETE',
	 			url: url
	 		}).success(function(){
		 		$scope.doSearch();
	 		}).error(function(){
	 			console.log('Error deleting membership', arguments)
	 			alert('Error deleting membership')
	 		});

 		}
 	}

 	$scope.addMembership = function(person){

		var modalInstance = $modal.open({
	      animation: true, //$scope.animationsEnabled,
	      templateUrl: '/app/partials/membershipEdit.html',
	      controller: 'MembershipEditController',
	      //size: size,
	      resolve: {
	        item: function () {
	          return person.id;
	        }, 
	        mode: function (){
	        	return 'add'
	        }
	      }
	    });

	    modalInstance.result.then(function (selectedItem) {
	      loadSearch();
	      //$scope.selected = selectedItem;
	    }, function () {
	    	//modal closed
	    });

 	}

 	$scope.openEdit = function(item){

 		//if item -> edit, if not -> add

		var modalInstance = $modal.open({
	      animation: true, //$scope.animationsEnabled,
	      templateUrl: '/app/partials/personEdit.html',
	      controller: 'PersonEditController',
	      //size: size,
	      resolve: {
	        item: function () {
	          return item;
	        }
	      }
	    });

	    modalInstance.result.then(function (newId) {
	      if(newId){
	      	$scope.search.id = newId;
	      	$scope.search.name = "";
	      }
	      $scope.doSearch();
	      //$scope.selected = selectedItem;
	    }, function () {
	    	//modal closed
	    });

 	};

 	$scope.openEditMembership = function(membership){
		var modalInstance = $modal.open({
	      animation: true, //$scope.animationsEnabled,
	      templateUrl: '/app/partials/membershipEdit.html',
	      controller: 'MembershipEditController',
	      //size: size,
	      resolve: {
	        item: function () {
	          return membership;
	        }, 
	        mode: function (){
	        	return 'edit'
	        }
	      }
	    });

	    modalInstance.result.then(function (selectedItem) {
			$scope.doSearch();
	      //$scope.selected = selectedItem;
	    }, function () {
	    	//modal closed
	    });
 	}

 	function loadById(personId){

 		var url = "https://" + window.__bootstrapData.user.popitUrl + ".popit.mysociety.org/api/v0.1/persons/" + personId

 		$http.get(url).
		  success(function(data, status, headers, config) {

		    $scope.rows = [data.result];

		    $scope.total = 1
		    $scope.from = 1
		    $scope.to = 1
		    $scope.totalPages = 1;
		    $scope.pages = [1];

		  }).
		  error(function(data, status, headers, config) {
		    console.log("Error getting person")
		  }); 	
 	}

 	function loadSearch(){

 		var url = "https://" + window.__bootstrapData.user.popitUrl + ".popit.mysociety.org/api/v0.1/search/persons?"
 		url += "page=" + $scope.page;
 		url += "&q=name:" + $scope.search.name;

 		$http.get(url).
		  success(function(data, status, headers, config) {

		    $scope.rows = data.result;
		    $scope.result = data;

		    $scope.total = data.total;
		    $scope.from = (data.page - 1) * data.per_page + 1;
		    $scope.to = (data.page - 1) * data.per_page + data.result.length;
		    $scope.totalPages = Math.ceil( data.total / data.per_page );
		    $scope.pages = [];
		    for(var i = $scope.page - 5; i <= $scope.page + 5 ; i++){
		    	if(i>0 && i <= $scope.totalPages ){
		    		$scope.pages.push(i);	
		    	}		    	
		    }

		  }).
		  error(function(data, status, headers, config) {
		    console.log("ERROR HERE")
		  }); 		
 	}


 })
