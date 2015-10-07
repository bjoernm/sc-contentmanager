(function (angular) {
    'use strict';

    angular
        .module('scColorService', []);

    angular
        .module('scColorService')
        .service('scColorService', scColorService);

    scColorService.$inject = [];

    function scColorService() {
        return {
            getColor: getColor
        }

        function getColor(key) {
            if (angular.isString(key)) {
                return colors[key];
            } else {
                throw new TypeError('key must be of type string: current type is ' + (typeof key));
            }
        }
    }

    var colors = {
        // is now done by css
    /*
        'progress.valid.foreground': '#417505',
        'progress.valid.background': '#cccccc',
        'progress.overdue.foreground': '#e3b6bb',
        'progress.overdue.background': '#d20015',
        'progress.inconsistent.foreground': '#000',
        'progress.inconsistent.background': '#000'
    */
    }

})(angular);