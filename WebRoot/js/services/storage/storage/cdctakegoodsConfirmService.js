/**
 * Created by xuwusheng on 15/12/10.
 */
'use strict';
define(['../../../app'], function (app) {
    app.factory('cdctakegoodsConfirm', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {

        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'supplier',name:'供应商'},
                    {field:'sku',name:'商品编码'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'goodsStyle',name:'规格型号'},
                    {field:'huoweiNo',name:'货位'},
                    {field:'brand',name:'商品品牌'},
                    {field:'serialNumber',name:'出厂编码'},
                    {field:'goodsUnit',name:'计量单位'},
                    {field:'goodsCount',name:'应收数量'},
                    {field:'inCount',name:'实收数量'},
                   // {field:'inDiffCount',name:'差异数量'}
                ]
            },
            getDataTable: function (data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+'/inGoodsOrder/showInGoodsOrderDetailList',data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            }
        }
    }]);
});