(function (angular) {
    'use strict';

    angular
        .module('scFeed')
        .directive('scFeed', FeedDirective);

    FeedDirective.$inject = [];

    function FeedDirective() {
        return {
            restrict: 'E',
            templateUrl: 'components/feed/feed.tpl.html',
            controllerAs: 'feedCtrl',
            controller: 'FeedController'
        };
    }
})(angular);