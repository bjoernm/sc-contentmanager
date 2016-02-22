(function (angular) {
    'use strict';

    angular
        .module('scSearch')
        .controller('scSearchController', scSearchController);

    scSearchController.$inject = ['$scope', 'scSearchService', 'data', 'scAuth', '$location'];
    function scSearchController($scope, scSearchService, data, scAuth, $location) {
        var vm = this;
        vm.sortBy = data.sortBy;
        vm.user = scAuth.getUser();
        vm.filterResults = filterResults;


        //add filters here TODO: filterAttributes
        vm.filters = [
            {
                name: "Sort by",
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
                model: data.sortBy
            },
            {
                name: "Content type",
                options: [
                    {
                        name: 'All',
                        val: ''
                    }],
                filterAttr: 'resourceType',
                model: data.resourceType
            },
            {
                name: "Workspace",
                options: [
                    {
                        name: 'All',
                        val: ''
                    }
                ],
                //filterAttr: 'workspace',
                model: data.workspace
            },
            {
                name: "Type",
                options: [
                    {
                        name: 'All',
                        val: ''
                    }
                ],
                //filterAttr: 'type',
                model: data.type
            },
            {
                name: "System attribute",
                options: [
                    {
                        name: 'All',
                        val: ''
                    }
                ],
                //filterAttr: 'systemAttribute',
                model: data.systemAttribute
            },
            {
                name: "Special",
                options: [
                    {
                        name: 'All',
                        val: ''
                    }
                ],
                //filterAttr: 'special',
                model: data.special
            }
        ];


        scSearchService.getSearchResults(data)
            .then(function (results) {
                vm.searchResults = results;
                console.log(results);

            });

        function filterResults() {
            /*var filterBy = {
                resourceType: vm.filters[1].model,
                workspace: vm.filters[2].model,
                type: vm.filters[3].model,
                systemAttribute: vm.filters[4].model,
                special: vm.filters[5].model
            };

            var filterMap = Object.keys(filterBy).map(function (key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(filterBy[key]);
            }).join('&');*/

            var searchParams = {
                searchText: data.searchText,
                sortBy: vm.filters[0].model,
                resourceType: vm.filters[1].model,
                workspace: vm.filters[2].model,
                type: vm.filters[3].model,
                systemAttribute: vm.filters[4].model,
                special: vm.filters[5].model
                //filterMap: filterMap
            };

            $location.path('search').search(searchParams);
        }

    }
})(angular);