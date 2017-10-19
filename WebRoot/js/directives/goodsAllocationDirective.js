/**
 * Created by xuwusheng on 15/12/4.
 */
'use strict';
define(['../app'], function (app) {
    app.directive('pl4Goodsallocation', function () {
        return {
            restrict:'EA',
            replace:true,
            transclude:true,
            templateUrl:'views/goodsAllocationDc.html?r='+Math.random(),
            link: function (scope,el) {
                $(el).find('.container-table').css({'maxHeight':($(window).height()-100)+'px','overflowY':'scroll'});
                scope.selectChange= function (call) {
                    if(typeof scope.goodsAlloSelectSet[call]==='function')
                        scope.goodsAlloSelectSet[call]();
                }
                scope.enterAlloDc= function (id) {
                    if(typeof scope['enterAllo']==='function'){
                        scope.enterAllo(function () {
                            $(id).modal('hide')
                        });
                    }
                }
            }
        }
    });
});