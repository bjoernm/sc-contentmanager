(function () {
    'use strict';

    angular
        .module('scAttributesTaskTable')
        .directive('scAttributesTaskTable', attributesTaskTableDirective);

    attributesTaskTableDirective.$inject = ['$log', '$mdDialog', 'scAttributesTaskTableService'];

    function attributesTaskTableDirective($log, $mdDialog, scAttributesTaskTableService) {
        return {
            restrict: 'E',
            templateUrl: 'components/attributes/attributesTaskTable/attributesTaskTable.tpl.html',
            replace: true,
            scope: {
                tasks: '='
            },
            link: function (scope, element, attrs) {
                if (!angular.isArray(scope.tasks)) {
                    $log.warn('the attribute \'tasks\' must be of type array: tasks = ', scope.tasks);
                    scope.tasks = [];
                }

                scope.deleteValue = deleteValue;
                scope.valueChanged = valueChanged;
                scope.closeEditingValue = closeEditingValue;

                function closeEditingValue(attribute) {
                    attribute.edit = false;
                }

                function valueChanged(attribute, newValues) {
                    attribute.values = newValues;
                    scope.closeEditingValue(attribute);
                }

                function deleteValue(attribute) {
                    var confirmDialog = $mdDialog.confirm()
                        .title('Please Confirm')
                        .content('Do you really want to delete the value of ' + attribute.name + '?')
                        .ok('Ok')
                        .cancel('No');

                    $mdDialog.show(confirmDialog)
                        .then(function () {
                            attribute.values = [];
                        })
                }
            }
        };
    }
})();