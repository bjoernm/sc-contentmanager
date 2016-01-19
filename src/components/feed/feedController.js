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

    FeedController.$inject = ['scEventService', '$anchorScroll', '$location', '$scope', '$route' ];

    function FeedController(scEventService, $anchorScroll, $location, $scope, $route) {
        var feedCtrl = this;

        // Forms for the filter.
        feedCtrl.filterForm = {
            onlyWatchedEntities: false,
            hideOwnActivities: null,
            workspaceId: null,
            user: null,
            eventType: null,
            entityType: null,
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
                //$location.query('workspaceId', null);
            }
        }

        function onSuccessfulLocationChange() {
            /*if ($route.current.params.pageIndex !== feedCtrl.eventPage.pageIndex) {
                // Fetching new page because of browser navigation.
                fetchAndBindPage($route.current.params.pageIndex);
            }*/
            if($route.current.params != feedCtrl.currentFilterParameters){
                getFilterFromQueryParameters();
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

            feedCtrl.currentFilterParameters.pageIndex = 0;

            setQueryParametersFromFilterSettings();

            fetchAndBindPage();
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

        function stringToDate(dateString){
            var day = dateString.substring(0,2);
            var month = dateString.substring(3,5);
            var year = dateString.substring(6,10);
            var hours = dateString.substring(11,13);
            var minutes = dateString.substring(14,16);
            var seconds = 0;
            var milliseconds = 0;
            return new Date(year, month-1, day, hours, minutes, seconds, milliseconds);
        }

        function loadPage(index) {
            feedCtrl.currentFilterParameters.pageIndex = index;
            fetchAndBindPage();
        }

        function fetchAndBindPage() {
            scEventService.getEvents(feedCtrl.currentFilterParameters).then(bindPage);
        }

        function bindPage(newPage) {
            if (newPage) {
                feedCtrl.eventPage = newPage;
                feedCtrl.currentPageIndex = newPage.pageIndex;
                feedCtrl.currentTotalNumberOfPages = newPage.totalNumberOfPages;
                feedCtrl.currentFilterParameters.pageIndex = newPage.pageIndex;
                setQueryParametersFromFilterSettings();
                scrollToTop();
            }
        }

        function setQueryParametersFromFilterSettings(){
            $location.search(feedCtrl.currentFilterParameters);
        }

        function getFilterFromQueryParameters(){
            feedCtrl.filterForm = $route.current.params;
            feedCtrl.currentFilterParameters = $route.current.params;

            if($route.current.params.startDate) {
                console.log("$route.current.params.startDate: "+$route.current.params.startDate);
                var startTimestamp = stringToDate($route.current.params.startDate);

                feedCtrl.dateForm.startDay = startTimestamp;
                feedCtrl.dateForm.startTime = startTimestamp;
                feedCtrl.currentFilterParameters.startDate = $route.current.params.startDate;
            }

            if($route.current.params.endDate) {
                var endTimestamp = stringToDate($route.current.params.endDate);

                feedCtrl.dateForm.endDay = endTimestamp;
                feedCtrl.dateForm.endTime = endTimestamp;
                feedCtrl.currentFilterParameters.endDate = $route.current.params.endDate;
            }

        }

        function scrollToTop() {
            $anchorScroll(0);
        }
    }
})(angular);