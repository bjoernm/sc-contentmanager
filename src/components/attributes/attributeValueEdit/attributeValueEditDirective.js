'use strict';

(function () {
    angular
        .module('scAttributes')
        .directive('scAttributeValueEdit', attributeValueEditDirective);

    attributeValueEditDirective.$inject = ['$log'];

    function attributeValueEditDirective($log) {
        return {
            restrict: 'E',
            templateUrl: 'components/attributes/attributeValueEdit/attributeValueEdit.tpl.html',
            replace: true,
            scope: {
                values: '=',
                index: '=',
                attributeName: '@',
                type: '@',
                onChange: '&'
            },
            link: function (scope, element, attrs) {
                if (!angular.isArray(scope.values) || !(scope.values instanceof Array)) {
                    $log.error('values must be an array. values =', scope.values, 'typeof =', typeof scope.values);
                }

                if (!isFinite(scope.index)) {
                    $log.error('index must be a number. index =', scope.index, 'typeof =', typeof scope.index);
                }

                if (scope.index + 1 > scope.values.length || scope.index < 0) {
                    $log.error('index must be in the range of the values array. index =', scope.index, 'values.length =', scope.values.length);
                }

                if (!angular.isFunction(scope.onChange)) {
                    $log.error('the attribute \'onChange\' must be of type \'function\': onChange =', scope.onChange, 'typeof =', typeof scope.onChange)
                }

                checkForLastEmptyElement();

                scope.pressedEnter = pressedEnter;
                scope.getMatches = getMatches;

                // set view specific settings
                //*
                switch (scope.type) {
                    case 'percentage':
                        scope.values[scope.index] *= 100;
                        break;
                }

                // */
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
                        modifyValuesToModelValues(scope.values);
                        scope.onChange();
                    } else {
                        checkForLastEmptyElement();
                    }
                }

                function checkForLastEmptyElement() {
                    if (scope.values.length === 0) {
                        scope.values.push('');
                        return;
                    }

                    var lastValue = getStringValueOfType(scope.values.length - 1);

                    if (lastValue != '') {
                        scope.values.push('');
                    }
                }

                function getStringValueOfType(index) {
                    switch (scope.type) {
                        case 'link':
                            return scope.values[index].name;
                        default:
                            return scope.values[index];
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

                function getMatches(searchText) {
                    return [
                        {
                            "uid": "entities/seafood",
                            "name": "Seafood"
                        },
                        {
                            "uid": "entities/landfood",
                            "name": "Landfood"
                        }
                    ].filter(function (s) {
                            var name = s.name.toLowerCase();
                            var lowerSearch = searchText.toLowerCase();
                            return name.indexOf(lowerSearch) !== -1
                        });
                }
            }
        };
    }
})();