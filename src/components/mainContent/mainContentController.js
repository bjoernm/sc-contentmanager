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


        /*
        var unregisterFn = $rootScope.$on('$locationChangeSuccess', function() {
            console.log(arguments.length);
            console.log.apply(console, arguments);
        });
        $scope.$on('$destroy', unregisterFn);
        //*/
    }
})(angular);