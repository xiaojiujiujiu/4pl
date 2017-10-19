/**
 * Created by xiaojiu on 2016/11/7.
 */
define(['../../../app'], function (app) {
    app.factory('addInventory', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'#',type:'pl4GridCount'},
                    {field:'supplier',name:'供应商'},
                    {field:'customerName',name:'客户'},
                    {field:'goodsCode',name:'商品编码'},
                    {field:'product',name:'商品品类'},
                    {field:'brand',name:'商品品牌'},
                    {field:'NAME',name:'商品名称'},
                    {field:'goodsStyle',name:'规格型号'},
                    {field:'serialNumber',name:'出厂编码'},
                    {field:'goodsUnit',name:'计量单位'},
                    {field:'areaName',name:'货区'},
                    {field:'huoWeiNo',name:'商品货位'},
                    ]
            },getQuery: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/ckInventory/getCreateInventoryDic',{})
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
                //$http.post(HOST+(!url?'/ckInventory/queryInventoryGoodsList':url),data)
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
