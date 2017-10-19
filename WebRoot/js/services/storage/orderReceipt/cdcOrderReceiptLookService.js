/**
 * Created by xiaojiu on 2017/3/27.
 */
'use strict';
define(['../../../app'], function (app) {
    app.factory('cdcOrderReceiptLook', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {

        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'supplier',name:'供应商'},
                    {field:'brand',name:'商品品牌'},
                    {field:'name',name:'商品名称'},
                    {field:'goodsStyle',name:'规格型号'},
                    {field:'serialNumber',name:'出厂编码'},
                    {field:'goodsCode',name:'商品编码'},
                    {field:'goodsUnit',name:'计量单位'},
                    {field:'acceGoodCount',name:'商品数量'},
                    {field:'outCount',name:'出库数量'},
                    {field:'refuseCount',name:'拒收数量'}
                ]
            },
            getDataTable: function (data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+'/cdcReceiptOrder/checkReceiptOrder',data)
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