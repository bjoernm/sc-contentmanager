/**
 * Created by Niklas on 25/01/16.
 */

(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name scSimpleValueChanges
     * @restrict E
     * @scope
     * @description
     *
     * The directive for simple value changes.
     */
    angular
        .module('scFeed')
        .directive('scSimpleValueChanges', SimpleValueChangesDirective);

    SimpleValueChangesDirective.$inject = [];

    function SimpleValueChangesDirective() {
        var attributes = {
            changes: "=scChanges",
            entity: "=scEntity",
            showDetails: "=?scShowDetails"
        };

        var requiredAttributes = ['scChanges', 'scEntity'];

        return {
            restrict: 'E',
            require: requiredAttributes,
            templateUrl: 'components/feed/simpleValueChanges/simpleValueChanges.tpl.html',
            scope: attributes,
            controllerAs: 'simpleValueChangesCtrl',
            controller: 'SimpleValueChangesController',
            bindToController: true
        };
    }

})();
