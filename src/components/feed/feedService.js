(function () {
    'use strict';

    /**
     * JSDoc type definition for a simple entity referenced by events and changesets.
     *
     * @typedef {Object} Entity
     *
     * @property {string} id The uniqe id of the entity.
     * @property {string} name The name of the entity
     */

    /**
     * JSDoc type definition for a simple entity referenced by events and changesets.
     *
     * @typedef {Entity} HybridEntity
     *
     * @property {string} type The type of entity.
     */

    /**
     * JSDoc type definition for a change related to a changeset.
     *
     * @typedef {Object} Change
     *
     * @property {string} changedFeatureName The name of the feature that changed.
     * @property {string} changeType The type of change.
     * @property {Object} change The change value (varies).
     */

    /**
     * JSDoc type definition for a changeset related to an event.
     *
     * @typedef {Object} Changeset
     *
     * @property {string} id The uniqe id of the changeset.
     * @property {string} when When was the changeset created.
     * @property {Array<Change>} changes Changes that were made.

     */

    /**
     * JSDoc type definition for an event in an event page.
     *
     * @typedef {Object} Event
     *
     * @property {Array<Entity>} entityBreadcrumb A list of entities to display in the breadcrumb.
     * @property {string} eventType The type of event (ADD, REMOVE, CHANGE, RESTORE or UNKNOWN.
     * @property {Entity} user The user responsible for the change.
     * @property {Entity} space The space or workspace for the change.
     * @property {HybridEntity} entity The changed entity.
     * @property {Changeset} changeset The releated changeset.
     */

    /**
     * JSDoc type definition for an event page loaded via this service.
     *
     * @typedef {Object} EventPage
     *
     * @property {integer} pageIndex The index of the page starting at 0.
     * @property {boolean} hasNext Whether there is another event page.
     * @property {integer} requestedPageSize The requested size of the page.
     * @property {integer} totalNumberOfEvents The total number of events.
     * @property {integer} totalNumberOfPages The total number of pages.
     * @property {Array<Event>} events The events on this page.
     */

    angular
        .module('scFeed')
        .service('scEventService', ScEventService);

    ScEventService.$inject = ['$resource', '$http', '$base64'];

    function ScEventService($resource, $http, $base64) {
        /** The returned service */
        var service = {
            getEvents: getEvents
        };

        /**
         * Url for the instance of SocioCortex.
         *
         * @type {string}
         */
        const SC_INSTANCE_URL = 'http://localhost:8083/intern/tricia/';

        /**
         * Credentials for Basic Authentication.
         *
         * @type {{ user: string, password, string}}
         */
        var credentials = {
            user: 'mustermann@test.sc',
            password: 'ottto'
        };

        /**
         * Definition of resources for service.
         */
        var ChangeSets =
            $resource(apiToInstanceUrl('api/v1/changesets'));

        /** Service initialization. */
        initializeBasicAuthentication();

        /**
         * Begin service implementation.
         *
         * @promise {EventPage} A page of events.
         * @reject {Error} An error if one occurred.
         **/
        function getEvents() {
            return ChangeSets.get().$promise;
        }

        /**
         * Converts an API URL to an URL for the SocioCortex instance.
         *
         * @param {string} apiUrl
         * @return {string}
         */
        function apiToInstanceUrl(apiUrl) {
            return SC_INSTANCE_URL + apiUrl;
        }

        /** Sets the default cretendtials in the header used by $http */
        function initializeBasicAuthentication() {
            $http.defaults.headers.common.Authorization =
                'Basic ' +
                $base64.encode(credentials.user + ':' + credentials.password);
        }

        return service;
    }
})();