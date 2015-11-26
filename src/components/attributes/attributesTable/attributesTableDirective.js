(function () {
    'use strict';

    angular
        .module('scAttributes')
        .directive('scAttributesTable', attributesTableDirective)

    attributesTableDirective.$inject = ['$log', '$mdDialog', 'scCrud', 'scAuth'];

    function attributesTableDirective($log, $mdDialog, scCrud, scAuth) {
        return {
            restrict: 'E',
            templateUrl: 'components/attributes/attributesTable/attributesTable.tpl.html',
            replace: true,
            scope: {
                entity: '='
            },
            link: function (scope, element, attrs) {
                if (angular.isUndefined(scope.entity.attributes) || !angular.isArray(scope.entity.attributes)) {
                    $log.warn('the attribute \'attributes\' must be of type array: attributes = ', scope.entity.attributes);
                    scope.entity.attributes = [];
                }

                scope.valueChanged = valueChanged;
                scope.pressedEnter = newAttribute;
                scope.editAttribute = editAttribute;
                scope.abort = abort;
                scope.newAttributeName = '';
                scope.orgAttributes = angular.copy(scope.entity.attributes);

                function valueChanged(attribute) {
                    $log.info("value changed", scope.entity);

                    if (!attribute) {
                        $log.error("attribute is not defined");
                        return;
                    } else {
                        attribute.values = attribute.values.filter(notEmpty)
                    }
                    attribute.edit = false;

                    updateEntity();

                    function notEmpty(value) {
                        return getStringValueForType(value, attribute.type) != '';
                    }
                }

                function getStringValueForType(value, type) {
                    switch (type) {
                        case 'link':
                            return value.name + '';
                        default:
                            return value + '';
                    }
                }

                function deleteAttribute(values, index) {
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

                            updateEntity();
                        })
                }

                function newAttribute(event) {
                    if (!event || event.keyCode !== 13 || !scope.newAttributeName || scope.newAttributeName === '') {
                        return;
                    }

                    var attrName = scope.newAttributeName;
                    scope.entity.attributes.push({
                        'name': attrName,
                        'values': [],
                        'type': ''
                    });

                    scope.newAttributeName = '';

                    // FIXME: if call misses then rewrite attrName into scope.newAttributeName.
                    // TODO: if call is done show toast (?) (little success message)
                    updateEntity().then(function (updatedEntity) {
                        scope.newAttributeName = attrName;
                    });
                }

                function updateEntity() {
                    $log.info("updateEntity: start");
                    return scCrud.entities.update(scAuth, scope.entity).then(function (updatedEntity) {
                        $log.info("updateEntity: done");
                        scope.entity = updatedEntity;
                        scope.orgAttributes = angular.copy(scope.entity.attributes);

                        return updatedEntity;
                    }).catch(logError);
                }

                function abort(attribute) {
                    attribute.values = scope.orgAttributes.find(function (e) {
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

                function logError() {
                    $log.error.apply($log, arguments);
                }
            }
        };
    }
})();