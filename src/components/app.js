(function () {
    'use strict';

    angular
        .module('scGenericClient', ['ngMaterial', 'scMainNav', 'scMainContent', 'ngRoute'])
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('teal')
                .accentPalette('red');
        });

    // primary color:        #195B8B
    // primary color2:       #88C0E8
    // secondary color:      #F0F7FC
    // accent color:         #FF5252
    // Text color 1:         #FFFFFF
    // Text color 2:         #000000
    // secondary text color: #555555
    // link color:           #003359
    // icon color:           #9B9B9B
    // Background color 1:   #EEEEEE
    // Background color 2:   #FAFAFA
    // Background color 3:   #CCCCCC

    angular.module('scGenericClient')
        .filter('percentage', percentageFilter);

    percentageFilter.$inject = ['$filter'];
    function percentageFilter($filter) {
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