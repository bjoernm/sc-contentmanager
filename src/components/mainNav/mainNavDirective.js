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
                scope.isShowing = isShowing;
                scope.isAnotherLevel = isAnotherLevel(scope);
                scope.getNextShowing = getNextShowing(scope);
            }
        };

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
                currentEntity.showChildren = true;
                currentEntity = currentEntity.parent;
            } while (currentEntity);
        }

        function getHierarchyLevel(entity) {
            var basicOffset = 5,
                multipleOffset = 10;

            return Math.max(entity.hierarchyInfo.level * multipleOffset + basicOffset, basicOffset) + 'px';
        }

        function isAnotherLevel(scope) {
            return function isAnotherLevelFunction($index) {
                var currentEntity = scope.entities.list[$index];
                var nextEntity = scope.getNextShowing($index);

                if (!nextEntity) return false;

                var currentLevel = currentEntity.hierarchyInfo.level;
                var nextLevel = nextEntity.hierarchyInfo.level;
                return currentLevel != nextLevel;
            }
        }

        function isShowing(entity) {
            return !entity.parent || entity.parent.showChildren;
        }

        function getNextShowing(scope) {
            return function getNextShowingFunction($index) {
                var list = scope.entities.list;
                for (var i = $index + 1; i < list.length; i++) {
                    if (list[i] && isShowing(list[i]))
                        return list[i];
                }
            }
        }
    }
})
();
