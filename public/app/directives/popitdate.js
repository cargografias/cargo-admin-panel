angular.module('cargoNgApp')
    .directive('popitDate', function() {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: '/app/partials/directives/popitdate.html',
            scope: {
                selectedDate: "=selectedDate"
            },
            controller: function($scope, $filter) {

                var validDateRe = /^[0-9]{4}(-[0-9]{2}){0,2}$/;

                $scope.$watch('selectedDate', function(newValue, oldValue) {
                    if (validDateRe.test(newValue)) {
                        var parts = newValue.split('-');
                        $scope.year = parts[0];
                        $scope.month = parts[1];
                        $scope.day = parts[2];
                    }
                });

                var inputsChanged = function() {
                    var parts = [];
                    if ($scope.year) {
                        parts.push($scope.year)
                        if ($scope.month) {
                            parts.push($scope.month)
                            if ($scope.day) {
                                parts.push($scope.day)
                            }
                        }
                    }
                    var dayStr = parts.join('-');
                    $scope.selectedDate = validDateRe.test(dayStr) ? dayStr : null;
                };

                $scope.$watch('year', inputsChanged);
                $scope.$watch('month', inputsChanged);
                $scope.$watch('day', inputsChanged);

            },
            link: function(scope, elem, attrs) {

            }
        };
    });