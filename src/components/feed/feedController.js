(function () {

    /**
     * Controller for the feed directive.
     *
     * @name feedCtrl
     * @type FeedController
     */
    angular
        .module('scFeed')
        .controller('FeedController', FeedController);

    FeedController.$inject = ['scChangeSetService'];

    function FeedController(changeSetService) {
        var feedCtrl = this;

        feedCtrl.hasError = false;
        feedCtrl.error = null;
        feedCtrl.changeSets = null;

        changeSetService.getChangeSets().then(
            function (changeSets) {
                feedCtrl.changeSets = changeSets;
            },
            function (error) {
                feedCtrl.hasError = true;
                feedCtrl.error = error;

            });
    }
})();