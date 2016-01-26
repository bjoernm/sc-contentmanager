/**
 * Created by Niklas on 25/01/16.
 */

(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name scRichStringChanges
     * @restrict E
     * @scope
     * @description
     *
     * The directive for richString changes.
     */
    angular
        .module('scFeed')
        .directive('scRichStringChanges', RichStringChangesDirective);

    RichStringChangesDirective.$inject = [];

    function RichStringChangesDirective() {
        var attributes = {
            changes: "=scChanges",
            entity: "=scEntity"
        };

        var requiredAttributes = ['scChanges', 'scEntity'];

        return {
            restrict: 'E',
            require: requiredAttributes,
            templateUrl: 'components/feed/richStringChanges/richStringChanges.tpl.html',
            scope: attributes,
            controllerAs: 'richStringChangesCtrl',
            controller: 'RichStringChangesController',
            bindToController: true
        };
    }

})();
