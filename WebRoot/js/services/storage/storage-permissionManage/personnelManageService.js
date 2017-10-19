/**
 * Created by xuwusheng on 15/12/12.
 */
define(['../../../app'], function (app) {
    app.factory('personnelManage', ['$http','$filter','$q','HOST',function ($http,$filter,$q,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'driverName',name:'姓名'},
                    {field:'account',name:'账号'},
                    {field:'sex',name:'性别'},
                    {field:'age',name:'年龄'},
                    {field:'mobilephone',name:'手机'},
                    {field:'partyName',name:'所属运营'},
                    {field:'ssWareHouse',name:'所属仓库'},
                    {field:'positionName',name:'岗位'},
                    {field:'userCaetgory',name:'人员类别'},
                    {field:'education',name:'学历'},
                    {field:'contractType',name:'合同类型'},
                    {field:'contractParty',name:'合同主体'},
                    {field:'contract',name:'合同期限'},
                    {field:'contractStartTime',name:'合同起始日'},
                    {field:'contractEndTime',name:'合同结束日'},
                    {field:'remark',name:'备注'},
                    {field:'op',name:'操作',type:'operate',buttons:[{text:'修改',btnType:'btn',call:'editCus',openModal:'#addCustomer'},{text:'|'},{text:'冻结',btnType:'btn',call:'perFreeze'},{text:'|'},{text:'恢复',btnType:'btn',call:'perResume'}]}]
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