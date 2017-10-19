/**
 * Created by xiaojiu on 2017/5/27.
 */
define(['../../../app'], function (app) {
    app.factory('unmannedGoodsAdministration', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'#',type:'pl4GridCount'},
                    {field:'supplier',name:'供应商'},
                    {field:'brand',name:'商品品牌'},
                    {field:'product',name:'商品品类'},
                    {field:'name',name:'商品名称'},
                    {field:'goodsStyle',name:'规格型号'},
                    {field:'serialNumber',name:'出厂编码'},
                    {field:'goodsCode',name:'商品编码'},
                    {field:'goodsUnit',name:'计量单位'}
                ]
            },
            getSearch: function () {

                var deferred=$q.defer();
                //绑定查询接口
                $http.post(HOST+'/fsGoods/getFsGoodsQuery',{})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            autoCompletion: function(data){
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+'/huoWeiManager/autoGetCkCode',data)
                    .success(function (data) {
                        deferred.resolve(data.query.autoList);
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