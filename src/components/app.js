(function () {
    'use strict';

    angular
        .module('scGenericClient', ['ngMaterial', 'scMainNav', 'scMainContent', 'scFeed', 'ngRoute', 'sociocortex', 'angularMoment', 'mdPickers'])
        .filter('percentage', percentageFilter)
        .config(configTheme)
        .value('scConnection', {
            baseUri: 'http://localhost:8083/intern/tricia',
            apiVersion: 'v1'
        })
        .run(scAngular);

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

    scAngular.$inject = ['scAuth'];
    function scAngular(scAuth) {
        scAuth.login('mustermann@test.sc', 'ottto');

    }

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

    configTheme.$inject = ['$mdThemingProvider'];
    function configTheme($mdThemingProvider) {
        /*
         $mdThemingProvider.theme('default')
         .primaryPalette('indigo')
         .accentPalette('red');
         //*/

        $mdThemingProvider.definePalette('primary', {
            "50": "#eff7fc",
            "100": "#aed4f0",
            "200": "#7fbbe8",
            "300": "#439bdc",
            "400": "#298ed8",
            "500": "#237dbf",
            "600": "#1e6ca5",
            "700": "#195b8b",
            "800": "#154a71",
            "900": "#103958",
            "A100": "#eff7fc",
            "A200": "#aed4f0",
            "A400": "#298ed8",
            "A700": "#1a5b8b",
            "contrastDefaultColor": 'light'
        });

        $mdThemingProvider.definePalette('accent', {
            "50": "#ffffff",
            "100": "#ffd2d2",
            "200": "#ff9a9a",
            "300": "#ff5252",
            "400": "#ff3434",
            "500": "#ff1515",
            "600": "#f50000",
            "700": "#d70000",
            "800": "#b80000",
            "900": "#9a0000",
            "A100": "#ffffff",
            "A200": "#ffd2d2",
            "A400": "#ff3434",
            "A700": "#d70000"
        });

        $mdThemingProvider.theme('default')
            .primaryPalette('primary', {
                'default': '700'
            })
            .accentPalette('accent', {
                'default': '300'
            });
    }
})();