(function () {
    'use strict';

    angular
        .module('scFeed', [])
        .directive('scFeed', feedDirective);

    //feedDirective.$inject = ['scFeedService', '$log'];

    function feedDirective(scFeedService, $log) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'components/feed/feed.tpl.html',
            link: function (scope, element, attrs) {




            }
        };

    }


})();