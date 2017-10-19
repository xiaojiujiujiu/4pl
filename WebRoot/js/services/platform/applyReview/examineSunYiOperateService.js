/**
 * Created by xiaojiu on 2016/11/18.
 */
define(['../../../app'], function (app) {
    app.factory('examineSunYiOperate', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function() {
                return [ {
                    field: 'pl4GridCount',
                    name: '#',
                    type: 'pl4GridCount'
                }, {
                    field: 'supliersName',
                    name: '供应商'
                },  {
                    field: 'customerName',
                    name: '客户'
                }, {
                    field: 'sku',
                    name: '商品编码'
                }, {
                    field: 'brandName',
                    name: '商品品牌'
                }, {
                    field: 'modelName',
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
                    field: 'reportType',
                    name: '损溢类型'
                }, {
                    field: 'reportCount',
                    name: '损溢数量'
                }, {
                    field: 'remarks',
                    name: '备注'
                }
                ]
            },
            //getSearch: function (data) {
            //
            //    data.param=$filter('json')(data.param);
            //    var deferred=$q.defer();
            //    $http.post(HOST+'/examine/getCkLossAndOverFlowOrderDetailList',data)
            //        .success(function (data) {
            //            deferred.resolve(data);
            //        })
            //        .error(function (e) {
            //            deferred.reject('error:'+e);
            //        });
            //    return deferred.promise;
            //},
            getDataTable: function (url,data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+url, data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            }
        }
    }]);
});