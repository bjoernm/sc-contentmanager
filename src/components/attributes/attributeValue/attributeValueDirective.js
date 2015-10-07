(function () {
    'use strict';

    angular
        .module('scAttributeValue')
        .directive('scAttributeValue', attributeValueDirective);

    attributeValueDirective.$inject = ['$log'];

    function attributeValueDirective($log) {
        return {
            restrict: 'E',
            templateUrl: 'components/attributes/attributeValue/attributeValue.tpl.html',
            replace: true,
            scope: {
                attribute: "="
            },
            link: function (scope, element, attrs) {
                if (angular.isArray(scope.attribute) || !angular.isObject(scope.attribute)) {
                    throw new TypeError('the attribute \'attribute\' is required');
                }

                scope.attribute.edit = false;
            }
        };
    }
})();