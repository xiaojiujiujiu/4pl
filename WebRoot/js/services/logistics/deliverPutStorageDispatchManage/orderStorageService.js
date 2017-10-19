/**
 * Created by xiaojiu on 2017/3/13.
 */
'use strict';
define(['../../../app'], function(app) {
    app.factory('orderStorage', ['$http', '$q', '$filter', 'EHOST', function($http, $q, $filter, EHOST) {
        return {
            getThead: function() {
                return [ { field: 'pl4GridCount',
                    name: '序号',
                    type: 'pl4GridCount'}, {
                    field: 'taskId',
                    name: '业务单号'
                }, {
                    field: 'acceGoodCount',
                    name: '应收件数'
                }, {
                    field: 'realcount',
                    name: '实收件数'
                }, {
                    field: 'chuHName',
                    name: '发件方'
                }, {
                    field: 'chuHTel',
                    name: '发件方电话'
                }, {
                    field: 'distributionType',
                    name: '配送类型'
                },{field:'origTypeCount',name:'操作',type:'operate',
                    buttons:[
                        {text:'删除',call:'deleteCall'}
                    ]
                }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(EHOST + '/personalOrder/getConfirmInDicList',{})
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
                $http.post(EHOST + '/personalOrder/queryConfirmInByTaskId', data)
                    .success(function(data) {
                        // console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            deliverOrderConfrim: function(url,data) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(EHOST + url, data)
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