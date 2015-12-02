(function () {
    'use strict';

    angular
        .module('scAttributes')
        .directive('scAttributes', attributesDirective);

    attributesDirective.$inject = ['$log', 'scAttributesService'];
    function attributesDirective($log, scAttributesService) {
        return {
            restrict: 'E',
            templateUrl: 'components/attributes/attributes.tpl.html',
            replace: true,
            scope: {
                entity: "=",
                onChange: '&'
            },
            link: function (scope, element, attrs) {
                if (!angular.isObject(scope.entity)) {
                    $log.error('the attribute \'entity\' is required in this directive. entity = ', scope.entity);
                    return false;
                }

                scope.addNewEntityAttribute = addNewEntityAttribute;
                scope.vm = {};

                function addNewEntityAttribute($event, name) {
                    if ($event.keyCode !== 13 || !name || name === '') {
                        return;
                    }

                    $event.srcElement.disabled = true;

                    var newAttr = {
                        'name': name,
                        'values': [],
                        'type': ''
                    }

                    scope.entity.attributes.push(newAttr);

                    scAttributesService
                        .persistEntity(scope.entity)
                        .then(manageUI)
                        .then(scope.onChange)
                        .finally(enable);

                    function enable() {
                        $event.srcElement.disabled = true;
                    }

                    function manageUI() {
                        if (scope.vm && scope.vm.newAttributeName)
                            scope.vm.newAttributeName = '';

                        $event.srcElement.blur();
                    }
                }
            }
        };
    }
})();