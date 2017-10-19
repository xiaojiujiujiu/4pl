/**
 * Created by xuwusheng on 15/12/11.
 */
define(['../../../app'], function (app) {
    app.factory('defaultGoodsAllo', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'customerName',name:'客户'},
                    {field:'supliers',name:'供应商'},
                    {field:'sku',name:'商品编码'},
                    {field:'goodsTypeName',name:'商品品类'},
                    {field:'brandName',name:'商品品牌'},
                    {field:'modelName',name:'商品规格'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'factoryCode',name:'出厂编码'},
                    {field:'unitName',name:'计量单位'},
                    {field:'huoWeiNo',name:'当前货位'},
                    {field:'areaId',name:'货区'},
                    {name:'操作',type:'operate',buttons:[{
                        text: '设置货位',
                        call:'goodsAlloCall',
                        openModal:'#goodsAlloModal'
                    }]}]
            },getQuery: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/ckGoodsDefLocation/getDicLists',{})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;

            },
            getDataTable: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+(!url?'/ckGoodsDefLocation/defLocationList':url),data)
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