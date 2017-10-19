/**
 * Created by xuwusheng on 15/12/12.
 */
define(['../../../app'], function (app) {
    app.factory('platformJxcReport', ['$http','$q','HOST',function ($http,$q,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'区域'},
                    {field:'fhtime',name:'仓库'},
                    {field:'chuHuoName',name:'系统供应商编码'},
                    {field:'clientName',name:'系统供应商'},
                    {field:'orderTypeName',name:'业务模式'},
                    {field:'inGoodsStateName',name:'商品品类'},
                    {field:'origTypeCount',name:'商品品牌'},
                    {field:'origGoodCount',name:'商品编码'},
                    {field:'origGoodCount',name:'商品名称'},
                    {field:'origGoodCount',name:'规格型号'},
                    {field:'origGoodCount',name:'出厂编码'},
                    {field:'origGoodCount',name:'计量单位'},
                    {field:'origGoodCount',name:'期初数量'},
                    {field:'origGoodCount',name:'补货数量'},
                    {field:'origGoodCount',name:'补货金额'},
                    {field:'origGoodCount',name:'销售数量'},
                    {field:'origGoodCount',name:'销售金额'},
                    {field:'origGoodCount',name:'调拨数量'},
                    {field:'origGoodCount',name:'调拨金额'},
                    {field:'origGoodCount',name:'损益数量'},
                    {field:'origGoodCount',name:'损益金额'},
                    {field:'origGoodCount',name:'自用数量'},
                    {field:'origGoodCount',name:'自用金额'},
                    {field:'origGoodCount',name:'赠品数量'},
                    {field:'origGoodCount',name:'赠品金额'},
                    {field:'origGoodCount',name:'报废数量'},
                    {field:'origGoodCount',name:'报废金额'},
                    {field:'origGoodCount',name:'领用数量'},
                    {field:'origGoodCount',name:'领用金额'},
                    {field:'origGoodCount',name:'其他数量'},
                    {field:'origGoodCount',name:'其他金额'},
                    {field:'origGoodCount',name:'销售差异退仓数量'},
                    {field:'origGoodCount',name:'销售差异退仓金额'},
                    {field:'origGoodCount',name:'成本调整金额'},
                    {field:'origGoodCount',name:'期未数量'},
                    {field:'origGoodCount',name:'期未金额'},
                    {field:'origGoodCount',name:'数量差'},
                    {field:'origGoodCount',name:'金额差'}]
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