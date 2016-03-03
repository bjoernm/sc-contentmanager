(function (angular) {
    'use strict';

    angular
        .module('scMainContent')
        .controller('scMainContentCtrl', mainContentController);

    mainContentController.$inject = ['$scope', 'scMainContentService', '$rootScope', '$location', '$log', 'data', 'sharedNavDataService'];
    function mainContentController($scope, scMainContentService, $rootScope, $location, $log, data, sharedNavDataService) {
        var vm = this;

        if (!data) {
            $log.error('could not initialize mainContentController because route data were', data);
            data = {};
            return;
        }

        vm.entity = data.currentEntity;
        vm.sum = sum;
        vm.refreshEntity = refreshEntity;
        vm.pageProgress = pageProgress;

        function pageProgress() {
            var progresses = vm.entity.tasks
                .filter(function(t) {
                    return !t.skipped;
                }).map(function(t) {
                    return t.progress;
                });

            return progresses.reduce(function(sum,b){return sum + b},0) / progresses.length;
        }

        function refreshEntity() {
            scMainContentService
                .getPage(vm.entity.id)
                .then(function (newEntity) {
                    vm.entity = newEntity;

                    var navEntity = sharedNavDataService.entities.index[newEntity.id];
                    ['progress', 'isOverdue', 'isInconsistent'].forEach(function(param){
                        navEntity[param] = newEntity[param];
                    });
                });
        }


        /*
         var unregisterFn = $rootScope.$on('$locationChangeSuccess', function() {
         console.log(arguments.length);
         console.log.apply(console, arguments);
         });
         $scope.$on('$destroy', unregisterFn);
         //*/
    }

    function sum(array, prop) {
        return array.reduce(function (before, ele) {
            return before + ele[prop];
        }, 0);
    }
})(angular);