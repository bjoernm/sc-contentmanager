(function () {
    'use strict';

    angular
        .module('scAttributesTable')
        .directive('scAttributesTable', attributesTableDirective)

    attributesTableDirective.$inject = ['$log', '$mdDialog'];

    function attributesTableDirective($log, $mdDialog) {
        return {
            restrict: 'E',
            templateUrl: 'components/attributes/attributesTable/attributesTable.tpl.html',
            replace: true,
            scope: {
                attributes: '='
            },
            link: function (scope, element, attrs) {
                if (!angular.isArray(scope.attributes)) {
                    $log.warn('the attribute \'attributes\' must be of type array: attributes = ', scope.attributes);
                    scope.attributes = [];
                }

                scope.deleteValue = deleteValue;
                scope.valueChanged = valueChanged;
                scope.closeEditingValue = closeEditingValue;


                function closeEditingValue(attribute) {
                    attribute.edit = false;
                }

                function valueChanged(attribute, newValues) {
                    $log.info("value changed", attribute, newValues);
                    if (!attribute || !newValues) {
                        var types = {
                            'attribute': typeof attribute,
                            'newValues': typeof newValues
                        }
                        throw new Error('Either \'attribute\' or \'newValues\' is not defined: ' + angular.toJson(types));
                    }
                    attribute.values = newValues;
                    scope.closeEditingValue(attribute);
                }

                function deleteValue(attribute) {
                    if (!attribute || 'object' !== typeof attribute) {
                        throw new Error('parameter \'attribute\' must be of type object. typeof attribute == \"' + (typeof attribute) + "\"")
                    }

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