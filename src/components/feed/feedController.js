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

    FeedController.$inject = ['scEventService', '$anchorScroll', '$location', '$scope', '$route' ];

    function FeedController(scEventService, $anchorScroll, $location, $scope, $route) {
        var feedCtrl = this;

        // Forms for the filter.
        feedCtrl.filterForm = {
            onlyWatchedEntities: false,
            hideOwnActivities: false,
            workspaceId: null,
            userId: null,
            eventType: null,
            entityType: null
        };

        feedCtrl.dateForm = {
            startDay: null,
            startTime: null,
            endDay: null,
            endTime: null
        };

        // Initialize filter selection data.
        feedCtrl.eventTypes = ('ADD REMOVE CHANGE RESTORE UNKNOWN').split(' ');
        feedCtrl.workspaces = [];
        feedCtrl.users = [];
        feedCtrl.entityTypes = [];

        // Set up pagination.
        feedCtrl.currentPageIndex = feedCtrl.eventPage.pageIndex;
        feedCtrl.currentTotalNumberOfPages = feedCtrl.eventPage.totalNumberOfPages;

        feedCtrl.currentFilterParameters = {};

        // Functions available for the feed controller.
        feedCtrl.getArrayOfSize = getArrayOfSize;
        feedCtrl.loadPage = loadPage;
        feedCtrl.loadUsers = loadUsers;
        feedCtrl.loadWorkspaces = loadWorkspaces;
        feedCtrl.loadEntityTypes = loadEntityTypes;
        feedCtrl.onFilter = onFilter;

        var feedPath = $route.current.$$route.originalPath;

        // Loading data also considering the search parameter from the url. Supports browser back button.
        $scope.$on('$locationChangeStart', onLocationChangeStart);
        $scope.$on('$locationChangeSuccess', onSuccessfulLocationChange);


        function onLocationChangeStart() {
            if ($location.$$path !== feedPath) {
                $location.hash(null).search('pageIndex', null);
            }
        }

        function onSuccessfulLocationChange() {
            if ($route.current.params.pageIndex !== feedCtrl.eventPage.pageIndex) {
                // Fetching new page because of browser navigation.
                fetchAndBindPage($route.current.params.pageIndex);
            }
        }

        function loadUsers() {
            return scEventService.getUsers().then(
                function (users) {
                    feedCtrl.users = users;
                });
        }

        function loadWorkspaces() {
            return scEventService.getWorkspaces().then(
                function (workspaces) {
                    feedCtrl.workspaces = workspaces;
                });
        }

        function loadEntityTypes() {
            return scEventService.getEntityTypes(feedCtrl.filterForm.workspaceId).then(
                function (entityTypes) {
                    feedCtrl.entityTypes = entityTypes;
                });
        }

        function getArrayOfSize(size) {
            return new Array(size);
        }

        function onFilter() {
            var startTimestamp = formatDate(feedCtrl.dateForm.startDay, feedCtrl.dateForm.startTime);
            var endTimestamp = formatDate(feedCtrl.dateForm.endDay, feedCtrl.dateForm.endTime);
            feedCtrl.currentFilterParameters = angular.copy(feedCtrl.filterForm);

            feedCtrl.currentFilterParameters.startDate = startTimestamp;
            feedCtrl.currentFilterParameters.endDate = endTimestamp;

            fetchAndBindPage(0);
        }

        function formatDate(date, time){
            if (date === null || time === null) {
                return null;
            }

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

            return day + "." + month + "." + date.getFullYear() + " " + hours + ":" + minutes;
        }

        function loadPage(index) {
            fetchAndBindPage(index, true);
        }

        function fetchAndBindPage(index) {
            var indexToLoad = 0;

            if (index) {
                indexToLoad = index;
            }

            scEventService.getEvents(feedCtrl.currentFilterParameters, indexToLoad).then(bindPage);
        }

        function bindPage(newPage) {
            if (newPage) {
                feedCtrl.eventPage = newPage;
                feedCtrl.currentPageIndex = newPage.pageIndex;
                feedCtrl.currentTotalNumberOfPages = newPage.totalNumberOfPages;
                scrollToTop();
                $location.search('pageIndex', newPage.pageIndex);
            }
        }

        function scrollToTop() {
            $anchorScroll(0);
        }
    }
})(angular);