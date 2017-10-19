/**
 * Created by xiaojiu on 2016/11/22.
 */
define(['../../../app'], function (app) {
    app.factory('distributionUser2', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'userName',name:'收件方名称'},
                    {field:'createTime',name:'创建时间'},
                    {field:'tel',name:'手机号码'},
                    {field:'provinceName',name:'省'},
                    {field:'cityName',name:'市'},
                    {field:'countName',name:'区（县）'},
                    {field:'address',name:'详细地址'}
                    ]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/distributionUser/getDicLists',{})
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            autoCompletion: function(data){
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+'/deliveryPartyPay/getConsignerLists',data)
                    .success(function (data) {
                        deferred.resolve(data.query.userList);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getDataTable: function( url, data) {
                //将param转换成json字符串
                data.param = $filter('json')(data.param);
                //console.log(data)
                var deferred = $q.defer();
                $http.post(HOST + url, data)
                    .success(function(data) {
                        //console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            }
        }
    }]);
});