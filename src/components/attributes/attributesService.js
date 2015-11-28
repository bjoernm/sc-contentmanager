'use strict';
(function (angular) {
    angular
        .module('scAttributes')
        .service('scAttributesService', scAttributesTableService);

    scAttributesTableService.$inject = ['scData', 'scPrincipal'];
    function scAttributesTableService(scData, scPrincipal) {
        return {
            updateEntity: updateEntity,
            updateAttribute: updateAttribute,
            deleteAttribute: deleteAttribute,
            createTaskWithName: createTaskWithName,
            findAllUsers: findAllUsers,
            persistEntity: persistEntity,
            updateTask: updateTask
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

        function persistEntity(entity) {
            return scData.Entity.update(entity).$promise;
        }

        function forTaskDateProps(task, doIt) {
            ['begin', 'end'].forEach(function (prop) {
                task[prop] = doIt(task[prop]);
            });
        }

        function updateTask(task) {
            //forTaskDateProps(task, function (prop) {
            //    return prop.getTime();
            //})

            return scData
                .Task
                .update(task)
                .$promise
                .then(function formatDates(nTask) {
                    //forTaskDateProps(nTask, function formatDatesPerProp(prop) {
                    //    return new Date(prop);
                    //});

                    return nTask;
                });
        }
    }
})(angular);