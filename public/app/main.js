angular.module('cargoNgApp', ['ngRoute']).
run(function($rootScope){
  $rootScope.bootstrapData = window.__bootstrapData;
})
;

