/**
 * Created by albert on 26.11.15.
 */


(function () {
    'use strict';

    /**
     * @ngdoc directive
     * @name scFeedItemComments
     * @restrict E
     * @scope
     * @description
     *
     * The directive for single feed items.
     */
    angular
        .module('scFeed')
        .directive('scFeedItemComments', FeedItemDirective);

    FeedItemDirective.$inject = [];

    function FeedItemDirective() {
        var attributes = {
            changeset: "=scChangeset",
            comments: "=scComments"
        };

        var requiredAttributes = ['scChangeSet', 'scComments'];

        return {
            restrict: 'E',
            require: requiredAttributes,
            templateUrl: 'components/feed/feedItemComments/feedItemComments.tpl.html',
            scope: attributes,
            controllerAs: 'commentCtrl',
            controller: 'FeedItemCommentsController',
            bindToController: true
        };
    }

})();
