(function (angular) {
    'use strict';

    angular
        .module('scMainContent')
        .controller('scMainContentCtrl', mainContentController);

    mainContentController.$inject = ['$scope', 'scMainNavService', '$rootScope', '$location', '$log', 'data'];
    function mainContentController($scope, scMainNavService, $rootScope, $location, $log, data) {
        var vm = this;

        vm.nameF = "hubuidu";
        vm.entity = data.currentEntity;

        vm.sum = sum;


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