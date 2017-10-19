/**
 * Created by xuwusheng on 15/12/12.
 */
'use strict';
define(['../../../app'], function(app) {
    app.factory('carriagePayRegister', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function() {
                return [{
                    field: 'pl4GridCount',
                    name: '序号',
                    type: 'pl4GridCount'
                }, {
                    field: 'recordId',
                    name: '登记单号'
                }, {
                    field: 'taskId',
                    name: '业务单号'
                }, {
                    field: 'custTaskId',
                    name: '客户单号'
                }, {
                    field: 'distributype',
                    name: '配送方式'
                }, {
                    field: 'distributName',
                    name: '配送员'
                }, {
                    field: 'phone',
                    name: '联系方式'
                }, {
                    field: 'recordDate',
                    name: '登记日期'
                }, 
//                {
//                    field: 'recordMan',
//                    name: '登记人'
//                }, 
                {
                    field: 'payState',
                    name: '支付状态'
                }, {
                    field: 'payMoney',
                    name: '应支付金额'
                }, {
                    field: 'payMan',
                    name: '结账人'
                }, {
                    field: 'name11',
                    name: '操作',
                    type: 'operate',
                    buttons: [{
                        text: '修改',
                        btnType: 'link',
                        state: 'newPayRegister'
                    },{
                        text: '打印',
                        btnType: 'button',
                        call: 'printCallback'
                    }]
                }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/compensateMonitor/getDicList',{})
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            getDataTable: function(data) {
                //将param转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST+ '/compensateMonitor/query_detailList', data)
                    .success(function(data) {
                        // console.log(data)
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