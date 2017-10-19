/**
 * author wusheng.xu
 * date 16/6/21
 */
define(['../../../app'], function (app) {
    app.factory('VMIDistribution', ['$http', '$q', '$filter', '$sce', 'HOST', function ($http, $q, $filter, $sce, HOST) {
        return {
            getThead1: function () {
                return [
                    {name: '选择',check:true,checkAll:true},
                    {field: 'taskId', name: 'VMI取货单号'},
                    {field: 'createTime', name: '订单生成日期'},
                    {field: 'chuHuoShengName', name: '省/自治区'},
                    {field: 'chuHuoShiName', name: '市'},
                    {field: 'chuHAdd', name: '取货地址'},
                    {field: 'remarks', name: '备注'}
                ]
            },
            getThead2: function () {
                return [
                    {name: '序号', type: 'pl4GridCount'},
                    {field: 'taskId', name: 'VMI取货单号'},
                    {field: 'createTime', name: '订单生成日期'},
                    {field: 'wlDeptName', name: '承接配送中心'},
                    {field: 'chuHuoShengName', name: '省/自治区'},
                    {field: 'chuHuoShiName', name: '市'},
                    {field: 'chuHAdd', name: '取货地址'},
                    {field: 'remarks', name: '备注'}
                ]
            },
            getDataTable: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+url,data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            }
        }
    }])
})