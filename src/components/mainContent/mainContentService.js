(function (angular) {
    'use strict';

    angular
        .module('scMainContent')
        .service('scMainContentService', mainContentService);

    mainContentService.$inject = ['$q', '$log', 'scCrud'];

    var auth = {
        'user': 'mustermann@test.sc',
        'password': 'ottto'
    }

    function mainContentService($q, $log,  scCrud) {
        return {
            getPage: getPage,
            getTestEntity: getTestEntity
        };

        function getPage(entityUid) {
            /*
            if (!!console) {
                console.groupCollapsed("mainContentService StackTrace")
                console.trace();
                console.info("called uid: " + entityUid);
                console.groupEnd()
            }
            //*/

            //scCrud.workspaces.findAll(auth).then($log.info);
            //scCrud.types.findAll(auth, "107yhdgc7q9u6").then($log.info);
            //scCrud.entities.findAll(auth, "1mrntujl9cgcn").then($log.info);

            var options = {
                includeDetails: true,
                resolveProperties: true,
                unwrap: false,
                resolveReferences: false
            };

            var entityId = entityUid;
            var indexOfSlash = entityId.indexOf("/");
            if (indexOfSlash != -1) {
                entityId = entityId.substr(indexOfSlash + 1);
                //$log.info("entity id was uid. converting", entityUid, "->", entityId);
            }

            return scCrud.entities
                .findOne(auth, entityId, options)
                .then(attachType)
                .then(formatEntity);
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
            var slashIndex = entity.type.uid.indexOf("/");
            var id = entity.type.uid.substr(slashIndex + 1);
            return scCrud.types.findOne(auth, id)
                .then(function success(type) {
                    entity.type = type;
                    return entity;
                })
                .catch(function error() {
                    $log.error("could not get type", entity.type.uid, "of entity", entity.uid);
                    $log.error.apply($log, arguments);
                });
        }

        function convertDates(entity) {
            // convert task's startdate and enddate
            if (entity.tasks) {
                for (var i = 0; i < entity.tasks.length; i++) {
                    var task = entity.tasks[i];
                    task.startdate = new Date(task.startdate);
                    task.enddate = new Date(task.enddate);
                }
            }

            if (entity.attributes) {
                for (var i = 0; i < entity.attributes.length; i++) {
                    var attribute = entity.attributes[i];
                    if (attribute.type === "date") {
                        for (var j = 0; j < attribute.values.length; j++) {
                            attribute.values[j] = new Date(attribute.values[j]);
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

        function getTestEntity() {
            var entity = getEntityBosten();

            formatEntity(entity);

            return entity;
        }

        function getEntityBosten() {
            return {
                "uid": "entities/12fdsfo3xy48g",
                "workspace": {
                    "uid": "workspaces/northwind",
                    "name": "Northwind"
                },
                "versions": [
                    {
                        "date": "2015-07-09 02:19:12.515",
                        "person": "An unknown user",
                        "action": "Edited",
                        "description": "Hide Tags",
                        "type": "_edit"
                    },
                    {
                        "date": "2015-07-09 02:17:40.128",
                        "person": "An unknown user",
                        "action": "Added",
                        "type": "_new"
                    }
                ],
                "permissions": [
                    {
                        "role": "Writers",
                        "principals": []
                    },
                    {
                        "role": "Readers",
                        "principals": []
                    }
                ],
                "name": "Northwind - Home",
                "attributes": [
                    {
                        "values": [
                            {
                                "uid": "entities/seafood",
                                "name": "Seafood"
                            }
                        ],
                        "name": "Category",
                        "type": "link"
                    },
                    {
                        "values": [
                            "18.4"
                        ],
                        "name": "Price",
                        "type": "number"
                    },
                    {
                        "values": [
                            {
                                "uid": "entities/newengland",
                                "name": "New England Seafood Cannery"
                            }
                        ],
                        "name": "Supplier",
                        "type": "link"
                    }
                ],
                "type": {
                    "uid": "types/66m0lreoeqzz",
                    "name": "Text Page"
                },
                "incomingReferences": [],
                "content": "<p>\r\n\tThe <strong>Northwind Traders</strong> sample database contains the\r\n\tsales data for a fictitious company called Northwind Traders, which\r\n\timports and exports specialty foods from around the world. [<a\r\n\t\thref=\"http://northwinddatabase.codeplex.com/\" target=\"_blank\">Microsoft</a>]\r\n</p>\r\n<table class=\"tricia-default-table\">\r\n\t<tbody>\r\n\t\t<tr>\r\n\t\t\t<td></td>\r\n\t\t\t<td></td>\r\n\t\t</tr>\r\n\t</tbody>\r\n</table>",
                "tasks": [{
                    "uid": "tasks/1234",
                    "name": "My sample task",
                    "attributes": [
                        {
                            "name": "Price"
                        },
                        {
                            "name": "Supplier"
                        }
                    ],
                    "progress": 0.5767,
                    "startdate": "2015-07-01T00:00:00.000+02:00",
                    "enddate": "2015-09-30T23:59:59.999+02:00",
                    "owner": {
                        "uid": "person/huhu",
                        "name": "Huli Hululu"
                    },
                    "expertises": [
                        {
                            "uid": "expertise/123",
                            "name": "HTML"
                        }, {
                            "uid": "expertise/456",
                            "name": "JavaScript"
                        }
                    ]
                }, {
                    "uid": "tasks/23vtnph",
                    "name": "My second sample",
                    "attributes": [
                        {
                            "name": "Category"
                        }
                    ],
                    "progress": 0.13,
                    "startdate": "2015-08-01T00:00:00.000+02:00",
                    "enddate": "2015-10-15T23:59:59.999+02:00",
                    "owner": {
                        "uid": "person/michi",
                        "name": "Michi"
                    },
                    "expertises": [
                        {
                            "uid": "expertise/789",
                            "name": "Something"
                        }, {
                            "uid": "expertise/012",
                            "name": "Different"
                        }
                    ]
                }]
            }
        }
    }
})(angular);