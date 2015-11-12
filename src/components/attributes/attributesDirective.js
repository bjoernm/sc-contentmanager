(function () {
    'use strict';

    angular
        .module('scAttributes')
        .directive('scAttributes', attributesDirective);

    attributesDirective.$inject = ['$log'];

    function attributesDirective($log) {
        return {
            restrict: 'E',
            templateUrl: 'components/attributes/attributes.tpl.html',
            replace: true,
            scope: {
                entity: "="
            },
            link: function (scope, element, attrs) {
                if (!angular.isObject(scope.entity)) {
                    $log.error('the attribute \'entity\' is required in this directive');
                    return false;
                }
            }
        };
    }
})();