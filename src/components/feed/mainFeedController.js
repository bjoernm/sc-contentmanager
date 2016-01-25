/**
 * Created by albert on 06.01.16.
 */

(function () {

    angular
        .module('scGenericClient')
        .controller('scMainFeedController', MainFeedController );

    MainFeedController.$inject = [ 'eventPage' ];

    function MainFeedController (eventPage) {
        var mainFeedCtrl = this;

        mainFeedCtrl.eventPage = eventPage;
    }
})();
