(function () {
    'use strict';

    angular.module('scMainNav')
        .service('scMainNavService', scMainNavService);

    scMainNavService.$inject = ['$log', 'scCrud', '$cacheFactory', '$q'];
    function scMainNavService($log, scCrud, $cacheFactory, $q) {
        var auth = {
            user: '',
            password: ''
        };

        var cache = $cacheFactory('scMainNavServiceCache');

        return {
            loadAllWorkspaces: loadAllWorkspaces,
            loadTextPages: loadTextPages
        };

        function loadAllWorkspaces() {
            // Simulate async nature of real remote calls
            return scCrud.workspaces.findAll(auth);
        }

        function loadTextPages(workspaceUid) {
            var cachedEntity = cache.get(workspaceUid);
            // $log.info("cached enitity is resolved to ", cachedEntity);

            // FIXME this does not work! eventuell muss man ein promis drum herum packen. schau in die doku
            if (angular.isDefined(cachedEntity)) {
                return $q.when(cachedEntity);
            }


            var workspaceId = workspaceUid.substr(workspaceUid.indexOf("/") + 1);

            // $log.info("entity was not cached. loading", workspaceUid, workspaceId);
            return scCrud.types
                .findAll(auth, workspaceId)
                .then(findTextPageType)
                .then(loadTextPageEntities)
                .then(addWorkspaceIdToEntities)
                .then(addToCache);

            function findTextPageType(types) {
                var type = types.find(function (element) {
                    return element.name === "Text Page";
                });

                return type;
            }

            function loadTextPageEntities(type) {

                var id = type.uid.substr(1 + type.uid.indexOf("/"));
                return scCrud.entities.findAll(auth, id);
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