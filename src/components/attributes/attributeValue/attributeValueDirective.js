'use strict';

(function () {
    angular
        .module('scAttributes')
        .directive('scAttributeValue', attributeValueDirective);

    attributeValueDirective.$inject = ['$log', 'scTypeGuessing', 'scUtil'];

    function attributeValueDirective($log, scTypeGuessing, scUtil) {
        return {
            restrict: 'E',
            templateUrl: 'components/attributes/attributeValue/attributeValue.tpl.html',
            replace: true,
            scope: {
                value: "=",
                type: "@"
            },
            link: function (scope, element, attrs) {
                if (angular.isUndefined(scope.value) || (angular.isObject(scope.value) && angular.isUndefined(scope.value.name) && !angular.isDate(scope.value))) {
                    $log.error('value is required. value =', scope.value);
                }

                scope.getType = getType;
                scope.relativPath = scUtil.getRelativeUrl;

                function getType() {
                    if (!scope.type || scope.type === '') {
                        return scTypeGuessing.guessType(scope.value);
                    }

                    return scope.type;
                }
            }
        };
    }
})();