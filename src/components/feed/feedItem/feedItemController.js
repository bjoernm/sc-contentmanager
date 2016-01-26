/**
 * Created by albert on 26.11.15.
 */
(function (angular) {

    /**
     * Controller for the feed directive.
     *
     * @name feedItemCtrl
     * @property {ScEvent} event The event property from the directive scope.
     * @type FeedItemController
     */
    angular
        .module('scFeed')
        .controller('FeedItemController', FeedItemController);

    FeedItemController.$inject = [ '$sce' ];

    function FeedItemController($sce) {
        var feedItemCtrl = this;
        // Variables in directive scope attribute are bound to this object a.k.a. feedItemCtrl.

        feedItemCtrl.hasError = false;

        /** @type {Error} */
        feedItemCtrl.error = null;
        feedItemCtrl.trustHtml = trustHtml;
        feedItemCtrl.separateChanges = separateChanges;

        function trustHtml(htmlString) {
            return $sce.trustAsHtml(htmlString);
        }

        function separateChanges(changes){
            feedItemCtrl.simpleValueChanges = [];
            feedItemCtrl.richStringChanges = [];
            feedItemCtrl.roleChanges = [];
            feedItemCtrl.deletedEntityChanges = [];

            for(var i = 0; i<changes.length;i++){
                var change = changes[i];
                if(change.type == 'simpleValue'){
                    feedItemCtrl.simpleValueChanges.push(change);
                }else if(change.type == 'richString'){
                    feedItemCtrl.richStringChanges.push(change);
                }else if(change.type == 'roleChange'){
                    feedItemCtrl.roleChanges.push(change);
                }else if(change.type == null){
                    feedItemCtrl.deletedEntityChanges.push(change);
                }
            }
        }

    }
})(angular);
