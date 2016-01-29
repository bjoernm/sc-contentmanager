(function() {

    angular
        .module('scFeed')
        .constant('angularMomentConfig', {
        preprocess: 'utc',
        timezone: 'Europe/Berlin' // TODO: Configure this correclty.
    });

});