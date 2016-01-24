(function () {
    'use strict';

    angular.module('scMainNav')
        .service('scMainNavService', scMainNavService);

    scMainNavService.$inject = ['scData', '$q', '$filter', 'scUtil', '$resource'];
    function scMainNavService(scData, $q, $filter, scUtil, $resource) {
        // var cache = $cacheFactory('scMainNavServiceCache');

        var searchHints = $resource(scUtil.getFullUrl("searchHints"));

        return {
            loadAllWorkspaces: loadAllWorkspaces,
            loadTextPages: loadTextPages,
            getSearchHints: getSearchHints
        };

        function getSearchHints(searchText) {
            return searchHints.get({'q': searchText}).$promise.then(function(data){
                console.log(data.hints);
                return data.hints;
            });

        }

        function loadAllWorkspaces() {
            // Simulate async nature of real remote calls
            return scData.Workspace.query().$promise;
        }

        function loadTextPages(workspaceId) {
            return scData.Workspace
                .getEntities({
                    'id': workspaceId,
                    'meta': 'parent,workspace'
                }).$promise
                .then(buildTree);

            function buildTree(entities) {
                var tree = [];
                var map = {};

                entities.forEach(buildMap(map));
                entities.forEach(buildIndexBasedOn(map, tree));
                entities.forEach(addHierarchyInfo);
                entities = entities.sort(sortEntities);

                return {
                    index: map,
                    tree: tree,
                    list: entities
                };
            }

            function sortEntities(a, b) {
                a = a.hierarchyInfo.completeAddress;
                b = b.hierarchyInfo.completeAddress;
                if (a === b) {
                    return 0;
                } else if (typeof a === 'undefined') {
                    return 1;
                } else if (typeof b === 'undefined') {
                    return -1;
                } else {
                    return a.localeCompare(b);
                }
            }

            function addHierarchyInfo(entity) {
                var level = 0;
                var completeEntityAddress = entity.name;
                var currentEntity = entity;
                while (currentEntity.parent) {
                    level++;
                    completeEntityAddress = currentEntity.parent.name + "/" + completeEntityAddress;
                    currentEntity = currentEntity.parent;
                }

                entity.hierarchyInfo = {
                    'level': level,
                    'completeAddress': completeEntityAddress
                };
            }

            function buildIndexBasedOn(map, tree) {
                return function buildIndexBasedOnFunction(entity) {
                    if (entity.parent && entity.parent.id) {
                        // connect in both directions
                        var parentEntity = map[entity.parent.id];
                        entity.parent = parentEntity;
                        parentEntity.children.push(entity);
                    } else {
                        tree.push(entity);
                    }
                }
            }

            function buildMap(map) {
                return function buildMapFunction(entity) {
                    map[entity.id] = entity;
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
                    var id = type.id.substr(1 + type.id.indexOf("/"));
                    promises.push(scCrud.entities.findAll(id));
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