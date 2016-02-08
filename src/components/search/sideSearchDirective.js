'use strict';

(function () {

    /*
     angular.module('scMainNav')
     .directive('scMainNav', scMainNavDirective);
     //*/

    angular.module('scSearch')
        .directive('scSideSearch', scSideSearchDirective);

    scSideSearchDirective.$inject = ['$log'];
    function scSideSearchDirective() {
        return {
            restrict: 'E',
            scope: '=',
            templateUrl: 'components/search/sideSearch.tpl.html',
            link: function link(scope, element, attrs) {
                scope.$watch('ctrl', updateSearchText);
            }
        };

        function updateSearchText(newValue, oldValue, scope){
            console.log(newValue);
            console.log(oldValue);
            console.log(scope);
        }


    }
})
();
