'use strict';

(function (angular) {
    angular
        .module('scGenericClient')
        .controller('IndexCtrl', indexCtrl);

    indexCtrl.$inject = ['$scope', 'scMainNavService', 'scUtil','sharedNavDataService', '$rootScope', '$location', '$log', '$mdSidenav'];
    function indexCtrl($scope, scMainNavService, scUtil, sharedNavDataService, $rootScope, $location, $log, $mdSidenav) {
        var vm = this;
        vm.workspaces = [];
        vm.selectedTabIndex = -1;
        vm.navData = sharedNavDataService;
        vm.showSearch = true;
        vm.setPathTo = setPathTo;
        vm.getSearchHints = getSearchHints;
        vm.searchTextChange = searchTextChange;
        vm.selectedItemChange = selectedItemChange;
        vm.showSearchResults = showSearchResults;

        $scope.toggleSidenav = function (menuId) {
            $mdSidenav(menuId).toggle();
        };


        // INIT
        scMainNavService.loadAllWorkspaces()
            .then(function (workspaces) {
                vm.workspaces = workspaces;
            })
            .catch(logError);

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

        function showSearchResults(keyEvent, searchText){
            if(keyEvent != undefined && keyEvent.which === 13){
                setPathTo('search/' + searchText);
            }
        }

        function getSearchHints(searchText) {
            $log.info('query:' + searchText);
            $log.info(scMainNavService
                .getSearchHints(searchText));
            return scMainNavService
                .getSearchHints(searchText);
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }

        function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
            if(item && item.href){
                var path = scUtil.getRelativeUrl(item.href);
                setPathTo(path.substr(1));
            }
            //TODO: Differentiate between types (files, entities, etc.)
            /*else if(item){
                var path = 'http://server.sociocortex.com/file/'+item.id;
                setPathTo(path);
            }*/
        }

        function logError() {
            $log.error.apply($log, arguments);
        }
    }
})(angular);
