/**
 * Created by xiaojiu on 2017/3/21.
 */
'use strict';
define(['../../../app'], function (app) {
    app.factory('cdcOrderReceipt', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'orderId',name:'客户单号'},
                    {field:'deliveryTypeName',name:'配送方式'},
                    {field:'outGoodsDate',name:'出库日期'},
                    {field:'receiverName',name:'收货方'},
                    {field:'acceGoodCount',name:'订单商品数量'},
                    {field:'outCount',name:'出库数量'},
                    {field:'name11',name:'操作',type:'operate',style:'width:108px;',buttons:[{text:'回执',openModal:'#orderReceipt',call:'receipt'}]}]
            },
            getThead2: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'orderId',name:'客户单号'},
                    {field:'deliveryTypeName',name:'配送方式'},
                    {field:'outGoodsDate',name:'出库日期'},
                    {field:'receiptDate',name:'回执日期'},
                    {field:'receiverName',name:'收货方'},
                    {field:'acceGoodCount',name:'订单商品数量'},
                    {field:'outCount',name:'出库数量'},
                    {field:'refuseCount',name:'拒收数量'},
                    {field:'name11',name:'操作',type:'operate',style:'width:108px;',buttons:[{ text: '查看',
                        btnType: 'link',
                        state:'cdcOrderReceiptLook',
                        style: 'font-size:10px;'}]}]
            },
            getSearch: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/cdcReceiptOrder/getDicLists',{})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getDataTable: function (url,data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+url,data)
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