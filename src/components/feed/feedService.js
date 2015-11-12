(function (angular) {
    'use strict';

    angular
        .module('scFeed')
        .service('scFeedService', feedService);

    feedService.$inject = ['$q', '$log', 'scCrud'];

    var auth = {
        'user': 'mustermann@test.sc',
        'password': 'ottto'
    }

    function feedService($q, $log,  scCrud) {
        return {

        };

        function getPage(entityUid) {

        }

            };




})(angular);