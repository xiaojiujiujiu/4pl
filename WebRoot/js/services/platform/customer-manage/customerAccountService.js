/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app'], function (app) {
    app.factory('customerAccount', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                        {name:'序号',type:'pl4GridCount'},
                        {field:'userName',name:'账号负责人'},
                        {field:'tel',name:'负责人电话'},
                        {field:'userPosition',name:'公司职务'},
                        {field:'account',name:'平台账号'},
                        {field:'op',name:'操作',type:'operate',
                        	buttons:[{text:'修改',btnType:'btn',call:'updateCustom', openModal:'#addCustomerModal'},
                        	         {
                                text:'重置密码',
                                btnType:'btn',
                                call:'resetPassword'
                            },{
                                text:'冻结',
                                btnType:'btn',
                                call: 'frozen'
                            },{
                                text:'恢复',
                                btnType:'btn',
                                call: 'recovery'
                            }]}
                ]
            },
            getSearch: function () {
//                var deferred=$q.defer();
//                $http.post(HOST+'/customer/getDicLists',{})
//                    .success(function (data) {
//                        deferred.resolve(data);
//                    })
//                    .error(function (e) {
//                        deferred.reject('error:'+e);
//                    });
//                return deferred.promise;
            },
            getDataTable: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+(!url?'/comUser/queryCustomerAccountList':url),data)
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