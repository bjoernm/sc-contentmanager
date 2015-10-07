(function () {
    'use strict';

    angular
        .module('scTaskMetadataHelper')
        .directive('scTaskMetadataHelper', scTaskMetadataHelperDirective);

    scTaskMetadataHelperDirective.$inject = ['$log', 'scAttributesTaskTableService'];

    function scTaskMetadataHelperDirective($log, scAttributesTaskTableService) {
        return {
            restrict: 'A',
            templateUrl: 'components/attributes/attributesTaskTable/scTaskMetadataHelper/scTaskMetadataHelper.tpl.html',
            replace: true,
            scope: {
                task: '=scTaskMetadataHelper'
            },
            link: function (scope, element, attrs) {
                if (!/table/i.test(element.parent()[0].tagName)) {
                    throw new Error('The parent element must be of type \'TABLE\' but it is \'' + element.parent()[0].tagName + '\'')
                }

                if (!angular.isObject(scope.task)) {
                    throw new TypeError('the value of the attribute \'scTaskMetadataHelper\' must be of type object: typeof scTaskMetadataHelper == ' + (typeof scope.task));
                }

                scope.metadata = scAttributesTaskTableService.turnMetadataToAttributes(scope.task);

                scope.closeEditingValue = closeEditingValue;
                scope.valueChanged = valueChanged;

                function valueChanged(meta, newValues) {
                    scAttributesTaskTableService.setMetadataValue(scope.task, meta, newValues);
                    scope.closeEditingValue(meta);
                }

                function closeEditingValue(meta) {
                    meta.edit = false;
                }
            }
        };
    }
})();