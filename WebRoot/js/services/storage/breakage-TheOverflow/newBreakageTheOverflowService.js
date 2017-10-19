/**
 * Created by xiaojiu on 2016/11/8.
 */
define(['../../../app'], function (app) {
    app.factory('newBreakageTheOverflow', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'',type:'input',checkAll:true,check:true},
                    {field:'suppliersName',name:'供应商'},
                    {field:'customerName',name:'客户'},
                    {field:'sku',name:'商品编码'},
                    {field:'goodsBrandName',name:'商品品牌'},
                    {field:'modelName',name:'规格型号'},
                    {field:'factoryCode',name:'出厂编码'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'unitName',name:'计量单位'},
                    {field:'stockCount',name:'库存数量'},
                    {field:'inventoryCount',name:'实盘数量'},
                    {field:'differentStatus',name:'损溢类型',type:'rd',rds:[{name:'name11',text:'报损',value:'1',btnType:'r',style:'width:70px'},{name:'name11',text:'报溢',value:'2',btnType:'r'}]},
                    {field:'differentCount',name:'损溢数量',input:true,style:'width:80px'},
                    {field:'remarks',name:'备注',input:true},
                    {field:'op',name:'操作',type:'operate',buttons:[{text:'删除',btnType:'btn',call:'deleteCustom'}]}
                ]
            },
            getThead1: function () {
                return [
                    {name:'',type:'input',checkAll:true,check:true},
                    {field:'suppliersName',name:'供应商'},
                    {field:'customerName',name:'客户'},
                    {field:'sku',name:'商品编码'},
                    {field:'goodsBrandName',name:'商品品牌'},
                    {field:'modelName',name:'规格型号'},
                    {field:'factoryCode',name:'出厂编码'},
                    {field:'goodsName',name:'商品名称'}
                ]
            },
            getSearch: function () {

                var deferred=$q.defer();
                //绑定查询接口
                $http.post(HOST+'/lossAndOverflowReport/queryGoodsList',{})
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