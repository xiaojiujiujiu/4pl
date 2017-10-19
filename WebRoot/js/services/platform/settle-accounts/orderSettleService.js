/**
 * Created by xuwusheng on 15/12/21.
 */
define(['../../../app'], function (app) {
    app.factory('orderSettle', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'customerID',name:'客户'},
                    {field:'taskId',name:'业务单号'},
                    {field:'orderID',name:'客户单号'},
                    {field:'orderTypeId',name:'业务类型'},
                    // {field:'payWay',name:'结算分类'},
                    {field:'chuCkName',name:'发货仓库'},
                    {field:'receCkName',name:'收货仓库'},
                    {field:'receiptTime',name:'操作日期'},
                    // {field:'wlStatu',name:'订单状态'},
                    {field:'chuhGoodCount',name:'商品数量'},
                    {field:'orderFee',name:'订单金额'},
                ]
            },
            getSearch: function () {

                var deferred=$q.defer();
                $http.post(HOST+'/shipBanlance/getOrderDicLists',{})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
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