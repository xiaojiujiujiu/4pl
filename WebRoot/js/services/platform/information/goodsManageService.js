/**
 * Created by xiaojiu on 2017/2/5.
 */
define(['../../../app'], function (app) {
    app.factory('goodsManage', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount',style:'padding:8px 19px 0 19px;'},
                    {field:'customerName',name:'客户'},
                    {field:'supplier',name:'供应商'},
                    {field:'goodsCode',name:'商品编码'},
                    {field:'product',name:'商品品类'},
                    {field:'brand',name:'商品品牌'},
                    {field:'goodsStyle',name:'规格型号'},
                    {field:'name',name:'商品名称'},
                    {field:'serialNumber',name:'出厂编码'},
                    {field:'goodsUnit',name:'计量单位'},
                    {field:'length',name:'长(m)'},
                    {field:'width',name:'宽(m)'},
                    {field:'high',name:'高(m)'},
                    {field:'volume',name:'体积（m³）'},
                    {field:'kg',name:'重量（Kg）'},
                    {field:'maxQuantity',name:'存储数量'},
                    {field:'barCodeTypeName',name:'条码类型'},
                    {field:'batchStatus',name:'批次属性'},
                    {field:'op',name:'操作',type:'operate',buttons:[{text:'编辑',btnType:'btn',call:'updateGift',openModal:'#createGift'}]}
                ]
            },
            getSearch: function () {

                var deferred=$q.defer();
                //绑定查询接口
                $http.post(HOST+'/goods/getCustomerList',{})
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