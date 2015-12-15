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
        .filter('offset', function() {
            return function(input, start) {
                start = parseInt(start, 10);
                return input.slice(start);
            };
        })
        .controller('FeedController', FeedController);

    FeedController.$inject = ['scEventService', 'scGenerateDataService'];

    function FeedController(eventService, generateDataService) {
        var feedCtrl = this;
        feedCtrl.itemsPerPage = 3;
        feedCtrl.currentPage = 0;
        feedCtrl.events = [];
        feedCtrl.loading = true;
        feedCtrl.hasError = false;
        feedCtrl.feedData = [];
        /** @type {Error} */
        feedCtrl.error = null;

         /** @type {ScEventPage} */
        feedCtrl.eventPage = null;

        feedCtrl.postData = postData;
        feedCtrl.removeData = removeData;

        eventService.getEvents().then(
            function (eventPage) {
                feedCtrl.eventPage = eventPage;
                feedCtrl.events = eventPage.events;
                feedCtrl.loading = false;
            },
            function (error) {
                feedCtrl.hasError = true;
                feedCtrl.error = error;

            });

        function postData() {
            generateDataService.generateWorkspace();
        }

        function removeData() {
            generateDataService.deleteWorkspace();
        }

        feedCtrl.range = function () {
            var rangeSize = Math.floor(feedCtrl.pageCount() / 2);
            var ret = [];
            var start;

            start = feedCtrl.currentPage;
            if (start > feedCtrl.pageCount() - rangeSize) {
                start = feedCtrl.pageCount() - rangeSize + 1;
            }

            for (var i = start; i < start + rangeSize; i++) {
                ret.push(i);
            }
            return ret;
        };

        feedCtrl.prevPage = function () {
            if (feedCtrl.currentPage > 0) {
                feedCtrl.currentPage--;
            }
        };

        feedCtrl.prevPageDisabled = function () {
            return feedCtrl.currentPage === 0 ? "disabled" : "";
        };

        feedCtrl.pageCount = function () {
             var count = Math.ceil(feedCtrl.events.length / feedCtrl.itemsPerPage);
             count = Math.max(1, count);
             feedCtrl.currentPage = Math.min(feedCtrl.currentPage, count - 1);

             return count;

        };

        feedCtrl.nextPage = function () {
            if (feedCtrl.currentPage < feedCtrl.pageCount()) {
                feedCtrl.currentPage++;
            }
        };

        feedCtrl.nextPageDisabled = function () {
            return feedCtrl.currentPage === feedCtrl.pageCount() ? "disabled" : "";
        };

        feedCtrl.setPage = function (n) {
            feedCtrl.currentPage = n;
        };
    }
})(angular);