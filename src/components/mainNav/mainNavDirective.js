'use strict';

(function () {

    angular
        .module('scMainNav')
        .directive('scMainNav', scMainNavDirective);


    scMainNavDirective.$inject = ['scMainNavService'];
    function scMainNavDirective(scMainNavService) {
        return {
            restrict: 'E',
            templateUrl: 'partials/mainNav/mainNav.tpl.html',
            replace: true,
            link: function (scope, element, attrs) {

                scope.selected = null;
                scope.workspaces = [];

                // Load all workspaces
                scMainNavService
                    .loadAllWorkspaces()
                    .then(function (workspaces) {
                        scope.workspaces = workspaces;
                        scope.selected = workspaces[0];
                    });


            }
        };
    }

})();
