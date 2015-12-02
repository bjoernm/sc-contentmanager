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
                scope.addNewTask = addNewTask;
                scope.newTaskName = '';
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
                        .catch(logError)
                        .finally(enable);

                    function enable() {
                        $event.srcElement.disabled = false;
                    }

                    function manageUI() {
                        if (scope.vm && scope.vm.newAttributeName)
                            scope.vm.newAttributeName = '';


                        $event.srcElement.blur();
                    }
                }

                function addNewTask() {
                    var newTaskName = scope.newTaskName;

                    if (!newTaskName || newTaskName === '') {
                        return;
                    }

                    scAttributesService
                        .createNewTask(newTaskName, scope.entity)
                        .then(function (task) {
                            scope.entity.tasks.push(task);
                            scope.newTaskName = '';
                            scope.onChange();
                        })
                        .catch(logError);
                }

                function logError() {
                    $log.error.apply($log, arguments);
                }
            }
        };
    }
})();