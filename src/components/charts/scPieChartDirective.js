(function () {
    'use strict';

    angular
        .module('scCharts')
        .directive('scPieChart', scPieChartDirective);

    scPieChartDirective.$inject = ['$log', '$window'];

    function scPieChartDirective($log, $window) {
        return {
            restrict: 'E',
            template: svgTemplate(),
            replace: true,
            scope: {
                percentage: '@',
                foreground: '@',
                background: '@',
                diameter: '@',
                showPercentage: '@'
            },
            link: function (scope, element, attrs) {
                if (!angular.isDefined(scope.percentage) || !isFinite(parseInt(scope.percentage))) {
                    $log.error("percentage must be a finite number: percentage = ", scope.percentage);
                    scope.percentage = 0;
                }

                // undefined is ok because of fallback
                // so check if it is defined and no finite number
                if (angular.isDefined(scope.diameter) && !diameterRegex.test(scope.diameter)) {
                    throw new Error("diameter must match the following pattern: " + diameterRegex.source + "; example: 16px; the default unit is px and the default size is the computed font size");
                }

                // FIXME: why is this not evaluated before the template?
                // based on debug log its getting (string, number, number, string, undefined)
                // which means that percentage AND diameter are still strings when the function is called
                // percentage must be between 0 and 1
                // normalizing the percentage makes no sense without having it evaluated before the calcPath method
                scope.percentage = Math.max(0, Math.min(1, parseFloat(scope.percentage)));
                scope.calcPath = calcPath;
                scope.getSvgStyle = getSvgStyleFunction($log);
                scope.showPercentage = scope.showPercentage || true;
                scope.isTrue = isTrue;


                if (!angular.isDefined(scope.diameter)) {
                    scope.diameter = $window.getComputedStyle(element[0]).getPropertyValue('font-size')
                }

            }
        };
    }

    var diameterRegex = /^(\d+(?:\.\d*)?)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax)$/;

    function getSvgStyleFunction($log) {
        return function (diameter) {
            var value = '0px';

            if (!!diameter && diameterRegex.test(diameter)) {
                var arr = diameterRegex.exec(diameter)

                var diameterNumber = parseFloat(arr[1]);
                var diameterUnit = arr[2] || 'px';
                value = (diameterNumber) + diameterUnit;
            } else {
                //$log.error('The given diameter does not fit the expected format: diameter = ' + diameter);
            }

            return {
                'height': value,
                'width': value
            }
        }
    }

    function isTrue(stringValue) {
        if ('boolean' === typeof stringValue) {
            return stringValue;
        }

        var b = /true/i.test(stringValue);

        return b;
    }

    /*
     Usage of meta is unclear, just don't use it
     */
    function calcPath(radius, border, startangle, endangle, meta) {
        // console.log(radius, border, startangle, endangle, meta);

        meta = meta || false;

        radius = parseFloat(radius);
        border = parseFloat(border);
        startangle = parseFloat(startangle);
        endangle = parseFloat(endangle)


        // allow startangle and endangle to be angles between 0° and 360°
        /*
         startangle = (startangle / 180) * Math.PI;
         endangle = (endangle / 180) * Math.PI;
         //*/

        // allow startangle and endangle to be percentages between 0 and 1
        //*
        var PI2 = Math.PI * 2;
        startangle = PI2 * startangle;
        endangle = PI2 * endangle;
        //*/

        var cx = radius + border;
        var cy = radius + border;

        var x1 = cx + radius * Math.sin(startangle);
        var y1 = cx - radius * Math.cos(startangle);
        var x2 = cx + radius * Math.sin(endangle);
        var y2 = cx - radius * Math.cos(endangle);

        //flag for angles larger than than a half circle
        var big = 0;
        if (endangle - startangle > Math.PI) {
            big = 1;
        }

        //path details
        var r = radius;
        var d = "M " + x1 + ", " + y1;
        d += " A " + r + ", " + r;
        d += " 0 " + big + " 1";
        d += " " + x2 + ", " + y2;

        if (!meta) {
            d += " L " + cx + ", " + cy;
            d += " Z";
        }

        return d;
    }

    function svgTemplate() {
        return ['<svg xmlns="http://www.w3.org/2000/svg" ng-style="getSvgStyle(diameter)" viewBox="0 0 2 2" class="scCharts scPieChart">',
            '<circle cx="1" cy="1" r="1" fill="{{background}}" ng-if="percentage <= 0" class="background" />',
            '<circle cx="1" cy="1" r="1" fill="{{foreground}}" ng-if="percentage >= 1" class="foreground" />',
            '<g ng-if="percentage > 0 && percentage < 1">',
            '<path ng-attr-d="{{calcPath(1, 0, 0, percentage)}}" ng-attr-fill="{{foreground}}" class="foreground" />',
            '<path ng-attr-d="{{calcPath(1, 0, percentage, 1)}}" ng-attr-fill="{{background}}" class="background" />',
            '</g>',
            '<text ng-if="isTrue(showPercentage)" text-anchor="middle" style="font-size: .8px" x="1" y="1.25">{{percentage | percentage: 0}}</text>',
            '</svg>'].join('')
    }
})();