/**
 * Created by xiaojiu on 2017/3/22.
 */
'use strict';
define(['../../../app'], function (app) {
    app.factory('cdcOrderOutboundLook', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {

        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'supplier',name:'供应商'},
                    {field:'brand',name:'商品品牌'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'goodsStyle',name:'规格型号'},
                    {field:'huoweiNo',name:'货位'},
                    {field:'serialNumber',name:'出厂编码'},
                    {field:'sku',name:'商品编码'},
                    {field:'goodsUnit',name:'计量单位'},
                    {field:'orderPrice',name:'单价'},
                    {field:'totalOrderPrice',name:'总金额'},
                    {field:'needCount',name:'商品数量'},
                    {field:'outGoodCount',name:'出库数量'},
                    // {field:'inDiffCount',name:'差异数量'}
                ]
            },
            getDataTable: function (data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+'/outGoodsOrder/showOutGoodsOrderDetailList',data)
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