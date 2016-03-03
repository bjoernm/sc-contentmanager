'use strict';

(function () {
    angular
        .module('scAttributes')
        .directive('scAttributeValueEdit', attributeValueEditDirective);

    attributeValueEditDirective.$inject = ['scTypeGuessing', '$log', 'scAttributesService', 'sharedNavDataService'];

    function attributeValueEditDirective(scTypeGuessing, $log, scAttributesService, sharedNavDataService) {
        return {
            restrict: 'E',
            templateUrl: 'components/attributes/attributeValueEdit/attributeValueEdit.tpl.html',
            replace: true,
            scope: {
                attribute: '=',
                currentIndex: '=',
                onChange: '&'
            },
            link: function (scope, element, attrs) {
                if (!angular.isArray(scope.attribute.values) || !(scope.attribute.values instanceof Array)) {
                    $log.error('values must be an array. values =', scope.attribute.values, 'typeof =', typeof scope.attribute.values);
                }

                if (!isFinite(scope.currentIndex)) {
                    $log.error('index must be a number. index =', scope.currentIndex, 'typeof =', typeof scope.currentIndex);
                }

                if (scope.currentIndex + 1 > scope.attribute.values.length || scope.currentIndex < 0) {
                    $log.error('index must be in the range of the values array. index =', scope.currentIndex, 'values.length =', scope.attribute.values.length);
                }

                if (!angular.isFunction(scope.onChange)) {
                    $log.error('the attribute \'onChange\' must be of type \'function\': onChange =', scope.onChange, 'typeof =', typeof scope.onChange)
                }

                checkForLastEmptyElement();

                scope.pressedEnter = pressedEnter;
                scope.getMatches = getMatches;
                scope.getType = getType;

                scope.searchText = scope.attribute.values[scope.currentIndex].name;

                /*
                 // selects the whole input field when gaining focus
                 // perhaps this behavior is not expected and therefore the code is commented
                 var inputFieldElement = element.find("input")[0];
                 inputFieldElement.onfocus = function () {
                 inputFieldElement.select();
                 }
                 //*/

                function pressedEnter(event, valid) {
                    if (valid && event && event.keyCode === 13) {
                        modifyValuesToModelValues(scope.attribute.values);
                        scope.onChange();
                    } else {
                        checkForLastEmptyElement();
                    }
                }

                function checkForLastEmptyElement() {
                    // checks for one attribute value
                    if (scope.attribute.values.length === 0) {
                        scope.attribute.values.push('');
                        return;
                    }

                    // checks if more than one are allowed
                    if (!multipleMultiplicity()) {
                        return;
                    }

                    // adds an empty value if the last one is not empty
                    var lastValue = getStringValueOfType(scope.attribute.values.length - 1);
                    if (lastValue != '') {
                        scope.attribute.values.push('');
                    }
                }

                function multipleMultiplicity() {
                    var multiplicity = (((scope.attribute || {})
                        .attributeDefinition || {})
                        .multiplicity || '');

                    switch (multiplicity) {
                        case 'any':
                        case 'atLeastOne':
                            return true;
                        default:
                            return false;
                    }
                }

                function getStringValueOfType(index) {
                    switch (scope.type) {
                        case 'link':
                            return scope.attribute.values[index].name;
                        default:
                            return scope.attribute.values[index];
                    }
                }

                function modifyValuesToModelValues(values) {
                    for (var i = 0; i < values.length; i++) {
                        switch (scope.type) {
                            case 'percentage':
                                values[i] /= 100;
                                break;
                        }
                    }
                }

                var holder = {};
                function getMatches(partName) {
                    if(!holder.entities) {
                        holder.entities = [];
                        scAttributesService.findEntitiesOfWorkspace(sharedNavDataService.currentWorkspaceId)
                            .then(function (entities) {
                                holder.entities = entities;
                            }).catch(function () {
                                $log.error.apply($log, arguments);
                            });
                    }
                    return (holder.entities || []).filter(byLowerCasePartialName(partName));
                }

                function byLowerCasePartialName(partName) {
                    var search = angular.lowercase(partName);
                    return function byLowerCasePartialNameFunction(entity) {
                        var lowerName = angular.lowercase(entity.name);
                        return lowerName.indexOf(search) !== -1;
                    }
                }

                function getType() {
                    var attributeDefinitionType = (scope.attribute.attributeDefinition || {}).attributeType;

                    if (scope.type && scope.type !== '') {
                        return scope.type;
                    } else if (!!attributeDefinitionType) {
                        return angular.lowercase(attributeDefinitionType);
                    } else {
                        return scTypeGuessing.guessType(scope.attribute.values[scope.currentIndex]);
                    }
                }
            }
        };
    }
})();
