/**
 * Created by albert on 26.11.15.
 */
(function () {

    /**
     * Controller for the feed directive.
     *
     * @name feedItemCtrl
     * @property {Event} event The event property from the directive scope.
     * @type FeedItemController
     */
    angular
        .module('scFeed')
        .controller('FeedItemController', FeedItemController);

    FeedItemController.$inject = [];

    function FeedItemController() {
        var feedItemCtrl = this;
        // Variables in directive scope attribute are bound to this object a.k.a. feedItemCtrl.
    }

})();
