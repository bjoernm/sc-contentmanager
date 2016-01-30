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

    FeedItemController.$inject = [ '$sce', 'scEventService' ];

    function FeedItemController($sce, scEventService) {
        var feedItemCtrl = this;
        // Variables in directive scope attribute are bound to this object a.k.a. feedItemCtrl.

        feedItemCtrl.showDetails = false;
        feedItemCtrl.showComments = false;

        feedItemCtrl.trustHtml = trustHtml;
        feedItemCtrl.separateChanges = separateChanges;
        feedItemCtrl.toggleComments = toggleComments;

        function trustHtml(htmlString) {
            return $sce.trustAsHtml(htmlString);
        }

        function separateChanges(changes) {
            feedItemCtrl.valueChanges = [];
            feedItemCtrl.richStringChanges = [];
            feedItemCtrl.roleChanges = [];
            feedItemCtrl.deletedEntityChanges = [];

            // Loop properly here. This is inefficient.
            for (var i = 0; i < changes.length; i++) {
                var change = changes[i];
                if (change.type == 'simpleValue' || change.type == 'hybridProperty') {
                    feedItemCtrl.valueChanges.push(change);
                } else if (change.type == 'richString') {
                    feedItemCtrl.richStringChanges.push(change);
                } else if (change.type == 'role') {
                    feedItemCtrl.roleChanges.push(change);
                } else if (change.type == null) {
                    feedItemCtrl.deletedEntityChanges.push(change);
                }
            }
        }

        function loadComments(changeset) {
            scEventService.ChangeSet.getComments( { id: changeset.id} ).$promise.then(showComments)
        }

        function showComments(comments) {
            feedItemCtrl.comments = comments;
            feedItemCtrl.showComments = true;
        }

        function toggleComments() {
            if (feedItemCtrl.showComments) {
                feedItemCtrl.comments = [];
                feedItemCtrl.showComments = false;
            } else {
                loadComments(feedItemCtrl.event.changeset);
            }
        }
    }

})(angular);
