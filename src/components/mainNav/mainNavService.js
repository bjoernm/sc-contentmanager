
(function(){
    'use strict';

    angular.module('mainNav')
        .service('mainNavService', ['$q', mainNavService]);

    /**
     * Workspace DataService
     * Uses embedded, hard-coded data model; acts asynchronously to simulate
     * remote data service call(s).
     *
     * @returns {{loadAll: Function}}
     * @constructor
     */
    function mainNavService($q){
        var workspaces = [
            {
                name: 'Worskpace: 1',
                id: '1'
            },
            {
                name: 'Worskpace: 2',
                id: '2'
            },
            {
                name: 'Worskpace: 3',
                id: '3'
            },
            {
                name: 'Worskpace: 4',
                id: '4'
            }
        ];

        // Promise-based API
        return {
            loadAllWorkspaces : function() {
                // Simulate async nature of real remote calls
                return $q.when(workspaces);
            }
        };
    }

})();