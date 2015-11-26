(function () {
    'use strict';

    angular
        .module('scAttributes')
        .directive('scAttributesTaskTable', attributesTaskTableDirective);

    attributesTaskTableDirective.$inject = ['$log', 'scCrud', 'scAuth'];

    function attributesTaskTableDirective($log, scCrud, scAuth) {
        return {
            restrict: 'E',
            templateUrl: 'components/attributes/attributesTaskTable/attributesTaskTable.tpl.html',
            replace: true,
            scope: {
                entity: '='
            },
            link: function (scope, element, attrs) {
                if (!angular.isObject(scope.entity) || !angular.isArray(scope.entity.tasks)) {
                    $log.warn('the attribute \'tasks\' must be of type array: tasks = ', scope.tasks);
                    scope.tasks = [];
                }

                var orgTasks = angular.copy(scope.entity.tasks);

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
                    return scCrud.users.findAll(scAuth)
                        .then(function (users) {
                            return users.filter(byLowerCasePartialName(partName))
                        }).catch(function () {
                            $log.error.apply($log, arguments);
                        });
                }

                function byLowerCasePartialName(partName) {
                    var search = angular.lowercase(partName);
                    return function byLowerCasePartialNameFunction(user) {
                        return user.name.indexOf(search) !== -1;
                    }
                }

                function updateMetadata(tasks, $index) {
                    setMetadataEdit(tasks[$index], false);
                    cleanExpertises(tasks, $index);

                    //TODO implement task update!
                    $log.warn("implement task update!");

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
                    if(!newTaskName || newTaskName == '') {
                        throw new Error("taskname must not be empty.");
                    }

                    if(taskNameIsAlreadyPresent) {
                        throw Error("task must only be once in the page");
                    }

                    scCrud.tasks
                        .create(newTaskName)
                        .then(function(newTask) {
                            scope.entity.tasks.push(newTask);
                            orgTasks.push(angular.copy(newTask));
                            scope.newTaskName = '';
                        });
                }
            }
        };
    }
})();