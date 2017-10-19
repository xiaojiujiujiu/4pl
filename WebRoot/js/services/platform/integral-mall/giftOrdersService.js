/**
 * Created by xuwusheng on 15/12/21.
 */
define(['../../../app'], function (app) {
    app.factory('giftOrders', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'createTime',name:'创建日期'},
                    {field:'taskId',name:'业务单号'},
                    {field:'exchangeTime',name:'兑换日期'},
                    {field:'exchangeNo',name:'礼品兑换单号'},
                    {field:'sku',name:'礼品编码'},
                    {field:'goodsName',name:'礼品名称'},
                    {field:'points',name:'所需积分'},
                    {field:'count',name:'兑换数量'},
                    {field:'exchangeName',name:'兑换人'},
                    {field:'garageName',name:'汽修厂名称'},
                    {field:'garageNo',name:'汽修厂编码'},
                    {field:'ckName',name:'隶属仓库'},
                    {field:'address',name:'送货地址'},
                    {field:'remark',name:'备注'},
                ]
            },
            getSearch: function () {

                var deferred=$q.defer();
                $http.post(HOST+'/giftOrder/getGiftOrderDicLists',{})
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
                       // console.log(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            }
        }
    }]);
});