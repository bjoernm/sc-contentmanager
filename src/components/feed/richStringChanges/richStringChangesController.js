/**
 * Created by Niklas on 25/01/16.
 */
(function (angular) {

    /**
     * Controller for the feed directive.
     *
     * @name richStringChangesCtrl
     * @property {ScEvent} event The event property from the directive scope.
     * @type RichStringChangesController
     */
    angular
        .module('scFeed')
        .controller('RichStringChangesController', RichStringChangesController);

    RichStringChangesController.$inject = [ '$sce' ];

    function RichStringChangesController($sce) {
        var richStringChangesCtrl = this;
        // Variables in directive scope attribute are bound to this object a.k.a. richStringChangesCtrl.
        richStringChangesCtrl.hasError = false;

        /** @type {Error} */
        richStringChangesCtrl.error = null;
        richStringChangesCtrl.trustHtml = trustHtml;
        richStringChangesCtrl.showDetails = !!richStringChangesCtrl.showDetails;

        function trustHtml(htmlString) {
            return $sce.trustAsHtml(htmlString);
        }

    }
})(angular);