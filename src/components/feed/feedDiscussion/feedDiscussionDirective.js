(function () {
    'use strict';

    /**
 * @ngdoc directive
 * @name scFeedDiscussion
 * @restrict E
 * @scope
 * @description
 *
 * The directive for single feed discussion items.
 */
angular
    .module('scFeed')
    .directive('scFeedDiscussion', FeedDiscussionDirective);

FeedDiscussionDirective.$inject = [];

function FeedDiscussionDirective() {
    var attributes = {
        /**
         * @ngdoc directive
         * @name scFeedEvent
         * @param {expression} scFeedEvent
         * @element sc-feed-discussion
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
        templateUrl: 'components/feed/feedDiscussion/feedDiscussion.tpl.html',
        scope: attributes,
        controllerAs: 'feedDiscussionCtrl',
        controller: 'FeedDiscussionController',
        bindToController: true
    };
}

})();
