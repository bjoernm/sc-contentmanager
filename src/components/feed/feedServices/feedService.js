(function () {
    'use strict';

    /**
     * @typedef {Object} ScEntity
     * @property {string} id The uniqe id of the entity.
     * @property {string} name The name of the entity
     * @description
     *
     * Type definition for a simple entity referenced by events and changesets.
     */

    /**
     * @typedef {ScEntity} ScHybridEntity
     * @property {string} type The type of entity.
     * @description
     *
     * Type definition for a simple entity referenced by events and changesets.
     */

    /**
     * @typedef {Object} ScProperty
     * @property {string} name The name of the property.
     * @property {string} type The type of entity.
     * @description
     *
     * Type definition for a property of an entity.
     */

    /**
     * @typedef {Object} ScChange
     * @property {ScProperty} property The changed property.
     * @property {string} type The type of change.
     * @property {Object} oldValue The value before the change.
     * @property {Object} newValue The new value after the change.
     * @description
     *
     * Type definition for a change related to a changeset.
     */

    /**
     * @typedef {Object} ScChangeset
     * @property {string} id The unique id of the changeset.
     * @property {string} when When was the changeset created.
     * @property {Array<ScChange>} changes Changes that were made.
     * @property {ScHybridEntity} entity The changed entity.
     * @description
     *
     * JSDoc type definition for a changeset related to an event.
     */

    /**
     * @typedef {Object} ScEvent
     * @property {Array<ScEntity>} entityBreadcrumb A list of entities to display in the breadcrumb.
     * @property {string} eventType The type of event (ADD, REMOVE, CHANGE, RESTORE or UNKNOWN.
     * @property {ScEntity} user The user responsible for the change.
     * @property {ScEntity} space The space or workspace for the change.
     * @property {ScChangeset} changeset The related changeset.
     * @description
     *
     * Type definition for an event in an event page.
     */

    /**
     * @typedef {Object} ScEventPage
     * @property {int} pageIndex The index of the page starting at 0.
     * @property {boolean} hasNext Whether there is another event page.
     * @property {int} requestedPageSize The requested size of the page.
     * @property {int} totalNumberOfEvents The total number of events.
     * @property {int} totalNumberOfPages The total number of pages.
     * @property {Array<ScEvent>} events The events on this page.
     * @description
     *
     * Type definition for an event page loaded via this service.
     */

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
        .service('scEventService', ScEventService);

    ScEventService.$inject = ['$resource', '$http', '$base64', 'scData', 'scPrincipal', 'scAuth'];

    function ScEventService($resource, $http, $base64, scData, scPrincipal, scAuth) {

        /**
         * Url for the instance of SocioCortex.
         *
         * @type {string}
         * @const
         * @static
         */
        var SC_INSTANCE_URL = 'http://localhost:8083/intern/tricia/';

        var SC_PAGE_INDEX = 0;

        var SC_PAGE_SIZE = 50;

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

        initializeBasicAuthentication();

        /**
         * Definition of resources for service.
         * @type {Resource}
         */
        var EventResource =
            $resource(apiToInstanceUrl('api/v1/events/'));

        /**
         * Definition of resources for service.
         * @type {Resource}
         */
        var ChangeSet =
            $resource(
                apiToInstanceUrl('api/v1/changesets/:id'),
                {
                    id: "@id"
                },
                {
                    postComment: {
                        method: "POST",
                        url: apiToInstanceUrl('api/v1/changesets/:id/comments')
                    },
                    getComments: {
                        method: "GET",
                        url: apiToInstanceUrl('api/v1/changesets/:id/comments'),
                        isArray: true
                    }
                }
            );

        /**
         * Definition of resources for service.
         * @type {Resource}
         */
        var Comment = $resource(apiToInstanceUrl('api/v1/comment/:id'),
            {
                id: "@id"
            },
            {
                delete: {
                    method: "DELETE"
                },
                put: {
                    method: "PUT"
                }
            }
        );

        var service = {
            Comment: Comment,
            ChangeSet: ChangeSet,
            getEvents: getEvents,
            getUsers: getUsers,
            getWorkspaces: getWorkspaces,
            getEntityTypes: getEntityTypes
        };

        /**
         * Retrieves an event page from the server.
         *
         * @promise {ScEventPage} A page of events.
         * @reject {Error} An error if one occurred.
         * @public
         **/
        function getEvents(filterParameters, pageIndex, pageSize) {
            return EventResource.get(getCleanFilterParameters(filterParameters, pageIndex, pageSize)).$promise;
        }

        function getCleanFilterParameters(filterParameters) {
            var parameters = {
                pageIndex: SC_PAGE_INDEX,
                pageSize: SC_PAGE_SIZE
            };


            if (filterParameters) {
                if (filterParameters.onlyWatchedEntities) {
                    parameters.onlyWatchedEntities = filterParameters.onlyWatchedEntities;
                }
                if (filterParameters.hideOwnActivites) {
                    parameters.hideOwnActivites= filterParameters.hideOwnActivites;
                }
                if (filterParameters.startDate) {
                    parameters.startDate = filterParameters.startDate;
                }
                if (filterParameters.endDate) {
                    parameters.endDate = filterParameters.endDate;
                }
                if (filterParameters.workspaceId) {
                    parameters.workspaceId = filterParameters.workspaceId;
                }
                if (filterParameters.user) {
                    parameters.user = filterParameters.user;
                }
                if (filterParameters.eventType) {
                    parameters.eventType = filterParameters.eventType;
                }
                if (filterParameters.entityType) {
                    parameters.entityType = filterParameters.entityType;
                }
                if (filterParameters.pageIndex) {
                    parameters.pageIndex = filterParameters.pageIndex;
                }

            }

            return parameters;
        }

        function getUsers() {
            return scPrincipal.User.query().$promise;
        }

        function getWorkspaces() {
            return scData.Workspace.query().$promise;
        }

        function getEntityTypes(workspaceId) {
            var searchObject = {'id': workspaceId};
            return scData.Workspace.getEntityTypes(searchObject).$promise;
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
            scAuth.login(CREDENTIALS.user, CREDENTIALS.password);
        }

        return service;
    }
})();