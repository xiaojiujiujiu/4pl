/**
 * Created by xuwusheng on 15/12/12.
 */
'use strict';
define(['../../../app'], function(app) {
    app.factory('goodsDifferenceManage', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
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
                    name: '仓库名称'
                }, {
                    field: 'receMan',
                    name: '收货人'
                }, {
                    field: 'updateTime',
                    name: '收货日期'
                }, {
                    field: 'count',
                    name: '差异数量'
                }, {
                    field: 'countMoney',
                    name: '差异金额'
                },{
                    field: 'receStatus',
                    name: '差异确认状态'
                },{
                    field: 'name11',
                    name: '操作',
                    type: 'operate',
			        buttons: [{
			            text: '确认差异',
			            btnType: 'link',
			            state: 'collectDifferenceConfirm'
			        },{text:'|'},{
			            text: '查看',
			            btnType: 'link',
			            state: 'goodsDifferenceLook'
			        }]
                }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/differentMonitor/getDicLists',{})
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
                $http.post(HOST + '/differentMonitor/query_different', data)
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