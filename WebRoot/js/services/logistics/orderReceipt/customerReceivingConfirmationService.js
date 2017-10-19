/**
 * Created by xiaojiu on 2017/8/11.
 */
'use strict';
define(['../../../app'], function (app) {
    app.factory('customerReceivingConfirmation', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {

        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'createTime',name:'创建时间'},
                    {field:'chuHuoName',name:'发件方'},
                    {field:'chuHTel',name:'发件方电话'},
                    {field:'receiverName',name:'收件方'},
                    {field:'receTel',name:'收件方电话'},
                    {field:'receAdd',name:'收件方地址'},
                    {field:'collectMoney',name:'代收货款'},
                    {field:'pay',name:'订单运费'},
                    {field:'remarks',name:'备注'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        buttons: [{
                            text: '客户收货',
                            call: 'pay',
                            btnType: 'button',
                            style: 'font-size:10px;'
                        }]
                    }
                ]
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
                $http.post(HOST+'/vehicleParts/queryConfirmReceiptList',data)
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