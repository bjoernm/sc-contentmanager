'use strict';

(function (angular) {
    angular.module('scInputFilters', []);

    angular
        .module('scInputFilters')
        .directive('scPercentageInput', scPercentageInput);

    scPercentageInput.$input = ['$log'];
    function scPercentageInput($log) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                if (!ngModel) {
                    $log.error('The directive scPercentageInput must have a ngModel context. called element:', element);
                }

                ngModel.$parsers.push(percentageParser);
                ngModel.$formatters.push(percentageFormatter);

            }
        };
    }

    function percentageFormatter(number) {
        if (isFinite(number)) {
            return Math.round(number * 10000) / 100;
        } else {
            return number;
        }
    }

    function percentageParser(text) {
        //console.log('percentageParser', text, isFinite(text));
        return parseFloat(text) / 100;
    }

})(angular);