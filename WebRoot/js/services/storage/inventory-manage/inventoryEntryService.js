/**
 * Created by xiaojiu on 2016/11/8.
 */
define(['../../../app'], function (app) {
    app.factory('inventoryEntry', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'#',type:'pl4GridCount'},
                    {field:'suppliersName',name:'供应商'},
                    {field:'customerName',name:'客户'},
                    {field:'sku',name:'商品编码'},
                    {field:'goodsTypeName',name:'商品品类'},
                    {field:'goodsBrandName',name:'商品品牌'},
                    {field:'modelName',name:'规格型号'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'goodsLocation',name:'商品货位'},
                    {field:'unitName',name:'计量单位'},
                    {field:'stockCount',name:'库存数量'},
                    {field:'inventoryCount',name:'实盘数量',input:true,call:'ajaxInput',style:'width:60px;',type:"text",maxlength:'5'},
                    {field:'remarks',name:'备注',input:true,call:'ajaxInput2',maxlength:'20',style:'width:60px;',},
                ]
            }
            ,
            getDataTable: function (url,data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);

                var deferred=$q.defer();
                //$http.post(HOST+(!url?'/ckInventory/inventoryOrderInput':url),data)
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
