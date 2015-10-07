(function () {
    'use strict';

    angular
        .module('scAttributeValueEdit')
        .directive('scAttributeValueEdit', attributeValueEditDirective);

    attributeValueEditDirective.$inject = ['$log'];

    function attributeValueEditDirective($log) {
        return {
            restrict: 'E',
            templateUrl: 'components/attributes/attributeValueEdit/attributeValueEdit.tpl.html',
            replace: true,
            scope: {
                orgAttribute: '=attribute',
                onChange: '&',
                onAbort: '&'
            },
            link: function (scope, element, attrs) {
                if (angular.isArray(scope.orgAttribute) || !angular.isObject(scope.orgAttribute)) {
                    throw new TypeError('the attribute \'attribute\' is no object: typeof attribute == ' + (typeof scope.orgAttribute));
                }

                if (!angular.isFunction(scope.onChange)) {
                    throw new TypeError('the attribute \'onChange\' must be of type \'function\'' +
                    ': typeof onChange == ' + (typeof scope.onChange))
                }

                if (!angular.isFunction(scope.onAbort)) {
                    throw new TypeError('the attribute \'onAbort\' must be of type \'function\'')
                }

                scope.attribute = angular.copy(scope.orgAttribute);
                scope.pressedEnter = pressedEnter;
                scope.abort = abort;
                scope.getMatches = getMatches;

                // set view specific settings
                //*
                for (var i = 0; i < scope.attribute.values.length; i++) {
                    switch (scope.attribute.type) {
                        case 'percentage':
                            scope.attribute.values[i] *= 100;
                            break;
                    }
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

                function abort() {
                    scope.onAbort()
                }

                function pressedEnter(event, valid) {
                    if (valid && event && event.keyCode === 13) {
                        var values = modifyValuesToModelValues(scope.attribute.values);
                        $log.info("calling onChange", values, scope.attribute.values);
                        scope.onChange({
                            'newValues': values
                        });

                    }
                }

                function modifyValuesToModelValues(values) {
                    values = angular.copy(values);

                    for (var i = 0; i < values.length; i++) {
                        switch (scope.attribute.type) {
                            case 'percentage':
                                values[i] /= 100;
                                break;
                        }
                    }

                    return values;
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