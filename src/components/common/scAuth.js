'use strict';

(function (angular) {
    angular.module('scAuth', []);

    angular
        .module('scAuth')
        .factory('scAuth', scAuth);

    function scAuth() {
        return {
            user: 'mustermann@test.sc',
            password: 'ottto'
        };
    }
})(angular);