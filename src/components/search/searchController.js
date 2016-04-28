(function (angular) {
    'use strict';

    angular
        .module('scSearch')
        .controller('scSearchController', scSearchController);

    scSearchController.$inject = ['$scope', 'scSearch', 'data', '$location'];
    function scSearchController($scope, scSearch, data, $location) {
        var vm = this;
        vm.filter = data;

        vm.filterResults = filterResults;

        vm.filters = [
            {
                name: "Order by",
                options: [
                    {
                        name: 'Relevance',
                        val: ''
                    },
                    {
                        name: 'Name',
                        val: 'name'
                    },
                    {
                        name: 'Last modified',
                        val: 'lastModified'
                    },
                    {
                        name: 'Type',
                        val: 'resourceType'
                    }],
                model: vm.filter.orderBy
            },
            {
                name: "Content type",
                options: [
                    {
                        name: 'All',
                        val: ''
                    }],
                filterAttr: 'resourceType',
                model: vm.filter.resourceType
            },
            {
                name: "Workspace",
                options: [
                    {
                        name: 'All',
                        val: ''
                    }
                ],
                filterAttr: 'workspace.name',
                model: vm.filter.workspace
            },
            {
                name: "Entity Type",
                options: [
                    {
                        name: 'All',
                        val: ''
                    }
                ],
                filterAttr: 'entityType.name',
                model: vm.filter.entityType
            },
            /*{
                name: "System attribute",
                options: [
                    {
                        name: 'All',
                        val: ''
                    }
                ],
                filterAttr: 'systemAttribute',
                model: vm.filter.systemAttribute
            },
            {
                name: "Special",
                options: [
                    {
                        name: 'All',
                        val: ''
                    }
                ],
                filterAttr: 'special',
                model: vm.filter.special
            }*/
        ];

        scSearch.results(data, function (success) {
            vm.searchResults = success.results;
            vm.searchResultsCount = success.totalCount;
            vm.paginationAmountOfPages = Math.ceil(vm.searchResultsCount / vm.filter.n);
            vm.paginationArray = new Array(vm.paginationAmountOfPages);

            console.log("Search success: ");
            console.log(success);
        }, function (error) {
            console.log("Error while searching.");
        });

        function filterResults() {
            var searchParams = {
                text: vm.filter.text,
                orderBy: vm.filters[0].model,
                resourceType: vm.filters[1].model,
                workspace: vm.filters[2].model,
                entityType: vm.filters[3].model,
                //systemAttribute: vm.filters[4].model,
                //special: vm.filters[5].model,
                n: vm.filter.n,
                page: vm.filter.page
            };

            $location.path('search').search(searchParams);
        }

    }
})(angular);