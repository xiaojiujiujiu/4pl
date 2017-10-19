/**
 * Created by xiaojiu on 2017/5/27.
 */
'use strict';
define(['../../../app'], function(app) {
    app.factory('fsBhView', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function() {
                return [{
                    field: 'taskId',
                    name: '业务单号'
                }, {
                    field: 'orderId',
                    name: '客户单号'
                }, {
                    field: 'receiverName',
                    name: '收货方'
                }, {
                    field: 'orderDate',
                    name: '订单日期'
                }, {
                    field: 'inGoodsDate',
                    name: '补货日期'
                }, {
                    field: 'goodsCount',
                    name: '商品数量'
                }, {
                    field: 'op',
                    name: '操作',
                    type: 'operate',style:'width:50px;',
                    buttons: [{
                        text: '查看',
                        call: 'getOpenModelData',
                        btnType: 'button',
                        style: 'font-size:10px;',
                        openModal: '#orderLogModal'
                    }]
                }]
            },
            getOpenModelThHeader: function() {
                return [{
                    field: 'NAME',
                    name: '商品名称'
                }, {
                    field: 'goodsStyle',
                    name: '规格型号'
                }, {
                    field: 'huoweiNo',
                    name: '货位'
                }, {
                    field: 'serialNumber',
                    name: '出厂编码'
                }, {
                    field: 'goodsCode',
                    name: '商品编码'
                }, {
                    field: 'product',
                    name: '商品品类'
                }, {
                    field: 'brand',
                    name: '商品品牌'
                }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/fsMonitor/getBhDicLists',{})
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            getDataTable: function( url, data) {
                //将param转换成json字符串
                data.param = $filter('json')(data.param);
                //console.log(data)
                var deferred = $q.defer();
                $http.post(url, data)
                    .success(function(data) {
                        //console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            }
        }

    }]);
});