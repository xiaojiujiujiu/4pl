/**
 * author wusheng.xu
 * date 16/6/21
 */
define(['../../../app'], function (app) {
    app.factory('deliverFee', ['$http', '$q', '$filter', '$sce', 'HOST', function ($http, $q, $filter, $sce, HOST) {
        return {
            getThead1: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field: 'depProvince', name: '出发地'},
                    {field: 'desProvince', name: '目的地'},
                    {field: 'firstHeavy', name: '首重'},
                    {field: 'firstHeavyPrice', name: '首重价格'},
                    {field: 'continuedHeavyPrice', name: '续重价格（公斤/元）'},
                    {field:'op',name:'操作',type:'operate',buttons:[{text:'修改',btnType:'btn',call:'updateDeliverFee', openModal:'#addDeliverFeeModal'}]}
                ]
            },
            getThead2: function () {
                return [
                  {name:'序号',type:'pl4GridCount'},
                  {field: 'depProvince', name: '出发地省'},
                  {field: 'depCity', name: '出发地市'},
                  {field: 'desProvince', name: '目的地省'},
                  {field: 'desCity', name: '目的地市'},
                  {field: 'heavyPrice', name: '重货（元/公斤）'},
                  {field: 'lightPrice', name: '轻货（元/立方米）'},
                  {field:'op',name:'操作',type:'operate',buttons:[{text:'修改',btnType:'btn',call:'updateJzDeliverFee', openModal:'#addJzDeliverFeeModal'}]}
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