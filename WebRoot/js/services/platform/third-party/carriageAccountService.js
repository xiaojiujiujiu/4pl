/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app'], function (app) {
    app.factory('carriageAccount', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'wlDeptName',name:'负责配送中心'},
                    {field:'carrierId',name:'配送服务商编号'},
                    {field:'carrierName',name:'配送服务商名称'},
                    {field:'address',name:'配送服务商所在地'},
                    {field:'carrierRange',name:'配送范围'},
                    {field:'carrierMan',name:'联系人'},
                    {field:'mobilephone',name:'联系电话'}
                    
                ]
            },
            getDataTable: function (data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+'/wlComp/queryWlCompList',data)
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