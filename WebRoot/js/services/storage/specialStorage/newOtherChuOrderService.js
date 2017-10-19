/**
 * Created by xiaojiu on 2016/11/29.
 */
define(['../../../app'], function (app) {
    app.factory('newOtherChuOrder', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'',type:'input',checkAll:true,check:true},
                    //{field:'suppliersName',name:'供应商'},
                    //{field:'cuName',name:'客户'},
                    {field:'sku',name:'商品编码'},
                    {field:'brand',name:'商品品牌'},
                    {field:'modelName',name:'规格型号'},
                    {field:'factoryCode',name:'出厂编码'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'unitName',name:'计量单位'},
                   // {field:'stock',name:'库存数量'},
                    {field:'count',name:'申请数量',input:true,style:'width:50px;'},
                    {field:'jqpjPrice',name:'单价'},
                    {field:'countMoney',name:'小计'},
                    {field:'op',name:'操作',type:'operate',buttons:[{text:'删除',btnType:'btn',call:'deleteCustom'}]}
                ]
            },
            getThead1: function () {
                return [
                    {name:'',type:'input',checkAll:true,check:true},
                    {field:'suppliersName',name:'供应商'},
                    {field:'cuName',name:'客户'},
                    //{field:'sku',name:'商品编码'},
                    {field:'goodsTypeName',name:'商品品类'},
                    {field:'brand',name:'商品品牌'},
                    {field:'modelName',name:'规格型号'},
                    {field:'factoryCode',name:'出厂编码'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'stock',name:'库存数量'}
                ]
            },
            getSearch: function () {

                var deferred=$q.defer();
                //绑定查询接口
                $http.post(HOST+'/ckOtherChuRuOrder/createOtherChuOrderView',{})
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