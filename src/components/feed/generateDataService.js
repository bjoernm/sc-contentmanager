(function () {
    'use strict';



    /**
     * @ngdoc service
     * @type ScEventService
     * @requires $resource $http $base64
     * @description
     *
     * The service for loading events for the feed from the server.
     */
    angular
        .module('scFeed')
        .service('scGenerateDataService', ScEventService);

    ScEventService.$inject = ['$resource', '$http', '$base64'];

    function ScEventService($resource, $http, $base64) {
        var service = {
            getEvents: getEvents,
            generateData: generateData
        };

        /**
         * Url for the instance of SocioCortex.
         *
         * @type {string}
         * @const
         * @static
         */
        var SC_INSTANCE_URL = 'http://localhost:8083/intern/tricia/';

        /**
         * Credentials for Basic Authentication.
         *
         * @type {{ user: string, password, string }}
         * @const
         * @static
         */
        var CREDENTIALS = {
            user: 'mustermann@test.sc',
            password: 'ottto'
        };

        /**
         * Definition of resources for service.
         * @type {Resource}
         */
        var WorkspaceResource =
            $resource(apiToInstanceUrl('api/v1/workspaces'));



        initializeBasicAuthentication();


        /**
         * Retrieves an event page from the server.
         *
         * @promise {ScEventPage} A page of events.
         * @reject {Error} An error if one occurred.
         * @public
         **/
        function getEvents() {
            return EventResource.get().$promise;
        }

        /**
         * Converts an API URL to an URL for the SocioCortex instance.
         *
         * @param {string} apiUrl
         * @return {string}
         * @static
         * @private
         */
        function apiToInstanceUrl(apiUrl) {
            return SC_INSTANCE_URL + apiUrl;
        }

        /**
         * Sets the default cretendtials in the header used by $http
         *
         * @static
         * @private
         */
        function initializeBasicAuthentication() {
            $http.defaults.headers.common.Authorization =
                'Basic ' +
                $base64.encode(CREDENTIALS.user + ':' + CREDENTIALS.password);
        }

        //workspace erstellen
        function generateData() {

            var data = {
                name: 'Testspace1'
            };

            WorkspaceResource.save(data).$promise.then(function(workspace){console.log(workspace)}, function(error){console.log(error)});



            //$http.post('http://localhost:8083/intern/tricia/api/v1/workspaces', data, config).then(successCallback, errorCallback);
        }



        //page erstellen

        //changes vornehmen



        return service;
    }
})();