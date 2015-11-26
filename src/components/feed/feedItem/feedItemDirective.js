/**
 * Created by albert on 26.11.15.
 */
(function (angular) {
    'use strict';

    angular
        .module('scFeed')
        .directive('scFeedItem', FeedItemDirective);

    FeedItemDirective.$inject = [];

    function FeedItemDirective() {
        return {
            restrict: 'E',
            require: ['scEventSrc'],
            templateUrl: 'components/feed/feedItem/feedItem.tpl.html',
            scope: {
                event: "=scEventSrc"
            },
            controllerAs: 'feedItemCtrl',
            controller: 'FeedItemController',
            bindToController: true
        };
    }

})(angular);
