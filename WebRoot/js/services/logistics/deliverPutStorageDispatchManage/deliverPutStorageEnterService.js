/**
 * author wusheng.xu
 * date 16/4/20
 */
define(['../../../app'], function (app) {
    app.factory('deliverPutStorageEnter', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThHeader: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'orderID',name:'客户单号'},
                    {field:'receAdd',name:'配送地址'},
                    {field:'boxCount',name:'箱数'},
                    {field:'remarks',name:'备注'},
                ]
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