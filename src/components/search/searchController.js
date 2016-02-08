(function (angular) {
    'use strict';

    angular
        .module('scSearch')
        .controller('scSearchController', scSearchController);

    scSearchController.$inject = ['$scope', 'scSearchService', 'data', 'scAuth'];
    function scSearchController($scope, scSearchService, data, scAuth) {
        var vm = this;
        vm.searchText = data;
        vm.sortBy = '';
        vm.filterBy = '';

        scSearchService.getSearchResults(vm.searchText)
            .then(function (results) {
                vm.searchResults = results;
                console.log(results);
            });

        vm.user = scAuth.getUser();

    }
})(angular);