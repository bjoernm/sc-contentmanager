/**
 * Created by Niklas on 26/01/16.
 */

(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name scRoleChanges
     * @restrict E
     * @scope
     * @description
     *
     * The directive for role changes.
     */
    angular
        .module('scFeed')
        .directive('scRoleChanges', RoleChangesDirective);

    RoleChangesDirective.$inject = [];

    function RoleChangesDirective() {
        var attributes = {
            changes: "=scChanges",
            entity: "=scEntity",
            showDetails: "=?scShowDetails"
        };

        var requiredAttributes = ['scChanges', 'scEntity'];

        return {
            restrict: 'E',
            require: requiredAttributes,
            templateUrl: 'components/feed/roleChanges/roleChanges.tpl.html',
            scope: attributes,
            controllerAs: 'roleChangesCtrl',
            controller: 'RoleChangesController',
            bindToController: true
        };
    }

})();
