(function (angular) {

    /**
     * @ngdoc controller
     * @name feedCtrl
     * @type FeedController
     * @requires scEventService
     * @description
     *
     * Controller for the feed directive.
     */
    angular
        .module('scFeed')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['scEventService'];

    function FeedController(eventService) {
        var feedCtrl = this;

        feedCtrl.hasError = false;

        /** @type {Error} */
        feedCtrl.error = null;

         /** @type {ScEventPage} */
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
})(angular);