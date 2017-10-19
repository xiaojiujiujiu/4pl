/**
 * author wusheng.xu
 * date 16/7/11
 */
'use strict';
define(['../../../app'], function (app) {
    app.factory('FillPrintOrder', ['$http', '$q', '$filter', 'HOST', function ($http, $q, $filter, HOST) {
        return {
            getThead: function () {
                return [
                    {check:true,checkAll:true,name:'选择'},
                    {field:'taskId',name:'业务单号'},
                    {field:'receTel',name:'联系电话'},
                    {field:'receAdd',name:'配送地址'},
                    {field:'packBoxCount',name:'应发箱数'},
                    {field:'remarks',name:'备注'},
                ]
            },
            getDataTable: function (data, url) {
                //将param转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + (!url ? '/orderDelivery/queryOrderDelivery' : url), data)
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
    }])
})