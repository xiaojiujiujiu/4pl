/**
 * Created by xuwusheng on 15/12/10.
 */
'use strict';
define(['../../../app'], function (app) {
    app.factory('takegoodsConfirm', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {

        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'supliersName',name:'供应商'},
                    {field:'goodsCode',name:'条码'},
                    {field:'sku',name:'商品编码'},
                    {field:'brand',name:'商品品牌'},
                    {field:'modelName',name:'规格型号'},
                    {field:'factoryCode',name:'出厂编码'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'unitName',name:'计量单位'},
                    {field:'count',name:'应收数量'},
                    {field:'inCount',name:'良品数量'},
                    {field:'inDiffCount',name:'差异数量'}]
            },
            getDataTable: function (data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+'/ckTaskIn/ckTaskInDetailView',data)
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