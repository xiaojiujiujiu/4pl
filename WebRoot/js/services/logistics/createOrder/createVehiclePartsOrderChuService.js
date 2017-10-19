/**
 * Created by xiaojiu on 2017/7/21.
 */
'use strict';
define(['../../../app'], function (app) {
    app.factory('createVehiclePartsOrderChu', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {

        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'supplier',name:'供应商'},
                    {field:'goodsCode',name:'商品编码'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'goodsStyle',name:'规格型号'},
                    {field:'goodsKind',name:'商品品类'},
                    {field:'goodsBrand',name:'商品品牌'},
                    {field:'factoryCode',name:'出厂编码'},
                    {field:'measurementUnit',name:'计量单位'},
                    {field:'quantity',name:'数量'}
             //       {field:'pay',name:'运费',input:'true',style:'width:80px;',call:'payWatch'}
                    ]
            },
            getDataTable: function (data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+'/vehicleParts/affirmVehiclePartsOrder',data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            confirmInCk: function(data,url) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + url, data)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            }
        }
    }]);
});