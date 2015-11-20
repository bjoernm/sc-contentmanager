'use strict';

(function (angular) {
    angular
        .module('scGenericClient')
        .controller('IndexCtrl', indexCtrl);

    indexCtrl.$inject = ['$scope', 'scMainNavService', 'sharedNavDataService', '$rootScope', '$location', '$log'];
    function indexCtrl($scope, scMainNavService, sharedNavDataService, $rootScope, $location, $log) {
        var vm = this;
        vm.workspaces = [];
        vm.selectedTabIndex = -1;
        vm.navData = sharedNavDataService;
        vm.setPathTo = setPathTo;

        // INIT
        scMainNavService.loadAllWorkspaces()
            .then(function (workspaces) {
                vm.workspaces = workspaces;
            });

        $scope.$watch(function () {
            return sharedNavDataService.currentWorkspaceUid;
        }, function (newVal, oldVal, scope) {
            if (!angular.isArray(vm.workspaces)) {
                return;
            }

            vm.selectedTabIndex = vm.workspaces.findIndex(function (workspace) {
                return workspace.uid === newVal;
            })
        });

        function setPathTo(path) {
            $log.warn("setPathTo was called");

            if (angular.isString(path)) {
                $location.path(path);
            } else {
                $log.error('path must be of type string');
            }
        }

        /*

         function routeNavigation(event, newUrl, oldUrl, newState, oldState) {
         var newPath = $location.path();
         var workspaceRegex = /^\/?(workspaces\/[^\/]+)/i;
         var entityRegex = /^\/?(entities\/[^\/]+)/i;

         // on a workspace route
         var result;
         if (angular.isArray(result = workspaceRegex.exec(newPath))) {
         loadWorkspace(result[1]);
         return;
         }
         // on a entity route
         else if (angular.isArray(result = entityRegex.exec(newPath))) {
         loadEntity(result[1]);
         return;
         }
         // load first workspace with first entity
         else {
         loadWorkspace(vm.workspaces[0].uid);
         return;
         }

         }

         function initWorkspaces(workspaces) {
         vm.workspaces = workspaces
         }

         function loadEntity(uid) {
         vm.currentEntityUid = uid;
         $log.info("load Entity")
         if (!vm.entities || !vm.entities.index || !vm.entities.index[vm.currentEntityUid]) {
         scMainNavService.loadWorkspaceFromEntityUid(uid)
         .then(function (workspace) {
         vm.currentWorkspaceUid = workspace.uid;
         });
         }
         }

         function loadWorkspace(uid) {
         vm.currentWorkspaceUid = uid;
         setTopNavPosition(uid);
         scMainNavService.loadTextPages(uid).then(function (entities) {
         vm.entities = entities;
         vm.currentEntityUid = entities.tree[0].uid;
         })
         }

         function setTopNavPosition(workspaceUid) {
         for(var i = 0; i < vm.workspaces.length; i++) {
         if(vm.workspaces[i].uid === workspaceUid) {
         vm.selectedTabIndex = i;
         return
         }
         }
         }
         //*/
    }
})(angular);