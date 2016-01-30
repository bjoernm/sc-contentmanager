/**
 * Created by albert on 30.01.16.
 */
(function() {
    angular
        .module('scFeed')
        .filter('toDate', function() {
        return function (dateString) {
            var date = '';
            if(dateString != null){
                var dateObject = new Date(dateString);
                var day = dateObject.getDate();
                var month = dateObject.getMonth() + 1;
                if(day < 10){
                    day = '0' + day;
                }
                if(month < 10){
                    month = '0' + month;
                }
                date = day + '.' + month + '.' + dateObject.getFullYear();
            }
            return date;
        };
    });
})();
