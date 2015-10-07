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
            template: '<md-content><md-card ng-if="!!entity" ng-include="getTemplateUrl()"></md-card></md-content>',
            //templateUrl: getTemplateUrl(),
            scope: {
                entityUid: '='
            },
            link: function (scope, element, attrs) {
                scope.entity = {};
                scope.vm = {};
                scope.getTemplateUrl = getTemplateUrl;
                scope.sum = sum;

                //*
                // FIXME: look for another solution than $watch
                // watch is bound to the lifecycle of scope and will be removed automatically
                scope.$watch('entityUid', function (newVal, oldVal, scope) {
                    updateEntity(scope);
                });
                //*/

                // initial run is done by $watch
                // updateEntity(scope);
            }
        };

        function updateEntity(scope) {
            scMainContentService
                .getPage(scope.entityUid)
                .then(function successCallback(entity) {
                    scope.entity = entity;
                }, function errorCallback(reason) {
                    scope.isLoading = false;
                    $log.error(reason)
                })
        }

        function getTemplateUrl() {
            return 'components/mainContent/templates/person.tpl.html';
        }

        function sum(items, prop) {
            if (!angular.isArray(items)) {
                return 0;
            }

            var res = items.reduce(function (a, b) {
                return !isFinite(b[prop]) ? a : a + b[prop];
            }, 0);

            return res;
        }
    }


})(angular);