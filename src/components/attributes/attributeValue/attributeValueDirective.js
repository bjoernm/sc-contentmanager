'use strict';

(function () {
    angular
        .module('scAttributes')
        .directive('scAttributeValue', attributeValueDirective);

    attributeValueDirective.$inject = ['$log'];

    function attributeValueDirective($log) {
        return {
            restrict: 'E',
            templateUrl: 'components/attributes/attributeValue/attributeValue.tpl.html',
            replace: true,
            scope: {
                value: "=",
                type: "@"
            },
            link: function (scope, element, attrs) {
                if (angular.isUndefined(scope.value) || (angular.isObject(scope.value) && angular.isUndefined(scope.value.name) && !angular.isDate(scope.value)) ) {
                    $log.error('value is required. value =', scope.value);
                }
            }
        };
    }
})();