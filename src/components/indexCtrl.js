'use strict';

(function (angular) {
    angular
        .module('scGenericClient')
        .controller('IndexCtrl', indexCtrl);

    indexCtrl.$inject = ['$scope', 'scMainNavService', '$rootScope', '$location', '$log'];
    function indexCtrl($scope, scMainNavService, $rootScope, $location, $log) {
        var vm = this;
        vm.workspaces = undefined;
        vm.currentWorkspaceUid = undefined;
        vm.currentEntity = undefined;
        vm.entities = undefined;
        // replace this with a cache from $cacheFactory
        vm.entitiesMapCache = {};
        vm.setPathTo = setPathTo;
        vm.selectedTabIndex = 0;

        // INIT
        scMainNavService.loadAllWorkspaces().then(initWorkspaces);

        var unregisterFn = $rootScope.$on('$locationChangeSuccess', routeNavigation);
        $scope.$on('$destroy', unregisterFn);

        function loadEntities(workspaceId) {
            if (angular.isUndefined(workspaceId)) {
                return;
            }

            scMainNavService.loadTextPages(workspaceId).then(function (entities) {
                vm.entities = entities;

                // the following code block is for various indexes and
                // links between the entities

                // better would probably be to add all fetched things to the
                // $cacheFactory cache instead of all this binding
                entities.forEach(function (ele) {
                    vm.entitiesMapCache[ele.uid] = ele;
                });
                vm.currentEntity = entities[0].uid;
                vm.workspaces.find(function (ele) {
                    return ele.uid === workspaceId
                }).entities = entities;
            });
        }


        function routeNavigation(event, newUrl, oldUrl, newState, oldState) {
            if (angular.isUndefined(vm.entities)) {
                return;
            }

            var newPath = $location.path();
            var workspaceRegex = /^\/?(workspaces\/[^\/]+)/i;
            var entityRegex = /^\/?(entities\/[^\/]+)/i;

            // on a workspace route
            var result = workspaceRegex.exec(newPath);
            if (angular.isArray(result)) {
                loadWorkspace(result[1], true);
                return;
            }

            // on a entity route
            result = entityRegex.exec(newPath);
            if (angular.isArray(result)) {
                loadEntity(result[1])
                return;
            }
        }

        function loadWorkspace(workspaceUid, goToFirstPage) {
            if (vm.currentWorkspaceUid !== workspaceUid) {
                loadEntities(workspaceUid);
            }
            vm.currentWorkspaceUid = workspaceUid;
            vm.workspaces.forEach(function (ele, index, arr) {
                if (ele.uid === workspaceUid) {
                    vm.selectedTabIndex = index;
                    if (ele.entities && goToFirstPage === true) {
                        loadEntity(ele.entities[0].uid);
                    }
                }
            });

        }

        function loadEntity(entityUid) {
            vm.currentEntity = vm.entitiesMapCache[entityUid];
            // must be false to avoid endless recursion
            loadWorkspace(vm.currentEntity.workspace.uid, false);
        }

        function initWorkspaces(workspaces) {
            vm.workspaces = workspaces;
            vm.currentWorkspaceUid = workspaces[0].uid;
            loadEntities(vm.currentWorkspaceUid);
        }

        function setPathTo(path) {
            if (angular.isString(path)) {
                $location.path(path);
            } else {
                $log.error('path must be of type string');
            }
        }
    }
})(angular);