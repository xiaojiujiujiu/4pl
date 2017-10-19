/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app'], function (app) {
    app.factory('addCustomer', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'customerId',name:'客户编号'},
                    {field:'createTime',name:'创建时间'},
                    {field:'customerName',name:'客户名称'},
                    {field:'bossMan',name:'负责人'},
                    {field:'bossTel',name:'联系电话'},
                    {field:'csAddress',name:'客户地址'},
                    {field:'op',name:'操作',type:'operate',buttons:[
                        {text:'修改',btnType:'btn',call:'updateCustom', openModal:'#addCustomerModal'},
                        {text:'删除',btnType:'btn',call:'deleteCustom'},
                        {text:'账号管理',btnType:'link',state:'customerAccount'}]}
                    
                ]
            },
            getSearch: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/customer/getDicLists',{})
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