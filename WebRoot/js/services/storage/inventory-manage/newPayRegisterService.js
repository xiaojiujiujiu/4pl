/**
 * Created by xuwusheng on 15/12/12.
 */
'use strict';
define(['../../../app'], function(app) {
    app.factory('newPayRegister', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function() {
                return [{check:true,checkAll:true}, {
                    field: 'supliers',
                    name: '供应商'
                }, {
                    field: 'sku',
                    name: '商品编码'
                },{
                    field: 'brand',
                    name: '商品品牌'
                }, {
                    field: 'model',
                    name: '规格型号'
                }, {
                    field: 'factoryCode',
                    name: '出厂编码'
                }, {
                    field: 'goodsName',
                    name: '商品名称'
                }, {
                    field: 'meaUnit',
                    name: '计量单位'
                }, {
                    field: 'acceGoodCount',
                    name: '实发数量'
                }, {
                    field: 'breakCount',
                    style: 'width: 40px;text-align: center;',
                    input: true,
                    pl4DataType:'number',
                    name: '损失/丢失数量'
                }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.get(HOST + '/compensateMonitor/add_shipperDetail')
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            getDataTable: function(url, data) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + url, data)
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