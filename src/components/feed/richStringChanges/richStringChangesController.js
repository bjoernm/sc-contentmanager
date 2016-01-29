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

    RichStringChangesController.$inject = [ '$sce', 'HtmlDiffService' ];

    function RichStringChangesController($sce, HtmlDiffService) {
        var richStringChangesCtrl = this;
        // Variables in directive scope attribute are bound to this object a.k.a. richStringChangesCtrl.
        richStringChangesCtrl.hasError = false;

        /** @type {Error} */
        richStringChangesCtrl.error = null;
        richStringChangesCtrl.trustHtml = trustHtml;
        richStringChangesCtrl.getTrustedDiffHtml = getTrustedDiffHtml;
        richStringChangesCtrl.showDetails = !!richStringChangesCtrl.showDetails;

        function getTrustedDiffHtml(oldHtml, newHtml) {
            return $sce.trustAsHtml(HtmlDiffService.generateRendredDiffBetween(oldHtml,newHtml));
        }

        function trustHtml(htmlString) {
            return $sce.trustAsHtml(htmlString);
        }

    }
})(angular);