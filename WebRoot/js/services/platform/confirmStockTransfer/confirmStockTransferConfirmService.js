/**
 * Created by xiaojiu on 2017/3/28.
 */
define(['../../../app'], function (app) {
    app.factory('confirmStockTransferConfirm', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'product',name:'品类'},
                    {field:'brand',name:'品牌'},
                    {field:'supplier',name:'供应商'},
                    {field:'serialNumber',name:'出厂编码'},
                    {field:'name',name:'商品名称'},
                    {field:'goodsStyle',name:'规格型号'},
                    {field:'goodsCode',name:'商品编码'},
                    {field:'goodsUnit',name:'计量单位'},
                    {field:'availableStock',name:'可用库存'},
                    {field:'damageStock',name:'残损品库存'},
                    {field:'transferType',name:'转移类型'},
                    {field:'transferCount',name:'转移数量'}
                ]
            },
            getDataTable: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+(!url?'/stockTransfer/confirmStockTransfer':url),data)
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