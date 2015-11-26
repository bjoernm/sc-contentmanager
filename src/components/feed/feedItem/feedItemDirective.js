/**
 * Created by albert on 26.11.15.
 */
(function (angular) {
    'use strict';

    /**
     * Controller for the feed directive.
     *
     * @name feedItemCtrl
     * @type FeedItemController
     */
    angular
        .module('scFeed')
        .directive('scFeedItem', FeedItemDirective);

    FeedItemDirective.$inject = [];

    function FeedItemDirective() {
        return {
            restrict: 'EA',
            templateUrl: 'components/feed/feedItem/feedItem.tpl.html',
            scope: {
                event: "="
            },
            controllerAs: 'feedItemCtrl',
            controller: 'FeedItemController',
            bindToController: true
        };
    }

})(angular);
