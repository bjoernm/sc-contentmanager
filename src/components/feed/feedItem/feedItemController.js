/**
 * Created by albert on 26.11.15.
 */
(function () {

    /**
     * Controller for the feed directive.
     *
     * @name feedItemCtrl
     * @type FeedItemController
     */
    angular
        .module('scFeed')
        .controller('FeedItemController', FeedItemController);

    FeedItemController.$inject = [];

    function FeedItemController() {
        var ctrl = this;
    }

})();
