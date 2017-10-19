/**
 * Created by xuwusheng on 15/12/12.
 */
'use strict';
define(['../../../app'], function(app) {
    app.factory('cdcorderSearch', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function() {
                return [{
                    field: 'pl4GridCount',
                    name: '序号',
                    type: 'pl4GridCount'
                }, {
                    field: 'taskId',
                    name: '业务单号'
                }, {
                    field: 'orderId',
                    name: '客户单号'
                }, {
                    field: 'thirdWlId',
                    name: '第三方单号'
                }, {
                    field: 'orderTypeName',
                    name: '业务类型'
                }, {
                    field: 'receiverName',
                    name: '收货方'
                }, {
                	field: 'chuHuoName',
                    name: '发货方'
                }, {
                    field: 'createTime',
                    name: '订单日期'
                }, {
                    field: 'deliveryTypeName',
                    name: '配送方式'
                }, {
                    field: 'op',
                    name: '操作',
                    type: 'operate',style:'width:50px;',
                    buttons: [{
                        text: '日志',
                        call: 'getOpenModelData',
                        btnType: 'button',
                        style: 'font-size:10px;',
                        openModal: '#orderLogModal'
                    }]
                }]
            },
            getOpenModelThHeader: function() {
                return [{
                    field: 'pl4GridCount',
                    name: '序号',
                    type: 'pl4GridCount'
                }, {
                    field: 'handleDetail',
                    name: '操作描述'
                }, {
                    field: 'handleName',
                    name: '操作人'
                }, {
                    field: 'orderState',
                    name: '订单状态'
                }, {
                    field: 'handelTime',
                    name: '操作时间'
                }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/cdcOrderMonitor/getDicLists',{})
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