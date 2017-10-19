/**
 * Created by xuwusheng on 15/11/30.
 */
define(['../app'], function (app) {
    app.directive('pl4Query', ['$sce', function ($sce) {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            //scope:{
            //    querySeting:'=',
            //    searchModel:'='
            //},
            templateUrl: 'views/query.html',
            link: function (scope) {
                var isClick = false;
                scope.selectChange = function (change) {
                    if (scope[change] instanceof Function) {
                        scope[change]();
                    }
                }
                scope.btnClick = function (item) {
                    if (scope[item.click] instanceof Function) {
                        isClick = true;
                        if(checkDate())
                            scope[item.click]();
                    }
                }
                scope.submit = function (btns) {
                    if (isClick) {
                        isClick = false;
                        return false;
                    }
                    angular.forEach(btns, function (item) {
                        if ($sce.getTrustedHtml(item.text).indexOf('查询') > -1) {
                            if (scope[item.click] instanceof Function) {
                                if(checkDate())
                                    scope[item.click]();
                            }
                            return false;
                        }
                    });
                }
                var checkDate = function () {
                    var $dates = $('.query-date').find('input[type="text"]'),
                        date1=$dates.eq(0).val(),
                        date2=$dates.length==2?$dates.eq(1).val():null;
                    if(date1&&date2&&date1!==''&&date2!==''){
                        date1=new Date(date1).getTime();
                        date2=new Date(date2).getTime();
                        if(date1>date2){
                            alert('后者日期不能小于前者');
                            return false;
                        }
                        /*else if(date1==date2){
                            alert('前后日期不能相同');
                            return false;
                        }*/
                    }
                    return true;
                }

                scope.isShowMove = false;
                scope.dataList = scope.querySeting.items;
                if (scope.querySeting.items.length > 3) {
                    scope.isShowMove = true;
                    scope.btnSearch7=true;
                    scope.dataList = scope.dataList.slice(0, 3);
                }else if(scope.querySeting.items.length ==3){
                   scope.btnSearch7=true;
                }else if(scope.querySeting.items.length ==1){
                    scope.btnSearch3=true;
                }
                else {
                    scope.dataList = scope.querySeting.items;
                    scope.btnSearch5=true;
                }
                scope.loadMove = function () {
                    var moveBtn = document.getElementById('move');
                    var moveText = moveBtn.innerText;
                    if (moveText=='展开更多') {
                        moveBtn.innerText = '收起更多';
                        scope.dataList = scope.querySeting.items;

                    } else {
                        moveBtn.innerText = '展开更多';
                        scope.dataList = scope.querySeting.items.slice(0, 3);
                    }

                }


            }
        }
    }]);
});