'use strict';

(function () {

    /*
     angular.module('scMainNav')
     .directive('scMainNav', scMainNavDirective);
     //*/

    angular.module('scMainNav')
        .directive('scSideNav', scSideNavDirective);

    scSideNavDirective.$inject = ['$log'];
    function scSideNavDirective($log) {
        return {
            restrict: 'E',
            templateUrl: 'components/mainNav/sideNav.tpl.html',
            scope: {
                entities: '=',
                currentEntityUid: '='
            },
            link: function link(scope, element, attrs) {
                scope.$watch('currentEntityUid', openTree);
                scope.getHierarchyLevel = getHierarchyLevel;
            }
        }

        function openTree(newValue, oldValue, scope) {
            if (!scope.entities || !scope.entities.index || !newValue) {
                return;
            }

            var currentEntity = scope.entities.index[newValue];
            var oldEntity = scope.entities.index[oldValue];

            if (oldEntity) {
                oldEntity.isCurrentEntity = false;
            }

            currentEntity.isCurrentEntity = true;

            if (!currentEntity) {
                return;
            }

            do {
                $log.info("showing: ", currentEntity.uid, currentEntity.parent);
                currentEntity.showChildren = true;
                currentEntity = currentEntity.parent;
            } while (currentEntity);
        }

        function getHierarchyLevel(entity) {
            var i = 1;
            while(entity.parent) {
                i++;
                entity = entity.parent;
            }

            return i;
        }
    }
})();
