(function () {

    /**
     * Controller for the feed directive.
     *
     * @name feedCtrl
     * @type FeedController
     */
    angular
        .module('scFeed')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['scEventService'];

    function FeedController(eventService) {
        var feedCtrl = this;

        feedCtrl.hasError = false;
        feedCtrl.error = null;
        feedCtrl.eventPage = null;

        eventService.getEvents().then(
            function (eventPage) {
                feedCtrl.eventPage = eventPage;
            },
            function (error) {
                feedCtrl.hasError = true;
                feedCtrl.error = error;

            });
    }
})();