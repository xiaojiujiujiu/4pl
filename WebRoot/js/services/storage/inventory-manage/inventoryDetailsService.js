/**
 * Created by xiaojiu on 2016/11/7.
 */
define(['../../../app'], function (app) {
    app.factory('inventoryDetails', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'suppliersName',name:'供应商'},
                    {field:'customerName',name:'客户'},
                    {field:'sku',name:'商品编码'},
                    {field:'goodsBrandName',name:'商品品牌'},
                    {field:'goodsTypeName',name:'商品品类'},
                    {field:'huoWeiNo',name:'商品货位'},
                    {field:'modelName',name:'规格型号'},
                    {field:'factoryCode',name:'出厂编码'},
                    {field:'unitName',name:'计量单位'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'stockCount',name:'库存数量'},
                    {field:'inventoryCount',name:'实盘数量'},
                    {field:'differentCount',name:'差异数量'},
                    {field:'diffStatus',name:'差异状态'},
                    {field:'remarks',name:'备注'},
                ]
            },
            getDataTable: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+(!url?'/ckInventory/inventoryOrderDetailView':url),data)
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
