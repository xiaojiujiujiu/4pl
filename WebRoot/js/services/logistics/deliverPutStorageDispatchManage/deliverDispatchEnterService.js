/**
 * author wusheng.xu
 * date 16/4/19
 */

define(['../../../app'], function (app) {
    app.factory('deliverDispatchEnter', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThHeader: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field: 'taskId', name: '业务单号'},
                    {field: 'orderId', name: '客户单号'},
                    {field: 'orderTypeId', name: '业务类型'},
                    {field: 'receAdd', name: '配送地址'},
                    {field: 'takeTypeCount', name: '商品单数'},
                    {field: 'takeGoodCount', name: '商品数量'},
                    {field: 'remarks', name: '备注'}
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