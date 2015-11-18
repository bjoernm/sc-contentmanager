(function (angular) {
    'use strict';

    angular
        .module('scAttributes')
        .service('scAttributesTaskTableService', scAttributesTaskTableService);

    scAttributesTaskTableService.$inject = ['$q', '$log'];

    function scAttributesTaskTableService($q, $log) {
        return {
            turnMetadataToAttributes: turnMetadataToAttributes,
            setMetadataValue: setMetadataValue
        }

        function setMetadataValue(task, meta, values) {
            meta.values = values;
            switch (meta.name) {
                case 'Progress':
                    task.progress = values[0];
                    break;
                case 'Startdate':
                    task.startdate = values[0];
                    break;
                case 'Enddate':
                    task.enddate = values[0];
                    break;
                case 'Owner':
                    task.owner = values[0];
                    break;
                case 'Expertise':
                    task.expertises = values;
                default:
                    var data = {
                        "task": task,
                        "meta": meta,
                        "values": values
                    }
                    $log.error('the following task meta data could not be set:' + angular.toJson(data,2))
            }
        }

        function turnMetadataToAttributes(task) {
            return [
                progress(task),
                startdate(task),
                enddate(task),
                owner(task),
                expertise(task)
            ];
        }

    }

    function progress(task) {
        return {
            name: 'Progress',
            values: [task.progress],
            icon: 'progress',
            type: 'percentage'
        }
    }

    function startdate(task) {
        return {
            name: 'Startdate',
            values: [task.startdate],
            icon: 'insert_invitation',
            type: 'date'
        }
    }

    function enddate(task) {
        return {
            name: 'Enddate',
            values: [task.enddate],
            icon: 'insert_invitation',
            type: 'date'
        }
    }

    function owner(task) {
        return {
            name: 'Owner',
            values: [task.owner],
            icon: 'person',
            type: 'link'
        }
    }

    function expertise(task) {
        return {
            name: 'Expertise',
            values: task.expertises,
            icon: 'school',
            type: 'link'

        }
    }

})(angular);