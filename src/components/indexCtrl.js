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
            return sharedNavDataService.currentWorkspaceId;
        }, function (newVal, oldVal, scope) {
            if (!angular.isArray(vm.workspaces)) {
                return;
            }

            vm.selectedTabIndex = vm.workspaces.findIndex(function (workspace) {
                return workspace.id === newVal;
            })
        });

        function setPathTo(path) {
            $log.warn("setPathTo was called:", path);

            if (angular.isString(path)) {
                $location.path(path);
            } else {
                $log.error('path must be of type string. path =', path);
            }
        }
    }
})(angular);
