/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app'], function (app) {
    app.factory('taskHall', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead1: function () {
                return [
					{name:'选择',check:true,checkAll:true},
					{field:'taskId',name:'业务单号'},
					//{field:'addressId',name:'地址ID'},
					{field:'createTime',name:'生成时间'},
					{field:'provinceName',name:'省/自治区'},
					{field:'cityName',name:'市'},
					{field:'countyName',name:'区/县'},
					{field:'address',name:'地址'},
					{field:'isBindingName',name:'状态'}                    
                ]
            },getThead2: function () {
                return [
                    {name:'选择',check:true,checkAll:true},
                    //{field:'addressId',name:'地址ID'},
                    {field:'createTime',name:'生成时间'},
                    {field:'provinceName',name:'省/自治区'},
                    {field:'cityName',name:'市'},
                    {field:'countyName',name:'区/县'},
                    {field:'address',name:'地址'},
                    {field:'isBindingName',name:'状态'},
                    {field:'ckId',name:'绑定仓库'},
                    {field:'name11',name:'操作',type:'operate',buttons:[{text:'解绑',btnType:'btn',call:'unBindOnce'}]}

                ]
            },
            getSearch: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/TaskHall/getDicLists',{})
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