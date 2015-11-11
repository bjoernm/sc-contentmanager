(function () {
    'use strict';

    angular
        .module('scFeed')
        .directive('scFeed', feedDirective);

    feedDirective.$inject = ['scFeedService', '$log'];

    function feedDirective(scFeedService, $log) {
        return {
            restrict: 'E',
            templateUrl: 'components/feed/feed.tpl.html',
            link: function (scope, element, attrs) {
            }
        };

    }


})();