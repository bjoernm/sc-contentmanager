/**
 * Created by Niklas on 25/01/16.
 */
(function (angular) {

    /**
     * Controller for the feed directive.
     *
     * @name simpleValueChangesCtrl
     * @property {ScEvent} event The event property from the directive scope.
     * @type SimpleValueChangesController
     */
    angular
        .module('scFeed')
        .controller('SimpleValueChangesController', SimpleValueChangesController);

    SimpleValueChangesController.$inject = [ '$sce' ];

    function SimpleValueChangesController($sce) {
        var simpleValueChangesCtrl = this;
        // Variables in directive scope attribute are bound to this object a.k.a. simpleValueChangeCtrl.

        simpleValueChangesCtrl.hasError = false;

        /** @type {Error} */
        simpleValueChangesCtrl.error = null;
        simpleValueChangesCtrl.trustHtml = trustHtml;
        simpleValueChangesCtrl.showDetails = false;

        function trustHtml(htmlString) {
            return $sce.trustAsHtml(htmlString);
        }

    }
})(angular);