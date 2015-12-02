(function () {
    'use strict';

    angular
        .module('scAttributes')
        .directive('scAttributesTaskList', scAttributesTaskList);

    scAttributesTaskList.$inject = ['$log', 'scAttributesService'];

    function scAttributesTaskList($log, scAttributesService) {
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
                scope.addNewTask = addNewTask;

                // view variables

                scope.newTaskName = '';
                scope.newTaskAttribute = {};

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
                        }).catch(function () {
                            $log.error.apply($log, arguments);
                        });
                }

                function byLowerCasePartialName(partName) {
                    var search = angular.lowercase(partName);
                    return function byLowerCasePartialNameFunction(user) {
                        var lowerName = angular.lowercase(user.name);
                        return lowerName.indexOf(search) !== -1;
                    }
                }

                function updateMetadata(tasks, $index) {
                    setMetadataEdit(tasks[$index], false);
                    cleanExpertises(tasks, $index);

                    var task = tasks[$index];
                    var orgTask = orgTasks[$index];
                    if(Math.round(task.progress) !== orgTask.progress) {
                        task.isProgressCalculated = false;
                    }

                    scAttributesService.updateTask(task).then(function(uTask) {
                        tasks[$index] = uTask;
                        orgTasks[$index] = angular.copy(uTask);
                    })

                    // after successful update add both lines:
                    // entity.tasks[$index] = updatedTask
                    // orgTasks[$index] = angular.copy(updatedTask);
                }

                function abortMetadataEditing(tasks, $index) {
                    setMetadataEdit(tasks[$index], false);
                    tasks[$index] = angular.copy(orgTasks[$index]);
                }

                function editTask(task) {
                    setMetadataEdit(task, true);
                    ensureEmptyLastValue(task.expertises);
                }

                function cleanExpertises(tasks, $index) {
                    var task = tasks[$index];
                    task.expertises = task.expertises.filter(notEmpty);

                    function notEmpty(expertise) {
                        return expertise != '';
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
                    return scope.entity.attributes.filter(function (attr) {
                        return angular.lowercase(attr.name).indexOf(lower) != -1;
                    })
                }

                function addNewTask(newTaskName) {
                    scAttributesService.createTaskWithName(newTaskName)
                        .then(function (newTask) {
                            scope.entity.tasks.push(newTask);
                            orgTasks.push(angular.copy(newTask));
                            scope.newTaskName = '';
                        });
                }
            }
        };
    }
})();