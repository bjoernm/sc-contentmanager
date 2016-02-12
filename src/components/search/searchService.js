(function () {
    'use strict';

    angular.module('scSearch')
        .service('scSearchService', scSearchService);

    scSearchService.$inject = ['scData', '$q', '$filter', 'scUtil', '$resource'];
    function scSearchService(scData, $q, $filter, scUtil, $resource) {

        var searchHints = $resource(scUtil.getFullUrl("searchHints")); //TODO: change to fullSearchResults

        return {
            getSearchResults: getSearchResults
        };

        function getSearchResults(searchParams){

            console.log("searching for:");
            //TODO: general search API call
            return searchHints.get({'q': searchParams.searchText}).$promise.then(function (data) {
                return data.hints;
            });
        }
    }

})();