/**
 * Created by xuwusheng on 15/11/16.
 */
'use strict';
define(['../app','../services/takeGoodsTaskService'],function (app) {
     var app = angular.module('app');     app.controller('TakeGoodsCtrl',['$scope','TakeGoods', function ($scope,TakeGoods) {
        //table头
        var tbHeader=['序号','业务单号','发货日期','发货方','客户方','业务类型','单据状态','商品种类','数量数量','差异','操作'];
        var promise=TakeGoods.getTable({});
        promise.then(function (data) {
            $scope.result=data;
        }, function (error) {
            alert(error);
        });
    }])
});