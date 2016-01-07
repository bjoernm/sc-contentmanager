/**
 * Created by albert on 26.11.15.
 */
(function (angular) {

    /**
     * Controller for the feed directive.
     *
     * @name feedItemCtrl
     * @property {ScEvent} event The event property from the directive scope.
     * @type FeedItemController
     */
    angular
        .module('scFeed')
        .controller('FeedItemController', FeedItemController);

    FeedItemController.$inject = [];

    function FeedItemController() {
        var feedItemCtrl = this;
        // Variables in directive scope attribute are bound to this object a.k.a. feedItemCtrl.

        feedItemCtrl.hasError = false;

        /** @type {Error} */
        feedItemCtrl.error = null;
    }
})(angular);
