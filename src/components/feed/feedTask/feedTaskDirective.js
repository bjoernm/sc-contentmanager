(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name scFeedTask
     * @restrict E
     * @scope
     * @description
     *
     * The directive for single feed task items.
     */
    angular
        .module('scFeed')
        .directive('scFeedTask', FeedTaskDirective);

    FeedTaskDirective.$inject = [];

    function FeedTaskDirective() {
        var attributes = {
            /**
             * @ngdoc directive
             * @name scFeedEvent
             * @param {expression} scFeedEvent
             * @element sc-feed-item
             * @restrict A
             * @description
             *
             * The attribute for passing the event parameter.
             */
            event: "=scFeedEvent"
        };

        var requiredAttributes = ['scFeedEvent'];

        return {
            restrict: 'E',
            require: requiredAttributes,
            templateUrl: 'components/feed/feedTask/feedTask.tpl.html',
            scope: attributes,
            controllerAs: 'feedTaskCtrl',
            controller: 'FeedTaskController',
            bindToController: true
        };
    }

})();
