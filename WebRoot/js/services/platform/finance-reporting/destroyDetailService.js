/**
 * Created by xuwusheng on 15/12/12.
 */
define(['../../../app'], function (app) {
    app.factory('platformDestroyDetail', ['$http','$q','HOST',function ($http,$q,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'客户'},
                    {field:'fhtime',name:'仓库'},
                    {field:'chuHuoName',name:'日期'},
                    {field:'clientName',name:'损毁单号'},
                    {field:'orderTypeName',name:'供应商全称'},
                    {field:'inGoodsStateName',name:'赔偿主体名称'},
                    {field:'origGoodCount',name:'商品品类'},
                    {field:'origGoodCount',name:'商品品牌'},
                    {field:'origGoodCount',name:'商品编码'},
                    {field:'origGoodCount',name:'商品名称'},
                    {field:'origGoodCount',name:'规格型号'},
                    {field:'origGoodCount',name:'出厂编码'},
                    {field:'origGoodCount',name:'计量单位'},
                    {field:'origGoodCount',name:'损毁数量'}
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