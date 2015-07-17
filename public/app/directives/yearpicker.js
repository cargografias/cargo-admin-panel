angular.module('cargoNgApp')
    .directive('yearPicker', function() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/app/partials/directives/yearpicker.html',
            scope: {
                selectedDate: "=selectedDate"
            },
            controller: function($scope, $filter) {

                var justUpdated = false;

                $scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };

                $scope.$watch('selectedDate', function(newValue, oldValue) {
                    if (justUpdated) {
                        justUpdated = false;
                        return;
                    }
                    try {
                        $scope.dt = null;
                        if (newValue) {
                            var parsed = moment(newValue, "YYYY-MM-DD", true);
                            if (parsed.isValid()) {
                                $scope.dt = parsed.toDate();
                            }
                        }
                    } catch (ex) {
                        console.log('error', ex)
                        $scope.dt = null;
                    }
                });

                $scope.isOpen = false;


                $scope.dateUpdated = function() {
                    try {
                        $scope.selectedDate = $filter('date')($scope.dt, 'yyyy-MM-dd')
                        justUpdated = true; //To prevent re-parsing the date, generates annoying ux behaviour
                    } catch (ex) {
                        $scope.selectedDate = null;
                    }
                };

                $scope.open = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.isOpen = true;
                };

            },
            link: function(scope, elem, attrs) {

            }
        };
    });