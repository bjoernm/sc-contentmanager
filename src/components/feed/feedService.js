(function (angular) {
    'use strict';

    angular
        .module('scFeed')
        .service('scFeedService', feedService);

    feedService.$inject = ['$q', '$log', 'scCrud', 'scAuth'];

    //var auth = {
    //    'user': 'mustermann@test.sc',
    //    'password': 'ottto'
    //}

    /**
     *
     * @param $q
     * @param $log
     * @param scCrud
     * @param scAuth is an object which has the same structure like the auth above.
     *          The difference is that it can be injected and has the same value in
     *          the whole application.
     * @returns {{}}
     */
    function feedService($q, $log, scCrud, scAuth) {
        return {};

        function getPage(entityUid) {

        }

    };


})(angular);