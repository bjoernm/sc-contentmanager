(function () {
    'use strict';

    angular
        .module('scAttributes')
        .directive('scAttributes', attributesDirective);

    attributesDirective.$inject = ['$log', 'scAttributesService', '$mdDialog'];
    function attributesDirective($log, scAttributesService, $mdDialog) {
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
                scope.onAttributeDelete = onAttributeDelete;
                scope.vm = {};

                function onAttributeDelete(attribute) {
                    var confirmDialog = $mdDialog.confirm()
                        .title('Please Confirm')
                        .textContent('Do you really want to delete the attribute \'' + attribute.name + '\'?')
                        .ok('Ok')
                        .cancel('No');

                    $mdDialog.show(confirmDialog)
                        .then(function () {
                            scAttributesService
                                .deleteAttribute(attribute)
                                .then(scope.onChange);
                        })
                }

                function addNewEntityAttribute($event, name) {
                    if ($event.keyCode !== 13 || !name || name === '') {
                        return;
                    }


                    ($event.srcElement || {}).disabled = true;

                    var newAttr = {
                        'name': name,
                        'entity': {
                            'id': scope.entity.id
                        }
                    };

                    // scope.entity.attributes.push(newAttr);

                    scAttributesService
                        .createAttribute(newAttr)
                        .then(manageUI)
                        .then(scope.onChange)
                        .catch(logError)
                        .finally(enable);

                    function enable() {
                        $event.srcElement.disabled = false;
                    }

                    // clear and blur input field
                    function manageUI() {
                        if (scope.vm && scope.vm.newAttributeName)
                            scope.vm.newAttributeName = '';

                        // if srcElement exists and has a function blur, call it
                        if(!!$event.srcElement && !!$event.srcElement.blur) {
                            $event.srcElement.blur();
                        }
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