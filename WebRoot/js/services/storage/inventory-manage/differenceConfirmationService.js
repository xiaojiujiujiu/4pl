/**
 * 
 * @authors Hui Sun 
 * @date    2016-1-30 16:17:32
 * @version $Id$
 */
'use strict';
define(['../../../app'], function(app) {
    app.factory('differenceConfirmation', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
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
                    field: 'custTaskId',
                    name: '客户单号'
                }, {
                    field: 'taskType',
                    name: '业务类型'
                }, {
                    field: 'ckName',
                    name: '发货仓库'
                }, {
                    field: 'receCkName',
                    name: '收货仓库'
                },{
                    field: 'updateTime',
                    name: '订单日期'
                }, {
                    field: 'count',
                    name: '差异数量'
                }, {
                    field: 'countMoney',
                    name: '差异金额'
                },{
                    field: 'status',
                    name: '差异确认状态'
                },{
                    field: 'name11',
                    name: '操作',
                    type: 'operate',
			        buttons: [{
			            text: '差异确认',
			            btnType: 'link',
			            state: 'differenceConfirm'
			        },{text:'|'},{
			            text: '查看',
			            btnType: 'link',
			            state: 'differenceConfirmationLook'
			        }]
                }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/differentMonitor/getConfDicLists',{})
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            getDataTable: function(data) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + '/differentMonitor/query_differentConf', data)
                    .success(function(data) {
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