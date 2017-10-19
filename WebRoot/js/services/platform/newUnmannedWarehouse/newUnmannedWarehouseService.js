/**
 * Created by xiaojiu on 2017/5/26.
 */
define(['../../../app'], function (app) {
    app.factory('newUnmannedWarehouse', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'ckCode',name:'仓库编号'},
                    {field:'qxcName',name:'仓库名称'},
                    {field:'ckAddress',name:'仓库地址'},
                    {field:'fdcName',name:'关联FDC'},
                    {field:'bindQxc',name:'绑定汽修厂'},
                    {field:'ckBossMan',name:'负责人'},
                    {field:'ckBossPhone',name:'负责人电话'},
                    {field:'benchCount',name:'柜子数'},
                    {field:'op',name:'操作',type:'operate',buttons:[{text:'编辑',btnType:'btn',call:'updateGift',openModal:'#createGift'},{text:'冻结',btnType:'btn',call:'frozen'},{text:'恢复',btnType:'btn',call:'perResume'}]}
                ]
            },
            getSearch: function () {

                var deferred=$q.defer();
                //绑定查询接口
                $http.post(HOST+'/fsInfo/getFsInfoQuery',{})
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