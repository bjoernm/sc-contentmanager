(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name scFeed
     * @restrict E
     * @scope
     * @description
     *
     * The directive for the feed.
     */
    angular
        .module('scFeed')
        .directive('scFeed', FeedDirective);

    FeedDirective.$inject = [];

    function FeedDirective() {
        var attributes = {
            eventPage: "=scFeedPage"
        };

        var requiredAttributes = ['scFeedPage'];

        return {
            restrict: 'E',
            templateUrl: 'components/feed/feed.tpl.html',
            controllerAs: 'feedCtrl',
            controller: 'FeedController',
            scope: attributes,
            require: requiredAttributes,
            bindToController: true
        };
    }
})();