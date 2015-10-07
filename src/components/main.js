(function () {
    'use strict';

    angular
        .module('starterApp', ['ngMaterial', 'mainNav', 'scMainContent'])
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('brown')
                .accentPalette('red');
        });

    //*
    angular.module('starterApp')
        .filter('percentage', ['$filter', '$log', function ($filter, $log) {
            return function (input, decimals) {
                if(input === '') {
                    input = 0;
                }

                if('number' !== typeof input) {
                    input = parseFloat(input);
                }

                if(isNaN(input)) {
                    return 'NaN';
                }
                return $filter('number')(input * 100, decimals) + '%';
            };
        }]);
    //*/
})();