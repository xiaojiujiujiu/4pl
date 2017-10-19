/**
 * Created by xuwusheng on 15/12/12.
 */
define(['../../../app'], function (app) {
    app.factory('stationManage', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
//                    {field:'code',name:'岗位编号'},
                    {field:'postName',name:'岗位名称'},
                    {field:'postRemarks',name:'岗位介绍'},
                    {field:'inDiffCount',name:'操作',type:'operate',
                        buttons:[
                            {text:'修改',btnType:'btn',call:'updateStation',openModal:'#addStation'},{text:'|'},
                            {text:'删除',call:'storageDeleteCall'},
                            {text:'冻结',call:'staFreeze'},
                            {text:'恢复',call:'staResume'}
                        ]
                    }]
            },
            getDataTable: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+url,data)
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