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

        feedCtrl.events = [];
        feedCtrl.loading = true;
        feedCtrl.hasError = false;
        feedCtrl.feedData = [];
        /** @type {Error} */
        feedCtrl.error = null;
        feedCtrl.onlyWatchedEntities = false;
        feedCtrl.startDay = null;
        feedCtrl.endDay = null;

        feedCtrl.postData = postData;
        feedCtrl.removeData = removeData;
        feedCtrl.getArrayOfSize = getArrayOfSize;

        function postData() {
            generateDataService.generateWorkspace();
        }

        function removeData() {
            generateDataService.deleteWorkspace();
        }

        function getArrayOfSize(size) {
            return new Array(size);
        }

        feedCtrl.onFilter = function () {
            if(feedCtrl.startDay !== null) {
                feedCtrl.startDate = formatDate(feedCtrl.startDay, feedCtrl.startTime);
            }else{
                feedCtrl.startDate = null;
            }

            if(feedCtrl.endDay !== null) {
                feedCtrl.endDate = formatDate(feedCtrl.endDay, feedCtrl.endTime);
            }else{
                feedCtrl.endDate = null;
            }

            eventService.getFilteredEvents(feedCtrl.onlyWatchedEntities, feedCtrl.startDate, feedCtrl.endDate).then(function (eventPage) {
                feedCtrl.eventPage = eventPage;
                feedCtrl.events = eventPage.events;
                feedCtrl.loading = false;
            });
        }

        function formatDate(date, time){
            var day = date.getDate();
            var month = date.getMonth().valueOf()+1;
            var hours = time.getHours();
            var minutes = time.getMinutes();
            if(day < 10){
                day = '0' + day;
            }
            if(month < 10){
                month = '0' + month;
            }
            if(hours < 10){
                hours = '0' + hours;
            }
            if(minutes < 10){
                minutes = '0' + minutes;
            }
            return day + "." + month +"."
                + date.getFullYear() +" "+ hours +":"+ minutes;
        }
    }
})(angular);