/**
 * Created by xuwusheng on 15/11/20.
 */
'use strict';
define(['../app'], function (app) {
    app.directive('pl4Datepicker', ['$filter',function ($filter) {

        return {
            restrict:'EA',
            require:'?ngModel',
            scope: {
                format: '@',
                select: '&',
                vdate: '@'
            },
            template:'123',
            link: function (scope, el,attr,ngModel) {
                if(!ngModel) {
                    $(el).val('请绑定model');
                    return;
                }
                var toDo = function () {
                	$(el).datepicker({
                        autoClose:true,
                        format: scope.format,
                        startDate: '-3d',
                        defaultDate:scope.vdate
                    }).on('changeDate', function(e) {
                        scope.$apply(function () {
                            ngModel.$setViewValue($filter('date')(e.date, scope.format.replace('mm','MM'),'Beijing'));
                        });
                    });
                };
                if(scope.vdate==''){//由于指令是在渲染html之前执行，这里延迟800毫秒，但并不能彻底解决问题，以后再优化
                	setTimeout(toDo,800)
                }else{
                	toDo();
                }
                
            }
        }
    }]);
});