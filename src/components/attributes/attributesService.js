'use strict';
(function (angular) {
    angular
        .module('scAttributes')
        .service('scAttributesService', scAttributesTableService);

    scAttributesTableService.$inject = ['$log', 'scData', 'scPrincipal'];
    function scAttributesTableService($log, scData, scPrincipal) {
        return {
            updateEntity: updateEntity,
            updateAttribute: updateAttribute,
            deleteAttribute: deleteAttribute,
            createTaskWithName: createTaskWithName,
            findAllUsers: findAllUsers,
            persistEntity: persistEntity,
            createAttribute: createAttribute,
            createNewTask: createNewTask,
            updateTask: updateTask,
            deleteTask: deleteTask,
            findEntitiesOfWorkspace: findEntitiesOfWorkspace,
            findAllExpertises: findAllExpertises
        };

        function findAllUsers() {
            return scPrincipal.User.query().$promise;
        }

        function createTaskWithName(newTaskName) {
            if (!newTaskName || newTaskName == '') {
                throw new Error("taskname must not be empty.");
            }

            if (taskNameIsAlreadyPresent) {
                throw Error("task must only be once in the page");
            }

            return scData.Task.save({
                'name': newTaskName
            }).$promise;
        }

        function updateEntity(entity) {
            if (!angular.isObject(entity)) {
                throw new Error('entity must be an object!');
            }

            if (!entity.id) {
                throw new Error('entity must have an ID');
            }

            return scData.Entity
                .update(entity).$promise;
        }

        function updateAttribute(attribute) {
            return scData.Attribute.update(attribute).$promise;
        }

        function deleteAttribute(attribute) {
            return scData.Attribute.delete({'id': attribute.id}).$promise;
        }

        function createAttribute(newAttr) {
            return scData.Attribute.save(newAttr).$promise;
        }

        function persistEntity(entity) {
            return scData.Entity.update(entity).$promise;
        }

        function forTaskDateProps(task, doIt) {
            ['begin', 'end'].forEach(function (prop) {
                task[prop] = doIt(task[prop]);
            });
        }

        function updateTask(orgTask, repeatScope) {
            var task = angular.copy(orgTask);

            if(!task.owner) {
                task.owner = null;
            }

            //forTaskDateProps(task, function (prop) {
            //    return prop.getTime();
            //})

            return scData
                .Task
                .update(task)
                .$promise
                .then(function formatDates(nTask) {
                    $log.warn('received');
                    forTaskDateProps(nTask, function formatDatesPerProp(prop) {
                        return new Date(prop);
                    });

                    return nTask;
                });
        }

        function findEntitiesOfWorkspace(workspaceId) {
            var searchObject = {'id': workspaceId};
            return scData.Workspace.getEntities(searchObject).$promise;
        }

        function createNewTask(taskName, entity) {
            if (!taskName || !entity) {
                $log.error('could not create task, because either taskName or entity was not defined: taskName =', taskName, '; entity =', entity)
                return;
            }

            var task = {
                'name': taskName,
                'entity': {
                    'id': entity.id
                }
            }

            return scData.Task.save(task).$promise;
        }

        function findAllExpertises() {
            return scData.Expertise.query().$promise;
        }

        function deleteTask(task) {
            var id = {
                'id': task.id
            }

            return scData.Task.delete(id).$promise;
        }
    }
})(angular);