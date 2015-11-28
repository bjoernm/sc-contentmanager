(function (angular) {
    'use strict';

    angular
        .module('scMainContent')
        .service('scMainContentService', mainContentService);


    mainContentService.$inject = ['$q', '$log', 'scData', 'scModel', '$cacheFactory'];
    function mainContentService($q, $log, scData, scModel, $cacheFactory) {

        return {
            getPage: getPage
        };

        function getPage(entityId) {
            return scData.Entity
                .get({id: entityId}).$promise
                .then(attachType)
                //.then(addTestTask)
                .then(formatEntity)
                .catch(errorInMainContentService);
        }

        function errorInMainContentService() {
            $log.error("The following error appeared in the scMainContentService");
            $log.error.apply($log, arguments);
        }

        function addTestTask(entity) {
            if (!angular.isArray(entity.tasks)) entity.tasks = [];

            entity.tasks.push(getTestTask());
            return entity
        }

        function formatEntity(entity) {
            var copy = entity;//angular.copy(entity);


            // ATTENTION: The attributes of the page itself
            // and the attributes of the task must share
            // the SAME javascript object reference!

            // Therefore the attributes have to be reassigned!
            mapTaskAttributesToPageAttributes(copy);

            // Convert dates from string values to javascript date objects
            convertDates(copy);

            return copy;
        }

        function attachType(entity) {
            if (!entity || !entity.entityType || !entity.entityType.id) {
                $log.error("the given entity has no entityType or entityType.id. Entity:", entity);
                throw new Error("the given entity has no entityType or entityType.id");
            }

            return scModel.EntityType
                .get({id: entity.entityType.id}).$promise
                .then(function success(entityType) {
                    entity.entityType = entityType;
                    return entity;
                })
                .catch(errorInMainContentService);
        }

        function convertDates(entity) {
            // convert task's startdate and enddate
            if (entity.tasks) {
                for (var i = 0; i < entity.tasks.length; i++) {
                    var task = entity.tasks[i];
                    if (!!task.begin) {
                        task.begin = new Date(task.begin);
                    }

                    if (!!task.end) {
                        task.end = new Date(task.end);
                    }
                }
            }

            if (entity.attributes) {
                for (var i = 0; i < entity.attributes.length; i++) {
                    var attribute = entity.attributes[i];
                    if (attribute.type === "date") {
                        for (var j = 0; j < attribute.values.length; j++) {
                            if (!!attribute.values[j]) {
                                attribute.values[j] = new Date(attribute.values[j]);
                            }
                        }
                    }
                }
            }
        }

        /**
         * ATTENTION: The attributes of the page itself and the
         * attributes of the task must share the SAME javascript
         * object reference!
         *
         * @param entity the entity object to map the attributes
         */
        function mapTaskAttributesToPageAttributes(entity) {
            if (entity.tasks && entity.attributes) {
                var attributesObject = {};

                for (var i = 0; i < entity.attributes.length; i++) {
                    var attribute = entity.attributes[i];
                    attributesObject[attribute.name] = attribute;
                }

                for (var i = 0; i < entity.tasks.length; i++) {
                    var task = entity.tasks[i];
                    for (var j = 0; j < task.attributes.length; j++) {
                        task.attributes[j] = attributesObject[task.attributes[j].name];
                    }
                }
            }
        }

        function getTestTask() {
            return {
                "skippedAt": null,
                "expertises": [],
                "name": "Fill out requirements",
                "progress": 0.5,
                "end": "2015-11-27T23:00:00.000Z",
                "attributes": [],
                "id": "11wk9ferdgrk7",
                "href": "http://localhost:8083/intern/tricia/api/v1/tasks/11wk9ferdgrk7",
                "taskDefinition": {
                    "name": "Fill out requirements",
                    "id": "1mzdaj1k3olbw",
                    "href": "http://localhost:8083/intern/tricia/api/v1/taskDefinitions/1mzdaj1k3olbw"
                },
                "begin": "2015-11-21T23:00:00.000Z",
                "skipped": false,
                "finishedAt": null,
            }
        }
    }
})(angular);