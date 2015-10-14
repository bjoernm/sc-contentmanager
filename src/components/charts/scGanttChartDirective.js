(function (angular) {
    'use strict';

    angular
        .module('scCharts')
        .directive('scGanttChart', scGanttChartDirective)
        .directive('scSvgMultiline', scSvgMultiline)
        .directive('scSvgBackground', scSvgBackground)
        .directive('scSvgX2', scSvgX2);

    scGanttChartDirective.$inject = ['$log', '$window', '$interval'];

    function scGanttChartDirective($log, $window, $interval) {
        return {
            restrict: 'E',
            //template: svgTemplate(),
            templateUrl: 'components/charts/scGanttChartDirective.tpl.html',
            replace: true,
            scope: {
                tasks: '='
            },
            controller: function ($scope) {
                $scope.maxTitleLength = 0;
                var lengths = {};
                var lengthKeys = [];
                this.setTitleLength = function (taskUid, length) {
                    lengthKeys.push(taskUid);
                    lengths[taskUid] = length;
                    $scope.maxTitleLength = lengthKeys.reduce(function (a, b) {
                        return Math.max(a, lengths[b]);
                    }, 0);
                };

                $scope.taskTitleHeights = {};
                this.setTitleHeight = function (taskUid, height) {
                    $scope.taskTitleHeights[taskUid] = height;
                }
            },
            link: function (scope, element, attrs) {
                if (!angular.isArray(scope.tasks)) {
                    //$log.error("tasks is not an array: typeof tasks = " + (typeof scope.tasks));
                    throw new TypeError("tasks must be of type array. Perhaps a ngIf='tasks' will help in the parent element. was " + (typeof scope.tasks));
                }

                scope.now = new Date();
                scope.graphOffset = 40;
                scope.processTitle = processTitle;
                scope.lineHeight = getComputedLineHeight(element[0], $window);
                scope.getLinePosition = getLinePositionFunction(scope);
                scope.getDatesPosition = getDatesPosition;
                scope.getProgressDate = getProgressDate;
                scope.getProgressTextDate = getProgressTextDate;
                scope.calculatedValues = setCalculatedTemplateValues(scope.tasks.length, scope.lineHeight.value, scope.getLinePosition);
                scope.elementWidth = 0;

                // this line is a fallback for a resize event on an element
                // delete this when having performance issues
                var stopInterval = $interval(resizeGantt, 1000, 0, true);
                angular.element($window).on('resize', resizeGantt);

                scope.$on("$destroy", function () {
                    $interval.cancel(stopInterval);
                    angular.element($window).off('resize', resizeGantt);
                });

                function setCalculatedTemplateValues(numberOfTasks, lineHeight, getLinePosition) {
                    var calculatedValues = {};

                    calculatedValues.title = {
                        offset: {
                            x: lineHeight * 1.25,
                            y: 0 //-lineHeight / 1.6
                        },
                        padding: lineHeight
                    };

                    calculatedValues.line = {
                        offset: {
                            y: -lineHeight * .4
                        }
                    };

                    calculatedValues.offset = {
                        y: lineHeight / 2
                    };

                    calculatedValues.halfTitlePadding = calculatedValues.title.padding / 2;
                    calculatedValues.outerLineHeight = lineHeight + calculatedValues.title.padding;
                    calculatedValues.linePositions = [];
                    calculatedValues.upperLinePositions = [];
                    calculatedValues.linePositionsWithOffset = [];
                    for (var $index = 0; $index < numberOfTasks; $index++) {
                        var lP = getLinePosition($index);
                        var lPWO = lP + calculatedValues.line.offset.y;
                        calculatedValues.linePositions[$index] = lP;
                        calculatedValues.linePositionsWithOffset[$index] = lPWO;
                        calculatedValues.upperLinePositions[$index] = lPWO - (calculatedValues.outerLineHeight) / 2;
                    }

                    return calculatedValues;
                }

                function getProgressDate(task) {
                    var diff = task.enddate.getTime() - task.startdate.getTime();
                    var fraction = diff * task.progress;
                    return new Date(task.startdate.getTime() + fraction);
                }

                function getProgressTextDate(task) {
                    var a = getProgressDate(task).getTime();
                    var b = task.startdate.getTime();
                    return new Date((a + b) / 2);
                }

                function getDatesPosition(date) {
                    if (!date || 'function' !== typeof date.getTime) {
                        throw new Error("date must have a function called getTime (like a date object). date = " + date);
                    }

                    var offset = scope.calculatedValues.title.offset.x + scope.maxTitleLength + 20;

                    return inner(date, scope.tasks, offset, scope.elementWidth);

                    function inner(date, tasks, offset, elementWidth) {
                        date = date.getTime();
                        var staticDates = getStaticDates(tasks);

                        var normalizedDate = {
                            'begin': 0,
                            'current': date - staticDates.earliestDate,
                            'end': staticDates.latestDate - staticDates.earliestDate
                        };

                        var percentage = normalizedDate.current / normalizedDate.end;
                        percentage = Math.min(1, Math.max(0, percentage));

                        var result = offset + (elementWidth - offset) * percentage;

                        return Math.max(result, 0);
                    }

                    function getStaticDates(tasks) {
                        return tasks.reduce(function (a, b) {
                            return {
                                'earliestDate': Math.min(a.earliestDate, b.startdate.getTime()),
                                'latestDate': Math.max(a.latestDate, b.enddate.getTime())
                            };
                        }, {'earliestDate': scope.now, 'latestDate': scope.now});
                    }
                }

                function resizeGantt() {
                    if (element[0] && element[0].offsetWidth) {
                        scope.elementWidth = element[0].offsetWidth;
                    }
                }
            }
        };


        function processTitle(title) {
            var result = [];

            if (title) {
                result = title.split(/\s+/);
            }

            return result;
        }

        function getLinePositionFunction(scope) {
            return function ($index) {
                var lH = scope.lineHeight.value;
                var result = 3 * lH * $index;
                return result + scope.graphOffset;
            }
        }
    }

    var lengthValueRegex = /^(\d+(?:\.\d*)?)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax)$/;

    function getComputedLineHeight(nativeElement, $window) {
        var lineHeight = lengthValueRegex.exec($window.getComputedStyle(nativeElement).getPropertyValue('line-height'));
        if (!lineHeight) {
            //*
            lineHeight = $window.getComputedStyle(nativeElement).getPropertyValue('font-size');
            lineHeight = lengthValueRegex.exec(lineHeight);
            //*/
        }

        if (!lineHeight) {
            return undefined;
        }

        return {
            "combined": lineHeight[0],
            "value": parseFloat(lineHeight[1]),
            "unit": lineHeight[2]
        };
    }

    var svgNS = 'http://www.w3.org/2000/svg';
    scSvgMultiline.$inject = ['$log', '$window', '$timeout'];
    function scSvgMultiline($log, $window, $timeout) {
        return {
            restrict: 'A',
            require: '^scGanttChart',
            //template: svgTemplate(),
            scope: {
                text: "=",
                scSvgMultiline: "="
            },
            link: function (scope, element, attrs, scGanttChartController) {
                var nativeElement = element[0];

                if (svgNS !== nativeElement.namespaceURI) {
                    throw new Error("the parent element must be of the svg namespace. namespace was " + nativeElement.namespaceURI)
                }

                if ("text" !== nativeElement.tagName) {
                    throw new Error("the parent element must be of type TEXT. element was " + nativeElement.tagName);
                }

                scope.$watch(function () {
                    return scope.text;
                }, initTitleLength);

                scope.$watch("scSvgMultiline", function (newVal, oldVal, scope) {
                    initTitleLength(scope.text, scope.text, scope);
                });

                var doc = nativeElement.ownerDocument;


                function initTitleLength(newValue, oldValue, scope) {
                    removeChildren(nativeElement);

                    var wordArray = newValue.split(/\s+/);
                    var wordIndex = 0;
                    lineLoop:
                        for (var line = 0; line < scope.scSvgMultiline.maxLines; line++) {
                            var tspan = doc.createElementNS(svgNS, "tspan");
                            tspan.setAttribute('x', element.attr("x"));
                            if (line > 0) {
                                tspan.setAttribute('dy', getComputedLineHeight(nativeElement, $window).value * 1.25);
                            }
                            nativeElement.appendChild(tspan);
                            while (tspan.getBoundingClientRect().width <= scope.scSvgMultiline.maxWidth) {
                                if (wordIndex >= wordArray.length) {
                                    break lineLoop;
                                }

                                var word = wordArray[wordIndex++];
                                var preSpace = tspan.childNodes.length <= 0 ? "" : " ";
                                tspan.appendChild(doc.createTextNode(preSpace + word));
                            }

                            while (tspan.lastChild && tspan.getBoundingClientRect().width > scope.scSvgMultiline.maxWidth) {
                                tspan.removeChild(tspan.lastChild);
                                wordIndex -= 1;
                            }
                        }

                    if (wordIndex < wordArray.length) {
                        nativeElement.lastChild.appendChild(doc.createTextNode("..."));
                    }

                    scGanttChartController.setTitleLength(scope.$parent.task.uid, nativeElement.getBBox()["width"]);
                    scGanttChartController.setTitleHeight(scope.$parent.task.uid, nativeElement.getBBox()["height"]);
                }

                function removeChildren(element) {
                    while (element.firstChild) {
                        element.removeChild(element.firstChild);
                    }
                }
            }
        }
    }

    scSvgBackground.$inject = ['$log'];
    function scSvgBackground($log) {
        return {
            restrict: 'A',
            link: function scSvgBackgroundLink(scope, element, attrs) {
                var nativeElement = element[0];

                if (svgNS !== nativeElement.namespaceURI) {
                    throw new Error("the parent element must be of the svg namespace. namespace was " + element.namespaceURI)
                }

                var padding = 0;
                if (attrs['scSvgBackgroundPadding']) {
                    if (isFinite(attrs['scSvgBackgroundPadding'])) {
                        padding = parseFloat(attrs['scSvgBackgroundPadding']);
                        if (padding < 0) {
                            $log.error("the number given for scSvgBackgroundPadding must be greater than zero. was " + padding);
                            return;
                        }
                    } else {
                        $log.warn("the number given for scSvgBackgroundPadding must be finite. was " + attrs['scSvgBackgroundPadding']);
                    }
                }

                var rect = nativeElement.ownerDocument.createElementNS(svgNS, "rect");

                scope.$watch(function watchBBox() {
                    var bBox = nativeElement.getBBox();
                    return bBox.x + " " + bBox.y + " " + bBox.width + " " + bBox.height;
                }, function setBBox() {
                    var bBox = nativeElement.getBBox();
                    rect.setAttribute("x", bBox.x - padding);
                    rect.setAttribute("y", bBox.y - padding);
                    rect.setAttribute("width", bBox.width + padding * 2);
                    rect.setAttribute("height", bBox.height + padding * 2);
                });

                if (attrs['scSvgBackground']) {
                    rect.setAttribute("fill", attrs['scSvgBackground']);
                }
                rect.setAttribute("class", "pageBackground");

                if (attrs['scSvgBackgroundInsertAsFirstChild'] && /test/i.test(attrs['scSvgBackgroundInsertAsFirstChild'])) {
                    var firstChild = nativeElement.parentElement.firstElementChild;
                    nativeElement.parentElement.insertBefore(rect, firstChild);
                } else {
                    nativeElement.parentElement.insertBefore(rect, nativeElement);
                }
            }
        };
    }

    scSvgX2.$inject = ['$log'];
    function scSvgX2($log) {
        return {
            restrict: 'A',
            scope: {
                scSvgX2: "@"
            },
            link: function scSvgX2Link(scope, element, attrs) {
                var nativeElement = element[0];

                if (svgNS !== nativeElement.namespaceURI) {
                    throw new Error("the parent element must be of the svg namespace. namespace was " + element.namespaceURI)
                }

                if (!isFinite(parseFloat(scope.scSvgX2))) {
                    throw new Error("value of scSvgX2 must be a finite number. was " + scope.scSvgX2);
                }

                scope.$watch(function () {
                    return nativeElement.getBBox().x;
                }, scSvgX2Watch);

                scope.$watch('scSvgX2', scSvgX2Watch);

                function scSvgX2Watch(newVal, oldVal, scope) {
                    element.attr("width", Math.max(0, parseFloat(scope.scSvgX2) - nativeElement.getBBox().x));
                    //scope.$apply();
                }
            }
        }
    }
})(angular);