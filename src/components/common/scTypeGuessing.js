'use strict';

(function (angular) {

    angular
        .module('scTypeGuessing', []);

    angular
        .module('scTypeGuessing')
        .service('scTypeGuessing', scTypeGuessing);

    scTypeGuessing.$inject = [];
    function scTypeGuessing() {
        return {
            guessType: guessType
        };

        function guessType(value) {
            if (!value) {
                return;
            }

            try {
                if (couldBeLink()) {
                    return 'link';
                } else if (couldBeDate()) {
                    return 'date';
                }
            } catch (err) {
                $log.error('could not guess type because of error');
                $log.error(err);
            }

            function couldBeLink() {
                return angular.isObject(value)
                    && !!value.id
                    && !!value.name
                    && !!value.href;
            }

            function couldBeDate() {
                // if value equals to null, this will be true
                return !isNaN(new Date(value));
            }
        }
    }

})(angular);