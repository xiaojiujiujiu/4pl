/**
 * Created by xiaojiu on 2017/3/16.
 */

'use strict';
define(['../../../app'], function (app) {
    app.factory('orderAssignConfirm', ['$http', '$q', '$filter', 'EHOST', function ($http, $q, $filter, EHOST) {
        return {
            getThead: function () {
                return [{field: 'pl4GridCount',
                    name: '序号',
                    type: 'pl4GridCount'}, {
                    field: 'taskId',
                    name: '业务单号'
                }, {
                    field: 'acceGoodCount',
                    name: '应出件数'
                }, {
                    field: 'realcount',
                    name: '实出件数'
                },  {
                    field: 'receHName',
                    name: '收件方'
                }, {
                    field: 'receHTel',
                    name: '收件方电话'
                },  {
                    field: 'address',
                    name: '收件方地址'
                },  {
                    field: 'payType',
                    name: '结算方式'
                },  {
                    field: 'paySide',
                    name: '运费付费方'
                },  {
                    field: 'pay',
                    name: '运费'
                },  {
                    field: 'receiptsCarriage',
                    name: '实收运费'
                },  {
                    field: 'collectMoney',
                    name: '代收货款'
                },  {
                    field: 'collectionCarriage',
                    name: '实收代收货款'
                },{field:'origTypeCount',name:'操作',type:'operate',
                    buttons:[
                        {text:'删除',call:'deleteCall'}
                    ]
                }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(EHOST + '/personalOrder/getComUserDicList',{})
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            getDataTable: function (data, url) {
                //将param转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(EHOST + (!url ? '/personalOrder/queryAssignOrderByTaskId' : url), data)
                    .success(function (data) {
                        // console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            deliverOrderConfrim: function (url,data) {
                //将param转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(EHOST + (!url ? '/personalOrder/OrderconfirmAssign' : url), data)
                    .success(function (data) {
                        // console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            }

        }

    }]);
});