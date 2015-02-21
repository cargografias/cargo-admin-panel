
angular.module('cargoNgApp', ['ngRoute', 'ngCkeditor', 'ui.ace']).
run(function($rootScope){
  $rootScope.bootstrapData = window.__bootstrapData;
})
;

