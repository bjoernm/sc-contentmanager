(function () {
    'use strict';

    angular
        .module('scAttributes')
        .directive('scAttributesTaskList', scAttributesTaskList);

    scAttributesTaskList.$inject = ['$log', 'scAttributesService', '$mdDialog'];

    function scAttributesTaskList($log, scAttributesService, $mdDialog) {
        return {
            restrict: 'E',
            templateUrl: 'components/attributes/attributesTaskList/attributesTaskList.tpl.html',
            replace: true,
            scope: {
                tasks: '=',
                pageAttributes: '=',
                onChange: '&'
            },
            link: function (scope, element, attrs) {
                if (!angular.isArray(scope.tasks)) {
                    $log.warn('the attribute \'tasks\' must be of type array: tasks = ', scope.tasks);
                    scope.tasks = [];
                }

                var orgTasks = angular.copy(scope.tasks);

                scope.metadataOnKeyUp = metadataOnKeyUp;
                scope.ensureEmptyLastValue = ensureEmptyLastValue;
                scope.getUsersBySearch = getUsersBySearch;
                scope.updateMetadata = updateMetadata;
                scope.abortMetadataEditing = abortMetadataEditing;
                scope.isInEdit = isInEdit;
                scope.editTask = editTask;
                scope.searchInAttributes = searchInAttributes;
                scope.addNewTaskAttribute = addNewTaskAttribute;
                scope.addNewTask = addNewTask;
                scope.enterPressed = enterPressed;
                scope.getExpertisesBySearch = getExpertisesBySearch;
                scope.deleteTask = deleteTask;
                scope.deleteAttributeInTask = deleteAttributeInTask;
                scope.skipTask = skipTask;
                scope.completeTask = completeTask;
                scope.filterSkipped = filterSkipped;

                // view variables

                scope.newTaskName = '';
                scope.newTaskAttribute = {};
                scope.searchTexts = {};
                scope.vm = {};

                function filterSkipped(value, index, array) {
                    return !value.skipped;
                }

                function completeTask(task) {
                    var confirmDialog = $mdDialog.confirm()
                        .title('Please Confirm')
                        .textContent([
                            'Do you really want to COMPLETE the task \'',
                            task.name,
                            '\'?'
                        ].join(''))
                        .ok('Ok')
                        .cancel('No');

                    $mdDialog.show(confirmDialog)
                        .then(doComplete);

                    function doComplete() {
                        var newTask = angular.copy(task);
                        newTask.progress = 100;

                        scAttributesService.updateTask(newTask)
                            .then(scope.onChange);
                    }
                }

                function skipTask(task) {
                    var confirmDialog = $mdDialog.confirm()
                        .title('Please Confirm')
                        .textContent([
                            'Do you really want to SKIP the task \'',
                            task.name,
                            '\'?'
                        ].join(''))
                        .ok('Ok')
                        .cancel('No');

                    $mdDialog.show(confirmDialog)
                        .then(doSkip);

                    function doSkip() {
                        var newTask = angular.copy(task);
                        newTask.skipped = true;

                        scAttributesService.updateTask(newTask)
                            .then(scope.onChange);
                    }
                }

                // attribute comes from the attributeListDirective. task is from the repeat scope.
                function deleteAttributeInTask(attribute, task) {
                    var confirmDialog = $mdDialog.confirm()
                        .title('Please Confirm')
                        .textContent([
                            'Do you really want to remove the attribute \'',
                            attribute.name,
                            '\' from the task \'',
                            task.name,
                            '\'?'
                        ].join(''))
                        .ok('Ok')
                        .cancel('No');

                    $mdDialog.show(confirmDialog)
                        .then(doDelete);

                    function doDelete() {
                        var attrId = attribute.id;
                        var newTask = angular.copy(task);

                        newTask.attributes = newTask.attributes.filter(attr);

                        scAttributesService.updateTask(newTask)
                            .then(scope.onChange);

                        function attr(ele) {
                            return attrId != ele.id;
                        }
                    }
                }

                function metadataOnKeyUp($event, expertises) {
                    if (pressedEnter($event)) {

                    } else {
                        ensureEmptyLastValue(expertises);
                    }

                }

                function ensureEmptyLastValue(array) {
                    if (angular.isArray(array) && array[array.length - 1] != '') {
                        array.push('');
                    }
                }

                function taskToExpertises(task) {
                    return task.expertises;
                }

                function getUsersBySearch(partName) {
                    return scAttributesService.findAllUsers()
                        .then(function (users) {
                            return users.filter(byLowerCasePartialName(partName))
                        })
                        .catch(logError);
                }

                function byLowerCasePartialName(partName) {
                    var search = angular.lowercase(partName);
                    return function byLowerCasePartialNameFunction(user) {
                        var lowerName = angular.lowercase(user.name);
                        return lowerName.indexOf(search) !== -1;
                    }
                }

                function updateMetadata(task) {
                    // using this two values directly in the template did not work
                    var $index = scope.tasks.indexOf(task);
                    var tasks = scope.tasks;

                    setMetadataEdit(tasks[$index], false);
                    cleanExpertises(tasks, $index);

                    var orgTask = orgTasks[$index];
                    if (Math.round(task.progress) !== orgTask.progress) {
                        task.isProgressCalculated = false;
                    }

                    scAttributesService
                        .updateTask(task)
                        .then(function (uTask) {
                            tasks[$index] = uTask;
                            orgTasks[$index] = angular.copy(uTask);
                        })
                        .then(scope.onChange)
                        .catch(logError);

                }

                function abortMetadataEditing(task) {
                    // using this two values directly in the template did not work
                    var index = scope.tasks.indexOf(task);
                    var orgTask = orgTasks[index];

                    setMetadataEdit(task, false);
                    $log.info(task, orgTask);
                    ['progress', 'begin', 'end', 'owner', 'expertises'].forEach(function (prop) {
                        task[prop] = angular.copy(orgTask[prop]);
                    });
                }

                function editTask(task) {
                    setMetadataEdit(task, true);
                    ensureEmptyLastValue(task.expertises);
                }

                function cleanExpertises(tasks, $index) {
                    var task = tasks[$index];
                    task.expertises = task.expertises.filter(notEmpty);

                    function notEmpty(expertise) {
                        return angular.isObject(expertise) && expertise.name && expertise.name != '';
                    }
                }

                var editStates = {};

                function isInEdit(taskId) {
                    return !!editStates[taskId];
                }

                function setMetadataEdit(task, edit) {
                    editStates[task.id] = edit;
                }

                function searchInAttributes(searchText) {
                    var lower = angular.lowercase(searchText);
                    return scope.pageAttributes.filter(function (attr) {
                        return angular.lowercase(attr.name).indexOf(lower) != -1;
                    })
                }

                function addNewTask(newTaskName) {
                    scAttributesService.createTaskWithName(newTaskName)
                        .then(function (newTask) {
                            scope.tasks.push(newTask);
                            orgTasks.push(angular.copy(newTask));
                            scope.newTaskName = '';
                        })
                        .catch(logError);
                }

                function addNewTaskAttribute(task, $event) {
                    var newAttr = scope.newTaskAttribute[task.id];

                    if (!newAttr) {
                        $log.info('could not add new task attribute; task =', task, '; newTaskAttribute =', scope.newTaskAttribute);
                        return;
                    } else if (!newAttr.id || !scope.pageAttributes.find(attributeById(newAttr.id))) {
                        //FIXME show mdDialog beware that newAttr can be a string or an object from side effects?
                        $log.error("'do you want to create a new page attribute' called: ", newAttr, '; pageAttributes =', scope.pageAttributes, '; findbyId =', scope.pageAttributes.find(attributeById(newAttr.id)));
                    } else if (!!task.attributes.find(attributeById(newAttr.id))) {
                        //FIXME show mdDialog
                        $log.error("attribute is already in task");
                    } else {
                        task.attributes.push(newAttr);
                        scAttributesService
                            .updateTask(task)
                            .then(function (nTask) {
                                scope.newTaskAttribute[task.id] = null;
                                scope.searchTexts[task.id] = null;
                                scope.onChange();

                                // calls the last element if the others exist
                                $event
                                && $event.srcElement
                                && $event.srcElement.blur
                                && $event.srcElement.blur();
                            })
                            .catch(logError);
                    }

                    $log.info(scope.newTaskAttribute);

                    function attributeById(attrId) {
                        return function attributeByIdFunction(pageAttr) {
                            return pageAttr.id === attrId;
                        }
                    }
                }

                function enterPressed($event, task) {
                    $log.info('enterPressed', $event, scope.newTaskAttribute[task.id]);
                }

                function getExpertisesBySearch(searchedExpertise) {
                    return scAttributesService.findAllExpertises()
                        .then(function (expertises) {
                            return expertises.filter(byLowerCasePartialName(searchedExpertise));
                        }).catch(logError);
                }

                function deleteTask(task) {
                    var confirm = $mdDialog.confirm()
                        .title('Please confirm')
                        .textContent('Do you really want to delete the task \'' + task.name + '\'?')
                        .ariaLabel('Delete confirm')
                        .ok('Yes, delete!')
                        .cancel('No!');

                    $mdDialog
                        .show(confirm)
                        .then(confirmedDeletion, angular.noop);

                    function confirmedDeletion() {
                        scAttributesService
                            .deleteTask(task)
                            .then(removeTaskFromList)
                            .then(scope.onChange)
                            .catch(logError);
                    }

                    function removeTaskFromList() {
                        var index = scope.tasks.findIndex(byId(task.id));
                        if (index > -1) {
                            scope.tasks.splice(index, 1);
                            orgTasks.splice(index, 1);
                        } else {
                            $log.warn("could not remove task from tasks list because index of task was", index);
                        }
                    }
                }

                function logError() {
                    $log.error.apply($log, arguments);
                }

                function byId(id) {
                    return function(other) {
                        return other.id === id;
                    }
                }
            }
        };
    }
})();