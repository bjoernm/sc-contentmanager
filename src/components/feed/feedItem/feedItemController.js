/**
 * Created by albert on 26.11.15.
 */
(function (angular) {

    /**
     * @ngdoc controller
     * @name feedItemCtrl
     * @property {ScEvent} event The event property from the directive scope.
     * @type FeedItemController
     *
     * Controller for the feed item directive.
     */
    angular
        .module('scFeed')
        .controller('FeedItemController', FeedItemController);

    FeedItemController.$inject = [ '$sce', '$filter', 'scEventService', 'scAuth' ];

    function FeedItemController($sce, $filter, scEventService, scAuth) {
        var feedItemCtrl = this;

        // Variables
        feedItemCtrl.showDetails = false;
        feedItemCtrl.showComments = false;
        feedItemCtrl.likedByCurrentUser = false;

        // Functions
        feedItemCtrl.trustHtml = trustHtml;
        feedItemCtrl.separateChanges = separateChanges;
        feedItemCtrl.toggleComments = toggleComments;
        feedItemCtrl.toggleLike = toggleLike;

        // Controller Initialization
        separateChanges(feedItemCtrl.event.changeset.changes);
        determineIfUserLikesChangeset();

        // Function definitions
        function determineIfUserLikesChangeset() {
            feedItemCtrl.likedByCurrentUser = false;

            angular.forEach(feedItemCtrl.event.changeset.likers, function (user) {
                var currentUser = scAuth.getUser();

                if (user.id === currentUser.id) {
                    feedItemCtrl.likedByCurrentUser = true;
                }
            });
        }

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

        function toggleComments() {
            if (feedItemCtrl.showComments) {
                feedItemCtrl.comments = [];
                feedItemCtrl.showComments = false;
            } else {
                loadComments(feedItemCtrl.event.changeset);
            }
        }

        function loadComments(changeset) {
            scEventService.ChangeSet.getComments( { id: changeset.id} ).$promise.then(showComments)
        }

        function showComments(comments) {
            feedItemCtrl.comments = comments;
            feedItemCtrl.showComments = true;
        }

        function toggleLike() {
            if (feedItemCtrl.likedByCurrentUser) {
                unlikeChangeset();
            } else {
                likeChangeset();
            }
        }

        function likeChangeset() {
            scEventService.ChangeSet
                .like( { id: feedItemCtrl.event.changeset.id } )
                .$promise.then(function () {
                feedItemCtrl.likedByCurrentUser = true;
                feedItemCtrl.event.changeset.likers.push(scAuth.getUser());
            });
        }

        function unlikeChangeset() {
            scEventService.ChangeSet
                .unlike( { id: feedItemCtrl.event.changeset.id } )
                .$promise.then(function () {
                    removeCurrentUserFromChangeSetLikers();
                    feedItemCtrl.likedByCurrentUser = false;
            });
        }

        function removeCurrentUserFromChangeSetLikers() {
            feedItemCtrl.event.changeset.likers =
                $filter('filter')(feedItemCtrl.event.changeset.likers, { id: '!' + scAuth.getUser().id } )
        }
    }

})(angular);
