/**
 * Created by albert on 26.11.15.
 */
(function (angular) {

    /**
     * Controller for the feed comments directive.
     *
     * @name commentCtrl
     * @type FeedItemCommentsController
     */
    angular
        .module('scFeed')
        .controller('FeedItemCommentsController', FeedItemController);

    FeedItemController.$inject = [ '$mdDialog', 'scEventService' ];

    function FeedItemController($mdDialog, scEventService) {
        var commentCtrl = this;

        commentCtrl.loadComments = loadComments;
        commentCtrl.saveComment = saveComment;
        commentCtrl.deleteComment = deleteComment;
        commentCtrl.addComment = addComment;

        function loadComments(changeset) {
            scEventService.ChangeSet.getComments( { id: changeset.id} ).$promise.then(showComments)

        }

        function showComments(comments) {
            commentCtrl.comments = comments;
        }

        function saveComment(comment, newContent) {
            scEventService.Comment
                .put({ id: comment.id }, { content: newContent })
                .$promise.then(function (updatedComment) {
                comment.content = updatedComment.content;
                comment.edit = false;
            });
        }

        function addComment(newCommentText) {
            scEventService.ChangeSet
                .postComment(
                    { id: commentCtrl.changeset.id },
                    { content: newCommentText })
                .$promise.then(addToLocalComments);
        }

        function deleteComment(index) {
            var confirmDeleteDialog =
                $mdDialog.confirm()
                    .title('Delete this comment?')
                    .textContent('Are you sure you want to delte this comment?')
                    .ariaLabel('Delete comment dialog')
                    .ok('Yes')
                    .cancel('No');

            $mdDialog
                .show(confirmDeleteDialog)
                .then(removeFromComments(index));
        }

        function removeFromComments(index) {
            return function () {
                scEventService.Comment
                    .delete({ id: commentCtrl.comments[index].id }).$promise
                    .then(removeFromLocalComments(index));
            }
        }

        function removeFromLocalComments(index) {
            return function () {
                commentCtrl.comments.splice(index,1);
            }
        }

        function addToLocalComments(comment) {
            commentCtrl.comments.push(comment);
            commentCtrl.newCommentText = '';
        }

    }

})(angular);
