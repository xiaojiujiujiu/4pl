/**
 * Created by xiaojiu on 2017/3/28.
 */
'use strict';
define(['../../../app'], function (app) {
    app.factory('platformExpenseAudit', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'ckName',name:'仓库名称'},
                    {field:'feeCost',name:'费用用途'},
                    {field:'money',name:'金额'},
                    {field:'receiptId',name:'发票号'},
                    {field:'description',name:'费用说明'},
                    {field:'examinestatu',name:'审核状态'},
                    {field:'name11',name:'操作',type:'operate',
                        buttons:[
                            {text:'通过',btnType:'btn',openModal:'#examination',call:"adopt"},
                            {text:'驳回',btnType:'btn',openModal:'#reject',call:"adopt"}
                        ]
                    }]
            },
            getThead2: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'ckName',name:'仓库名称'},
                    {field:'taskId',name:'业务单号'},
                    {field:'deliveryName',name:'配送名称'},
                    {field:'waybill',name:'订单号'},
                    {field:'transportFee',name:'运费'},
                    {field:'description',name:'费用说明'},
                    {field:'examinestatu',name:'审核状态'},
                    {field:'name11',name:'操作',type:'operate',
                        buttons:[
                            {text:'通过',btnType:'btn',openModal:'#examination',call:"adopt"},
                            {text:'驳回',btnType:'btn',openModal:'#reject',call:"adopt"}
                        ]
                    }]
            },
            getSearch: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/operatingexpense/getPfDicLists',{})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getDataTable: function (url,data) {
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