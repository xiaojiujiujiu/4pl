/**
 * author wusheng.xu
 * date 16/6/21
 */
define(['../../../app'], function (app) {
    app.factory('fbDistribution', ['$http', '$q', '$filter', '$sce', 'HOST', function ($http, $q, $filter, $sce, HOST) {
        return {
            getThead1: function () {
                return [
                    {name: '选择',check:true,checkAll:true},
                    {field: 'taskId', name: '业务单号'},
                    {field: 'orderId', name: '客户单号'},
                    {field: 'orderTypeId', name: '业务类型'},
                    {field: 'receAdd', name: '配送地址'},
                    {field: 'takeTypeCount', name: '商品单数'},
                    {field: 'takeGoodCount', name: '商品数量'},
                    {field: 'remarks', name: '备注'}
                ]
            },
            getThead2: function () {
                return [
                    {name: '序号', type: 'pl4GridCount'},
                    {field: 'taskId', name: '分拨单号'},
                    {field: 'createTime', name: '分拨时间'},
                    {field: 'createUser', name: '分拨人'},
                    {field: 'receAdd', name: '分拨地址'},
                    {field: 'takeTypeCount', name: '商品单数'},
                    {field: 'takeGoodCount', name: '商品数量'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        buttons:  [{
                            text: '查看',
                            call: 'getOpenModelData',
                            btnType: 'button',
                            style: 'font-size:10px;'
                        }]
                      }
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