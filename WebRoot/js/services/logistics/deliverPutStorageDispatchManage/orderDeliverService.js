/**
 * Created by xiaojiu on 2017/8/10.
 */
'use strict';
define(['../../../app'], function (app) {
    app.factory('orderDeliver', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {

        return {
            getThead: function () {
                return [
                    {name:'',check:true,checkAll:true},
                    {field:'taskId',name:'业务单号'},
                    {field:'waybillId',name:'运单号'},
                    {field:'acceGoodCount',name:'件数'},
                    {field:'chuHuoName',name:'发件方'},
                    {field:'chuHTel',name:'发件方电话'},
                    {field:'chuHAdd',name:'发件方地址'},
                    {field:'receiverName',name:'收件方'},
                    {field:'receTel',name:'收件方电话'},
                    {field:'receAdd',name:'收件方地址'}]
            },
            getSearch: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/vehicleParts/getCommonDicList',{})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getDataTable: function (data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+'/vehicleParts/queryOrderDeliveryList',data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            confirmInCk: function(data,url) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + url, data)
                    .success(function(data) {
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