/**
 * Created by xuwusheng on 16/1/27.
 */
define(['../app'], function (app) {
    app.directive('topMenu', [function () {
        return {
            restrict:'EA',
            replace:true,
            transclude:true,
            template:'<div ng-transclude></div>',
            link: function ($scope,el,attr) {
                $('.ui-view-container').height($(window).height()-$('.top-right').height());
                $(el).on('click', function () {
                    $(this).addClass('hover').siblings().removeClass('hover');
                });
            }
        }
    }]);
});