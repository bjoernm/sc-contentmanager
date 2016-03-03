(function () {
    'use strict';

    angular
        .module('scAttributes')
        .directive('scAttributesList', attributesListDirective)

    attributesListDirective.$inject = ['$log', '$mdDialog', 'scAttributesService'];

    function attributesListDirective($log, $mdDialog, scAttributesService) {
        return {
            restrict: 'E',
            templateUrl: 'components/attributes/attributesList/attributesList.tpl.html',
            replace: true,
            scope: {
                attributes: '=',
                onChange: '&',
                onAttributeDelete: '&'
            },
            link: function (scope, element, attrs) {
                if (angular.isUndefined(scope.attributes) || !angular.isArray(scope.attributes)) {
                    $log.warn('the attribute \'attributes\' must be of type array: attributes = ', scope.attributes);
                    scope.attributes = [];
                }

                scope.updateAttribute = updateAttribute;
                scope.editAttribute = editAttribute;
                scope.abortEditing = abortEditing;
                scope.orgAttributes = angular.copy(scope.attributes);
                scope.deleteAttribute = deleteAttribute;
                scope.createAttribute = createAttribute;

                function updateAttribute(attribute) {
                    if (!attribute) {
                        $log.error("attribute is not defined");
                        return;
                    } else {
                        attribute.values = attribute.values.filter(notEmpty)
                    }
                    attribute.edit = false;

                    persistAttribute(attribute);

                    function notEmpty(value) {
                        return !!value && getStringValueForType(value, attribute.type) != '';
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

                function deleteAttribute(attribute) {
                    if (!attribute || 'object' !== typeof attribute) {
                        throw new Error('parameter \'attribute\' must be of type object. typeof attribute == \"' + (typeof attribute) + "\"")
                    }

                    scope.onAttributeDelete({'attribute': attribute});

                    /*
                    var confirmDialog = $mdDialog.confirm()
                        .title('Please Confirm')
                        .textContent('Do you really want to delete the attribute \'' + attribute.name + '\'?')
                        .ok('Ok')
                        .cancel('No');

                    $mdDialog.show(confirmDialog)
                        .then(function () {
                            scAttributesService
                                .deleteAttribute(attribute)
                                .then(scope.onChange());
                        })
                        */
                }

                // FIXME: check if this method is still in use
                function createAttribute(event) {
                    if (!event || event.keyCode !== 13 || !scope.newAttributeName || scope.newAttributeName === '') {
                        return;
                    }

                    var attrName = scope.newAttributeName;

                    // TODO: if call is done show toast (?) (little success message)
                    scAttributesService.createAttribute(attrName).then(function (attribute) {
                        scope.attributes.push(attribute);
                        scope.orgAttributes.push(angular.copy(attribute));
                        scope.newAttributeName = '';
                    }).catch(logError);
                }

                function persistAttribute(attribute) {
                    var index = scope.attributes.findIndex(byId(attribute.id));

                    if (index === -1) {
                        $log.error('could not find index of attribute:', attribute, 'list:', scope.attributes);
                        return;
                    }

                    scAttributesService
                        .updateAttribute(attribute)
                        .then(function (updatedAttribute) {
                            scope.orgAttributes[index] = angular.copy(updatedAttribute);
                            angular.extend(scope.attributes[index], updatedAttribute);

                            return scope.attributes[index];
                        }).catch(logError)
                        .then(scope.onChange);
                }

                function abortEditing(attribute) {
                    var orgAttr = scope.orgAttributes.find(byId(attribute.id)) || {}
                    var orgValues = orgAttr.values || [];
                    attribute.values = angular.copy(orgValues);

                    attribute.edit = false;
                }

                function editAttribute(attribute) {
                    if(!attribute.values) {
                        attribute.values = [];
                    }

                    if (attribute.values.length == 0) {
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

    function byId(id) {
        return function byIdFunction(element) {
            return element.id === id;
        }
    }
})();