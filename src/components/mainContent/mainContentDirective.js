(function (angular) {
    'use strict';

    angular
        .module('scMainContent')
        .directive('scMainContent', mainContentDirective);

    mainContentDirective.$inject = ['scMainContentService', '$log'];

    function mainContentDirective(scMainContentService, $log) {
        return {
            restrict: 'E',
            replace: true,
            template: getParentTemplate,
            //templateUrl: getTemplateUrl(),
            scope: {
                entityUid: '@'
            },
            link: function (scope, element, attrs) {
                scope.entity = {};
                scope.vm = {};
                scope.getTemplateUrl = getTemplateUrl;
                scope.sum = sum;
                scope.progressBarMode = 'indeterminate';

                //*
                // FIXME: look for another solution than $watch
                // watch is bound to the lifecycle of scope and will be removed automatically
                var spacesOnly = /^\s*$/;
                scope.$watch('entityUid', function (newVal, oldVal, scope) {
                    if (angular.isString(scope.entityUid) && !spacesOnly.test(scope.entityUid)) {
                        $log.info("$watch(entityUid)", newVal);
                        updateEntity(newVal, scope);
                    }
                });
                //*/

                // initial run is done by $watch
                // updateEntity(scope);
            }
        };

        function updateEntity(entityUid, scope) {
            scope.progressBarMode = 'indeterminate';
            scMainContentService
                .getPage(entityUid)
                .then(function successCallback(entity) {
                    scope.entity = entity;
                }).catch(function errorCallback(reason) {
                    $log.error(reason);
                    $log.error("loading fallback test entity");
                    scope.entity = scMainContentService.getTestEntity();
                }).finally(function () {
                    //$log.info("mainContentDirective.updateEntity", "delivered entity:", scope.entity)
                    scope.progressBarMode = undefined;
                });
        }

        function getTemplateUrl() {
            return 'components/mainContent/templates/person.tpl.html';
        }

        function sum(items, prop) {
            if (!angular.isArray(items) || !angular.isString(prop)) {
                return 0;
            }

            var res = items.reduce(function (a, b) {
                return !isFinite(b[prop]) ? a : a + b[prop];
            }, 0);

            return res;
        }
    }

    /**
     * this function should be an extra layer for different type of entities. currently only one type is used.
     * @param element
     * @param scope
     * @returns {string}
     */
    function getParentTemplate(element, scope) {
        return [
            '<md-content>',
            '<md-card ng-if="!!entity" ng-include="getTemplateUrl()">',
            '</md-card>',
            '</md-content>'
        ].join('');
    }
})(angular);