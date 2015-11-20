(function () {
    'use strict';

    angular
        .module('scFeed')
        .directive('scFeed', FeedDirective);

    FeedDirective.$inject = ['scChangeSetService'];

    function FeedDirective(changeSetService) {
        return {
            restrict: 'E',
            templateUrl: 'components/feed/feed.tpl.html',
            controllerAs: 'feedCtrl',
            controller: 'FeedController'
        };
    }
})();