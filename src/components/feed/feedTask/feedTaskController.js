(function (angular) {

    /**
     * Controller for the feed directive.
     *
     * @name feedTaskCtrl
     * @property {ScEvent} event The event property from the directive scope.
     * @type FeedTaskController
     */
    angular
        .module('scFeed')
        .controller('FeedTaskController', FeedTaskController);

    FeedTaskController.$inject = [];

    function FeedTaskController() {
        var feedTaskCtrl = this;
        // Variables in directive scope attribute are bound to this object a.k.a. feedItemCtrl.

        feedTaskCtrl.hasError = false;

        /** @type {Error} */
        feedTaskCtrl.error = null;

        /** @type {ScEventPage} */

    }
})(angular);
