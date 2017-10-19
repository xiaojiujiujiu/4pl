/**
 * Created by xiaojiu on 2017/4/14.
 */
define(['../app'], function (app) {
    app.directive('autofocus', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $element) {
                $timeout(function () {
                        $element[0].focus();
                });
            }
        }
    }]);
});