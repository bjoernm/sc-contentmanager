'use strict';

(function(){
    angular.module('scMainNav')
        .factory('sharedNavDataService', sharedNavDataService);

    function sharedNavDataService() {
        return {
            'entities': {
                'tree': [],
                'index': {}
            },
            'currentWorkspaceId':'',
            'currentEntityId': '',
            'currentEntity': {}
        }
    }
})(angular);