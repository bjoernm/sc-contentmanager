'use strict';

(function (angular) {
    angular
        .module('scGenericClient')
        .controller('IndexCtrl', indexCtrl)
        .factory('overdueTasks', overdueTasks);

    indexCtrl.$inject = ['$scope', 'scMainNavService', 'scUtil', 'sharedNavDataService', '$rootScope', '$location', '$log', '$mdSidenav', 'overdueTasks', 'scSearch', '$q'];
    function indexCtrl($scope, scMainNavService, scUtil, sharedNavDataService, $rootScope, $location, $log, $mdSidenav, overdueTasks, scSearch, $q) {
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
        vm.overdueTasks = overdueTasks;

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
            });

        });

        function setPathTo(path) {
            $location.search({}); //reset searchParams
            $log.warn("setPathTo was called:", path);
            if (angular.isString(path)) {
                $location.path(path);
            } else {
                $log.error('path must be of type string. path =', path);
            }

        }

        function showSearchResults(keyEvent, text) {
            if (keyEvent != undefined && keyEvent.which === 13) {

                var searchParams = {
                    text: text,
                    orderBy: '',
                    workspace: '',
                    resourceType: '',
                    entityType: '',
                    systemAttribute: '',
                    special: '',
                    n: 25,
                    page: 1
                };

                $location.path('search').search(searchParams);
            }
        }

        function getSearchHints(searchText) {

            var deferred = $q.defer();

            scSearch.hints({
                text: searchText
            }, function (success) {
                deferred.resolve(success.hints);

            }, function (error) {
                $log.info("error searchHints");
            });

            return deferred.promise;
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }

        function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
            if (item && item.href) {
                var path = scUtil.getRelativeUrl(item.href);
                setPathTo(path.substr(1));
            }
        }

        function logError() {
            $log.error.apply($log, arguments);
        }
    }

    overdueTasks.$inject = ['scData', '$log'];
    function overdueTasks(scData, $log) {
        var obj = {
            tasks: [],
            refresh: refreshOverdueTasks
        };
        return obj;

        function refreshOverdueTasks() {
            $log.info("refreshOverdueTasks");

            return scData.Task
                .query({'filter': 'isoverdue', 'attributes': 'entity', 'meta': 'progress'}).$promise
                .then(function (tasks) {
                    $log.info("overdue tasks: ", tasks);
                    obj.tasks = tasks;
                })
        }
    }
})(angular);
