/**
 * Created by Niklas on 26/01/16.
 */
(function (angular) {

    /**
     * Controller for the feed directive.
     *
     * @name roleChangesCtrl
     * @property {ScEvent} event The event property from the directive scope.
     * @type RoleChangesController
     */
    angular
        .module('scFeed')
        .controller('RoleChangesController', RoleChangesController);

    RoleChangesController.$inject = [ '$sce' ];

    function RoleChangesController($sce) {
        var roleChangesCtrl = this;
        // Variables in directive scope attribute are bound to this object a.k.a. roleChangesCtrl.
        roleChangesCtrl.hasError = false;

        /** @type {Error} */
        roleChangesCtrl.error = null;
        roleChangesCtrl.showDetails = false;

    }
})(angular);