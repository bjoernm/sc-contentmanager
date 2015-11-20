'use strict';

(function (angular) {
    angular
        .module('scGenericClient')
        .config(router);

    router.$inject = ['$routeProvider', '$locationProvider'];
    function router($routeProvider, $locationProvider) {
        $routeProvider
            .when('/workspaces/:workspaceId', {
                'templateUrl': '/components/mainContent/entity.tpl.html',
                'controller': 'scMainContentCtrl as ctrl',
                'resolve': {
                    'data': resolveWorkspaceData
                }
            })
            .when('/entities/:entityId', {
                'templateUrl': '/components/mainContent/entity.tpl.html',
                'controller': 'scMainContentCtrl as ctrl',
                'resolve': {
                    'data': resolveEntityData
                }
            })
            .when('/feed', {
                'templateUrl': '/components/mainContent/templates/feed.tpl.html'
            })
            .otherwise({
                'redirectTo': '/workspaces/root'
            });
    }

    resolveEntityData.$inject = ['$route', 'scMainNavService', 'scMainContentService', 'sharedNavDataService', '$log'];
    function resolveEntityData($route, scMainNavService, scMainContentService, sharedNavDataService, $log) {
        var entityUid = "entities/" + $route.current.params.entityId;

        $log.info("start");
        var start = new Date().getTime();
        return scMainContentService.getPage(entityUid)
            .then(extendSharedNavData(sharedNavDataService, scMainNavService))
            .then(function() {
                var end = (new Date().getTime()) - start;
                $log.info("end", end, arguments);

                return arguments[0];
            })
    }

    resolveWorkspaceData.$inject = ['$route', 'scMainNavService', 'scMainContentService', 'sharedNavDataService', '$log'];
    function resolveWorkspaceData($route, scMainNavService, scMainContentService, sharedNavDataService, $log) {
        var workspaceUid = "workspaces/" + $route.current.params.workspaceId;

        $log.info("start");
        var start = new Date().getTime();
        return scMainNavService.loadTextPages(workspaceUid)
            .then(getSingleEntity(scMainContentService))
            .then(fillSharedNavData(sharedNavDataService))
            .then(function() {
                var end = (new Date().getTime()) - start;
                $log.info("end", end, arguments);

                return arguments[0];
            })
    }

    function extendSharedNavData(shared, scMainNavService) {
        return function extendSharedNavDataFunction(entity) {
            if(!entity) {
                return;
            }

            if(shared.currentWorkspaceUid !== entity.workspace.uid) {
                return scMainNavService.loadTextPages(entity.workspace.uid)
                    .then(fill)
            } else {
                return fill(shared.entities);
            }

            function fill(entities) {
                if(entities) {
                    shared.entities = entities;
                    shared.currentWorkspaceUid = entity.workspace.uid;
                    shared.currentEntity = entity;
                    shared.currentEntityUid = entity.uid;

                    return shared;
                }
            }
        }
    }

    function fillSharedNavData(sharedNavDataService) {
        return function fillSharedNavDataFunction(data) {
            if (!data) {
                return;
            }

            sharedNavDataService.entities = data.entities;
            sharedNavDataService.currentWorkspaceUid = data.currentEntity.workspace.uid;
            sharedNavDataService.currentEntityUid = data.currentEntity.uid;
            sharedNavDataService.currentEntity = data.currentEntity;

            return data;
        }
    }

    function getSingleEntity(scMainContentService) {
        return function getSingleEntityFunction(entities) {
            if (!entities || !entities.tree || entities.tree.length == 0) {
                return;
            }

            return scMainContentService.getPage(entities.tree[0].uid).then(function (currentEntity) {
                return {
                    'entities': entities,
                    'currentEntity': currentEntity
                }
            });

        }
    }
})(angular);