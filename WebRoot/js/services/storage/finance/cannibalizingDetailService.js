/**
 * Created by xuwusheng on 15/12/12.
 */
define(['../../../app'], function (app) {
    app.factory('cannibalizingDetail', ['$http','$q','HOST',function ($http,$q,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'调出库名称'},
                    {field:'fhtime',name:'调出库区域'},
                    {field:'chuHuoName',name:'调出库地域'},
                    {field:'clientName',name:'调入库名称'},
                    {field:'orderTypeName',name:'调入库区域'},
                    {field:'inGoodsStateName',name:'调入库地域'},
                    {field:'origGoodCount',name:'品类'},
                    {field:'origGoodCount',name:'品牌'},
                    {field:'origGoodCount',name:'商品编码'},
                    {field:'origGoodCount',name:'商品名称'},
                    {field:'origGoodCount',name:'规格型号'},
                    {field:'origGoodCount',name:'出厂编码'},
                    {field:'origGoodCount',name:'单位'},
                    {field:'origGoodCount',name:'调拨入库实际入库数量'},
                    {field:'origGoodCount',name:'调拨出库拣货确认数量'},
                    {field:'origGoodCount',name:'调拨在途数量'},
                    {field:'origGoodCount',name:'调拨回退数量'},
                    {field:'origGoodCount',name:'出库单价'},
                    {field:'origGoodCount',name:'出库金额'},
                    {field:'origGoodCount',name:'库存流水单号'},
                    {field:'origGoodCount',name:'出入库时间'},
                    {field:'origGoodCount',name:'调拨单号'},
                    {field:'origGoodCount',name:'调拨状态'},
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