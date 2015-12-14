(function (angular) {

    /**
     * Controller for the feed discussion item directive.
     *
     * @name feedDiscussionCtrl
     * @type FeedDiscussionController
     */
    angular
        .module('scFeed')
        .controller('FeedDiscussionController', FeedDiscussionController);

    FeedDiscussionController.$inject = [];

    function FeedDiscussionController() {
        var feedDiscussionCtrl = this;

        feedDiscussionCtrl.hasError = false;

        /** @type {Error} */
        feedDiscussionCtrl.error = null;

    }
})(angular);
