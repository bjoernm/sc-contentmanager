(function () {
    'use strict';

    angular.module('scMainNav')
        .service('scMainNavService', scMainNavService);

    scMainNavService.$inject = ['scCrud', '$cacheFactory', '$q', '$filter'];
    function scMainNavService(scCrud, $cacheFactory, $q, $filter) {
        var auth = {
            user: 'mustermann@test.sc',
            password: 'ottto'
        };

        var cache = $cacheFactory('scMainNavServiceCache');

        return {
            loadAllWorkspaces: loadAllWorkspaces,
            loadTextPages: loadTextPages,
            loadWorkspaceFromEntityUid: loadWorkspaceFromEntityUid
        };

        function loadWorkspaceFromEntityUid(entityUid) {
            return scCrud.findOneResource(auth, entityUid).then(function (entity) {
                return entity.workspace;
            })
        }

        function loadAllWorkspaces() {
            // Simulate async nature of real remote calls
            return scCrud.workspaces.findAll(auth);
        }

        function loadTextPages(workspaceUid) {
            var cachedEntity = cache.get(workspaceUid);
            // $log.info("cached enitity is resolved to ", cachedEntity);

            if (angular.isDefined(cachedEntity)) {
                return $q.when(cachedEntity);
            }

            return scCrud.findAll(auth, workspaceUid + '/entities?meta=parent,workspace')
                .then(buildTree);

            function buildTree(entities) {
                var tree = [];
                var map = {};

                entities.forEach(buildMap(map));
                entities.forEach(buildIndexBasedOn(map, tree));

                return {
                    index: map,
                    tree: tree,
                    list: entities
                };
            }

            function addHierarchyInfo(entity) {
                var level = 1;
                var completeEntityAddress = entity.uid;
                while (entity.parent) {
                    level++;
                    completeEntityAddress = entity.parent.uid + completeEntityAddress;
                    entity = entity.parent;
                }

                entity.hierarchyInfo = {
                    'level': level,
                    'completeAddress': completeEntityAddress
                }
            }

            function buildIndexBasedOn(map, tree) {
                return function buildIndexBasedOnFunction(entity) {
                    if (entity.parent && entity.parent.uid) {
                        // connect in both directions
                        var parentEntity = map[entity.parent.uid];
                        entity.parent = parentEntity;
                        parentEntity.children.push(entity);
                    } else {
                        tree.push(entity);
                    }
                }
            }

            function buildMap(map) {
                return function buildMapFunction(entity) {
                    map[entity.uid] = entity;
                    entity.children = [];
                }
            }

            function findTextPageType(types) {
                var type = types.find(function (element) {
                    return element.name === "Text Page";
                });

                return [type];
            }

            function loadEntities(types) {
                var promises = [];

                for (var i = 0; i < types.length; i++) {
                    var type = types[i];
                    var id = type.uid.substr(1 + type.uid.indexOf("/"));
                    promises.push(scCrud.entities.findAll(auth, id));
                }

                return $q.all(promises).then(function flatten(entities) {

                    var flattenArray = [];
                    flattenArray = flattenArray.concat.apply(flattenArray, entities);
                    flattenArray = $filter('orderBy')(flattenArray, 'name');
                    return flattenArray;
                })
            }

            function addToCache(entities) {
                cache.put(workspaceUid, entities);
                return entities;
            }

            function addWorkspaceIdToEntities(entities) {
                entities.forEach(addWorkspaceId);
                return entities;

                function addWorkspaceId(entity) {
                    entity.workspace = {
                        'uid': workspaceUid
                    };
                }
            }
        }
    }

})();