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

        function getSearchResults(searchText){

            console.log("searching for:"+searchText);

            return searchHints.get({'q': searchText}).$promise.then(function (data) {
                console.log("datahints");
                console.log(data);
                console.log(data.hints);
                return data.hints;
            });

            //return [{name:"id1", description:"desc1"}, {name:"id2", description:"desc2"}];
        }
    }

})();