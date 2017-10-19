/**
 * Created by xuwusheng on 15/12/12.
 */
define(['../../../app'], function (app) {
    app.factory('stockFlow', ['$http','$q','HOST',function ($http,$q,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'仓库'},
                    {field:'fhtime',name:'入库日期'},
                    {field:'chuHuoName',name:'商品编码'},
                    {field:'clientName',name:'入库名称'},
                    {field:'orderTypeName',name:'规格型号'},
                    {field:'inGoodsStateName',name:'出厂编码'},
                    {field:'origTypeCount',name:'期初数量'},
                    {field:'origGoodCount',name:'期初金额(元)'},
                    {field:'origGoodCount',name:'出库类型'},
                    {field:'origGoodCount',name:'出库数量'},
                    {field:'origGoodCount',name:'出库金额(元)'},
                    {field:'origGoodCount',name:'入库类型'},
                    {field:'origGoodCount',name:'入库数量'},
                    {field:'origGoodCount',name:'入库金额(元)'},
                    {field:'origGoodCount',name:'期未数量'},
                    {field:'origGoodCount',name:'期未金额'}]
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