/**
 * Created by albert on 26.11.15.
 */


(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name scFeedItem
     * @restrict E
     * @scope
     * @description
     *
     * The directive for single feed items.
     */
    angular
        .module('scFeed')
        .directive('scFeedItem', FeedItemDirective);

    FeedItemDirective.$inject = [];

    function FeedItemDirective() {
        var attributes = {
            event: "=scFeedEvent"
        };

        var requiredAttributes = ['scFeedEvent'];

        return {
            restrict: 'E',
            require: requiredAttributes,
            templateUrl: 'components/feed/feedItem/feedItem.tpl.html',
            scope: attributes,
            controllerAs: 'feedItemCtrl',
            controller: 'FeedItemController',
            bindToController: true
        };
    }

})();
