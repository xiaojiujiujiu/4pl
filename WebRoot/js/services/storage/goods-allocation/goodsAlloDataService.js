/**
 * Created by xuwusheng on 15/12/11.
 */
define(['../../../app'], function (app) {
    app.factory('goodsAlloData', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'',check:true,checkAll:true},
                    {field:'areaName',name:'货区'},
                    {field:'subAreaId',name:'分区'},
                    {field:'rowNo',name:'行'},
                    {field:'columnNo',name:'列'},
                    {field:'layer',name:'层'},
                    {field:'huoWei',name:'位'},
                    {field:'huoWeiNo',name:'货位编号(大区-分区-行-列-货架层-位)'},
                    {field:'statusName',name:'状态'},
                    {field:'inDiffCount',name:'操作',type:'operate',buttons:[{text:'冻结',call:'freezeCall'},{text:'|'},{text:'恢复',call:'resumeCall'},{text:'|'},{text:'删除',call:'deleteCall'}]}]
            },
            getQuery: function (url) {
                var deferred=$q.defer();
                $http.post(HOST+(!url?'/ckHuoWei/getDicLists':url),{})
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
                $http.post(HOST+(!url?'/ckHuoWei/getCkHuoWeiList':url),data)
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