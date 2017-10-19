/**
 * Created by xuwusheng on 15/12/12.
 */
'use strict';
define(['../../../app'], function(app) {
    app.factory('orderSearch', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function() {
                return [{
                    field: 'pl4GridCount',
                    name: '序号',
                    type: 'pl4GridCount'
                }, {
                    field: 'chuHuoCkName',
                    name: '出货仓库'
                }, {
                    field: 'receiverCkName',
                    name: '收货仓库'
                }, {
                    field: 'taskId',
                    name: '业务单号'
                }, {
                    field: 'custTaskId',
                    name: '客户单号'
                },{
                    field: 'customerName',
                    name: '客户'
                }, {
                    field: 'thirdWild',
                    name: '第三方快递单号'
                }, {
                    field: 'orderTypeName',
                    name: '业务类型'
                }, {
                    field: 'receTel',
                    name: '收货方电话'
                }, {
                	field: 'chuHTel',
                    name: '发货方电话'
                },{
                    field: 'receAdd',
                    name: '地址'
                }, {
                    field: 'startTime',
                    name: '发货日期'
                }, {
                    field: 'wlTaskType',
                    name: '配送方式'
                }, {
                    field: 'bossMan',
                    name: '配送员'
                }, {
                    field: 'carNo',
                    name: '配送车辆'
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
                    field: 'taskId',
                    name: '业务单号'
                }, {
                    field: 'handleDetail',
                    name: '操作描述'
                }, {
                    field: 'handleMan',
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
                $http.post(HOST + '/orderMonitor/getDicLists',{})
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