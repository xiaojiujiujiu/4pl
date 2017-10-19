/**
 * Created by xuwusheng on 15/12/12.
 */
'use strict';
define(['../../../app'], function(app) {
    app.factory('newRegister', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function() {
                return [{check:true,checkAll:true,name:'选择'}, {
                    field: 'dateUpdated',
                    name: '商品编码'
                }, {
                    field: 'client',
                    name: '商品品牌'
                }, {
                    field: 'commodityCode',
                    name: '规格型号'
                }, {
                    field: 'category',
                    name: '出厂编码'
                }, {
                    field: 'commodityName',
                    name: '商品名称'
                }, {
                    field: 'model',
                    name: '计量单位'
                }, {
                    field: 'factoryCode',
                    name: '实发数量'
                }, {
                    field: 'goodsArea',
                    name: '损失/丢失数量'
                }]
            },
           /* getSearch: function() {
                var deferred = $q.defer();
                $http.get(HOST + '')
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },*/
            getDataTable: function(data) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + '/compensateMonitor/query_compenDetail', data)
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