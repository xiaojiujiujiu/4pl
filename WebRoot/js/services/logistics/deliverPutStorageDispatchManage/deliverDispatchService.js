
/**
 * author wusheng.xu
 * date 16/4/19
 */
define(['../../../app'], function (app) {
    app.factory('deliverDispatch', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThHeader: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'receAdd',name:'配送地址'},
                    {field:'boxCount',name:'应发箱数'},
                    {field:'scanBoxCount',name:'已扫描箱数'},
                    {field:'remarks',name:'备注'},
                    {field:'origTypeCount',name:'操作',type:'operate',
                        buttons:[
                            {text:'删除',call:'deleteCall'}
                        ]
                    },
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