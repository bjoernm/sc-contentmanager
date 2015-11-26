(function () {
    'use strict';

    angular
        .module('scFeed')
        .service('scEventService', ScEventService);

    ScEventService.$inject = ['$resource', '$http', '$base64'];

    function ScEventService($resource, $http, $base64) {
        /** The returned service */
        var service = {
            getEvents: getEvents
        };

        /** Url for the instance of SocioCortex. */
        const SC_INSTANCE_URL = 'http://localhost:8083/intern/tricia/';

        /** Credentials for Basic Authentication. */
        var credentials = {
            user: 'mustermann@test.sc',
            password: 'ottto'
        };

        /** Definition of resources for service. */
        var ChangeSets =
            $resource(apiToInstanceUrl('api/v1/changesets'));

        /** Service initialization. */
        initializeBasicAuthentication();

        /** Begin service implementation. */
        function getEvents() {
            return ChangeSets.get().$promise;
        }

        /** Converts an API URL to an URL for the SocioCortex instance */
        function apiToInstanceUrl(apiUrl) {
            return SC_INSTANCE_URL + apiUrl;
        }

        function initializeBasicAuthentication() {
            $http.defaults.headers.common.Authorization =
                'Basic ' +
                $base64.encode(credentials.user + ':' + credentials.password);
        }

        return service;
    }
})();