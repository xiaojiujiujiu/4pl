/**
 * Created by xuwusheng on 15/12/12.
 */
define(['../../../app'], function (app) {
    app.factory('platformPersonnelManage', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'account',name:'账号'},
                    {field:'jobNum',name:'工号'},
                    {field:'positionName',name:'岗位'},
                    {field:'driverName',name:'姓名'},
                    {field:'mobilephone',name:'手机号'},
                    {field:'op',name:'操作',type:'operate',
                        buttons:[{text:'修改',btnType:'btn',call:'editCus',openModal:'#addCustomer'},
                            {text:'冻结',btnType:'btn',call:'perFreeze'},
                            {text:'恢复',btnType:'btn',call:'perResume'}
                        ]}]
            },
            getDataTable: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+(!url?'/user/queryUser':url),data)
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