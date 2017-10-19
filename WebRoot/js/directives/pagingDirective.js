/**
 * Created by xuwusheng on 15/11/18.
 */
'use strict';
define(['../app'], function (app) {
    app.directive('pl4Paging', ['$parse',function ($parse) {
        var dt={};

        dt.setPaging= function (scope) {
            //计算分页页数
            scope.pLens=Math.ceil(scope.paging.totalPage/scope.paging.showRows);
            if(scope.pLens<=0){
                scope.pLens=1;
            }
            if(isNaN(scope.pLens)){
                scope.pLens=1;
            }
            scope.setingPaging=[];
            var fLens=scope.pLens,start=1;
            if(scope.pLens>scope.pagingNum){
                fLens=scope.pagingNum;
                //当前页大于等于处设置的结束位置
                if(scope.paging.currentPage>=fLens){
                    //总页数与结束位置差值小于设置的显示分页按钮个数
                    if(scope.pLens-fLens<scope.pagingNum) {
                        fLens = scope.pLens;
                    }else{
                        fLens =scope.paging.currentPage+2;
                        if(fLens>scope.pLens)
                            fLens=scope.pLens;
                    }
                }
                if(fLens-scope.pagingNum>=0)
                    start=fLens - scope.pagingNum+1;
                //设置左侧省略
                if(scope.paging.currentPage>=scope.pagingNum){
                    scope.setingPaging.push({num:1});
                    scope.setingPaging.push({num:'...'});
                }
            }
            for(var i=start;i<=fLens;i++){
                scope.setingPaging.push({num:i,selected:i==scope.paging.currentPage?true:false});
                if(i==fLens&&scope.pLens>scope.pagingNum&&fLens!=scope.pLens){
                    if(scope.pLens-fLens>0)
                        scope.setingPaging.push({num:'...'});
                    scope.setingPaging.push({num:scope.pLens});
                }

            }
        }
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                selectOpt:'=selectOption',
                pagingNum:'=pagingNum',
                paging: '=paging',
                toPage: '&toPage'
            },
            templateUrl: 'views/paging.html',
            link: function (scope, el, attr) {
                //设置下拉框选中
                angular.forEach(scope.selectOpt, function (opt) {
                    if(opt.selected) {
                        scope.selected = opt.value;
                        return;
                    }
                })
                scope.selectChange = function () {
                    scope.paging.showRows=scope.selected;
                    scope.paging.currentPage=1;
                    dt.setPaging(scope);
                    if(typeof scope.toPage ==='function')
                        scope.toPage();
                }
                scope.pagingClick= function (num) {
                    if(Number(num)){
                        scope.paging.currentPage=num;
                        dt.setPaging(scope);
                    }else if(isNaN(num)){
                        if(num=='...') return;
                        switch (num){
                            case "first":
                                if(scope.paging.currentPage==1) return false;
                                scope.paging.currentPage=1;
                                break;
                            case "prev":
                                if(scope.paging.currentPage==1) return false;
                                scope.paging.currentPage=scope.paging.currentPage-1>0?scope.paging.currentPage-1:1;
                                break;
                            case "next":
                                if(scope.paging.currentPage==scope.pLens) return false;
                                scope.paging.currentPage=scope.paging.currentPage+1<scope.pLens?scope.paging.currentPage+1:scope.pLens;
                                break;
                            case "last":
                                if(scope.paging.currentPage==scope.pLens) return false;
                                scope.paging.currentPage=scope.pLens;
                                break;
                            case "goTo":
                                scope.goToInput=parseInt(scope.goToInput);
                                if(scope.goToInput>0&&scope.goToInput<=scope.pLens)
                                    scope.paging.currentPage=scope.goToInput;
                                else
                                    return;
                                break;
                        }
                        dt.setPaging(scope);
                    }
                    if(typeof scope.toPage ==='function')
                        scope.toPage();
                }
                var oldPagingTotalPage=0;//记录上次paging数据
                scope.goToInput=1;
                //监听
                scope.$watch('paging', function (newRe,oldRe) {
                    if(newRe!==oldRe) {
                        //设置分页 当totalPage发生改变时
                        if (scope.paging.totalPage != oldPagingTotalPage) {
                            dt.setPaging(scope);
                        }
                        oldPagingTotalPage = scope.paging.totalPage;
                    }
                })
                dt.setPaging(scope);
            }
        }
    }]);
});