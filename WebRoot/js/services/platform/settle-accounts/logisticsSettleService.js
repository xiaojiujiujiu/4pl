/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app'], function (app) {
    app.factory('logisticsSettle', ['$http','$q','$filter','HOST',function ($http,$q, $filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'carOutTime',name:'回执时间'},
                    {field:'owerCKName',name:'负责仓储'},
                    {field:'wlComp',name:'配送中心'},
                    {field:'wlTaskTypeId',name:'配送方式'},
                    {field:'opUser',name:'配送员'},
                    {field:'taskId',name:'业务单号'},
                    {field:'orderID',name:'客户单号'},
                    // {field:'payWay',name:'结算分类'},
                    // {field:'billState',name:'订单状态'},
                    {field:'orderTypeId',name:'业务类型'},
                    {field:'orderPrice',name:'订单金额'},
                    {field:'pay',name:'配送费'},
                    {field:'clearType',name:'结算方式'},
                ]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/payMent/getWlDicLists',{})
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            getDataTable: function (url,data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(url, data)
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
});/**
 * Created by xuwusheng on 15/12/18.
 */
