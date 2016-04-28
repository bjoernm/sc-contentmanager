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
                resolve: {
                    eventPage: ['scEventService', '$route', function (scEventService, $route) {
                        return scEventService
                            .getEvents($route.current.params);
                    }]
                },
                templateUrl: '/components/mainContent/templates/feed.tpl.html',
                controller: 'scMainFeedController',
                controllerAs: 'mainFeedCtrl',
                reloadOnSearch: false
            })
            .when('/search', {
                'templateUrl': '/components/search/search.tpl.html',
                'controller': 'scSearchController as ctrl',
                'resolve': {
                    'data': resolveSearchData
                }
            })
            .otherwise({
                'redirectTo': '/workspaces/root' //TODO: change to something existing
            });
    }

    resolveEntityData.$inject = ['$route', 'scMainNavService', 'scMainContentService', 'sharedNavDataService', '$log', 'overdueTasks'];
    function resolveEntityData($route, scMainNavService, scMainContentService, sharedNavDataService, $log, overdueTasks) {
        var entityId = $route.current.params.entityId;

        $log.info("start:", $route.current.params);
        var start = new Date().getTime();
        return scMainContentService.getPage(entityId)
            .then(function setCurrentProgressData(entity) {

                overdueTasks.refresh();

                var navEntity = sharedNavDataService.entities.index[entity.id];
                if (!!navEntity) {
                    $log.info("setting new progress");
                    ['progress', 'isOverdue', 'isInconsistent'].forEach(function (param) {
                        navEntity[param] = entity[param];
                    });
                }

                return entity;
            })
            .then(extendSharedNavData(sharedNavDataService, scMainNavService))
            .then(function () {
                var end = (new Date().getTime()) - start;
                $log.info("end", end, arguments);

                return arguments[0];
            })
    }

    resolveWorkspaceData.$inject = ['$route', 'scMainNavService', 'scMainContentService', 'sharedNavDataService', '$log'];
    function resolveWorkspaceData($route, scMainNavService, scMainContentService, sharedNavDataService, $log) {
        var workspaceId = $route.current.params.workspaceId;

        $log.info("start:", workspaceId);
        var start = new Date().getTime();
        return scMainNavService.loadTextPages(workspaceId)
            .then(getSingleEntity(scMainContentService))
            .then(fillSharedNavData(sharedNavDataService))
            .then(function () {
                var end = (new Date().getTime()) - start;
                $log.info("end", end, arguments);

                return arguments[0];
            })
    }

    function extendSharedNavData(shared, scMainNavService) {
        return function extendSharedNavDataFunction(entity) {
            if (!entity) {
                return;
            }


            if (shared.currentWorkspaceId !== entity.workspace.id) {
                shared.currentWorkspaceId = entity.workspace.id;
                return scMainNavService.loadTextPages(entity.workspace.id)
                    .then(fill)
            } else {
                return fill(shared.entities);
            }


            function fill(entities) {
                if (entities) {
                    shared.entities = entities;
                    shared.currentWorkspaceId = entity.workspace.id;
                    shared.currentEntity = entity;
                    shared.currentEntityId = entity.id;

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
            sharedNavDataService.currentWorkspaceId = data.currentEntity.workspace.id;
            sharedNavDataService.currentEntityId = data.currentEntity.id;
            sharedNavDataService.currentEntity = data.currentEntity;

            return data;
        }
    }

    function getSingleEntity(scMainContentService) {
        return function getSingleEntityFunction(entities) {
            if (!entities || !entities.tree || entities.tree.length == 0) {
                return;
            }

            return scMainContentService.getPage(entities.tree[0].id).then(function (currentEntity) {
                return {
                    'entities': entities,
                    'currentEntity': currentEntity
                }
            });

        }
    }

    resolveSearchData.$inject = ['$route', '$log'];
    function resolveSearchData($route, $log) {

        var data = {
            text: $route.current.params.text,
            orderBy: $route.current.params.orderBy,
            resourceType: $route.current.params.resourceType,
            workspace: $route.current.params.workspace,
            entityType: $route.current.params.entityType,
            systemAttribute: $route.current.params.systemAttribute,
            special: $route.current.params.special,
            n: $route.current.params.n,
            page: $route.current.params.page
        };

        return data;

    }
})(angular);