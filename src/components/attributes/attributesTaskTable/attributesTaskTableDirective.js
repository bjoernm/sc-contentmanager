(function () {
    'use strict';

    angular
        .module('scAttributes')
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
                scope.abort = abort;
                scope.editAttribute = editAttribute;
                var orgAttributes = angular.copy(scope.tasks.attributes);

                function valueChanged(attribute) {
                    if (!attribute) {
                        $log.error("attribute is not defined");
                        return;
                    } else {
                        attribute.values = attribute.values.filter(function (value) {
                            return getStringValueForType(value, attribute.type) != '';
                        })
                    }
                    attribute.edit = false;

                    updateTask();

                }

                function getStringValueForType(value, type) {
                    switch (type) {
                        case 'link':
                            return value.name + '';
                        default:
                            return value + '';
                    }
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

                function abort(attribute) {
                    attribute.values = orgAttributes.find(function (e) {
                        return attribute.name == e.name;
                    }).values;

                    attribute.edit = false;
                }

                function editAttribute(attribute) {
                    if(attribute.values.length == 0) {
                        attribute.values.push('');
                    }

                    attribute.edit = true
                }
            }
        };
    }
})();