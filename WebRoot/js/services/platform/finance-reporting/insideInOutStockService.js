/**
 * Created by xuwusheng on 15/12/12.
 */
define(['../../../app'], function (app) {
    app.factory('platformInsideInOutStock', ['$http','$q','HOST',function ($http,$q,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'入库日期'},
                    {field:'fhtime',name:'仓库'},
                    {field:'chuHuoName',name:'供应商全称'},
                    {field:'clientName',name:'供应商编码'},
                    {field:'orderTypeName',name:'内部入库单号'},
                    {field:'inGoodsStateName',name:'业务模式'},
                    {field:'origTypeCount',name:'类型'},
                    {field:'origGoodCount',name:'品类'},
                    {field:'origGoodCount',name:'品牌'},
                    {field:'origGoodCount',name:'商品编码'},
                    {field:'origGoodCount',name:'商品名称'},
                    {field:'origGoodCount',name:'规格型号'},
                    {field:'origGoodCount',name:'出厂编码'},
                    {field:'origGoodCount',name:'计量单位'},
                    {field:'origGoodCount',name:'数量'},
                    {field:'origGoodCount',name:'库存成本（元)'},
                    {field:'origGoodCount',name:'库存金额（元)'},
                    {field:'origGoodCount',name:'结算价'},
                    {field:'origGoodCount',name:'结算金额'},
                    {field:'origGoodCount',name:'应付账单编号'},
                ]
            },
            getDataTable: function (data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.get(HOST+'/pl4/rest/pl4/ckTaskIn/ckTaskInList',{params:data})
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