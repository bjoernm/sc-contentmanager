(function () {
    'use strict';

    angular
        .module('scGenericClient', ['ngMaterial', 'scMainNav', 'scMainContent', 'scFeed', 'ngRoute' ])
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('brown')
                .accentPalette('red');
        });

    angular.module('scGenericClient')
        .filter('percentage', percentageFilter);

    angular.module('scGenericClient')
        .config(routingConfig);


    routingConfig.$inject = ['$routeProvider'];
    function routingConfig($routeProvider) {
    }

    percentageFilter.$inject = ['$filter', '$log'];
    function percentageFilter($filter, $log) {
        return function (input, decimals) {
            if (input === '') {
                input = 0;
            }

            if ('number' !== typeof input) {
                input = parseFloat(input);
            }

            if (!isFinite(input)) {
                return '' + input;
            }
            return $filter('number')(input * 100, decimals) + '%';
        };
    }
})();