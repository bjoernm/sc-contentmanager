(function(){

    angular
        .module('mainNav')
        .directive('mainNav', [ 'mainNavService', mainNavDirective]);


    function mainNavDirective(mainNavService) {
        return {
            restrict: 'E',
            templateUrl: 'partials/mainNav/mainNav.tpl.html',
            transclude: true,
            link: function (scope, element, attrs) {

                scope.selected     = null;
                scope.workspaces        = [ ];

                // Load all workspaces
                mainNavService
                    .loadAllWorkspaces()
                    .then( function( workspaces ) {
                        scope.workspaces    = [].concat(workspaces);
                        scope.selected = workspaces[0];
                    });


            }
        };
    }

})();
