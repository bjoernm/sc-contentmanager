(function () {
    'use strict';

    angular.module('scMainNav')
        .service('scMainNavService', scMainNavService);

    scMainNavService.$inject = ['scData', '$q', '$filter', 'scUtil', '$resource'];
    function scMainNavService(scData, $q, $filter, scUtil, $resource) {
        // var cache = $cacheFactory('scMainNavServiceCache');

        var searchHints = $resource(scUtil.getFullUrl("searchHints"));

        return {
            loadAllWorkspaces: loadAllWorkspaces,
            loadTextPages: loadTextPages,
            getSearchHints: getSearchHints
        };

        function getSearchHints(searchText) {
            return searchHints.get({'q': searchText}).$promise.then(function(data){
                console.log(data.hints);
                return data.hints;
            });

        }

        function loadAllWorkspaces() {
            // Simulate async nature of real remote calls
            return scData.Workspace.query().$promise;
        }

        function loadTextPages(workspaceId) {
            return scData.Workspace.get({
                'id': workspaceId
            }).$promise.then(createNavTree);

            function createNavTree(data) {
                var tree = [];
                var map = {};
                tree[0] = data.entityTree;
                tree[0].showChildren = true;
                var treeDepth = getDepthArray(tree[0]);
                enrichNavData(tree[0], null, 0, treeDepth, map);

                return {
                    index: map,
                    tree: tree,
                    list: data.entityTree
                };
            }

            function getDepthArray(obj) {
                if (obj.children && obj.children.length > 0) {
                    var maxDepth = 0;
                    for (var i in obj.children) {
                        var depthChild = getDepthArray(obj.children[i]);
                        if (depthChild > maxDepth) {
                            maxDepth = depthChild;
                        }
                    }
                    return 1 + maxDepth;
                }
                else {
                    return 0;
                }
            }

            function enrichNavData(leaf, parent, level, treeDepth, map) {
                leaf.parent = parent;
                leaf.hierarchyInfo = {
                    'level': level
                };
                map[leaf.id] = leaf;
                if (level < treeDepth) {
                    for (var i in leaf.children) {
                        var newLevel = level + 1;
                        enrichNavData(leaf.children[i], leaf, newLevel, treeDepth, map);
                    }
                }
            }
        }
    }

})();