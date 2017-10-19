/**
 * Created by xiaojiu on 2017/5/26.
 */
define(['../../../app'], function (app) {
    app.factory('locationInformation', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'#',type:'input',check:'true'},
                    {field:'containerNumber',name:'柜号'},
                    {field:'cargoLocation',name:'货位编号'},
                    {field:'length',name:'长'},
                    {field:'width',name:'宽'},
                    {field:'height',name:'高'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'model',name:'规格型号'},
                    {field:'factoryCode',name:'出厂编码'},
                    {field:'brandName',name:'商品品牌'},
                    {field:'goodsTypeName',name:'商品品类'},
                    {field:'sku',name:'商品编码'},
                ]
            },
            getSearch: function () {

                var deferred=$q.defer();
                //绑定查询接口
                $http.post(HOST+'/huoWeiManager/getDicLists',{})
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