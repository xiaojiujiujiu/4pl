/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app'], function (app) {
    app.factory('WlTaskDicLists', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'orderId',name:'客户单号'},
                    {field:'thirdWlId',name:'第三方快递单号'},
                    {field:'taskType',name:'业务类型'},
                    {field:'receTel',name:'联系电话'},
                    {field:'name',name:'客户'},
                    {field:'receAdd',name:'配送地址'},
                    // {field:'boxCount',name:'箱数'},
                    //{field:'wlStatu',name:'订单状态'},
                    {field:'updateTime',name:'业务时间'},
                    {field:'wlTaskTypeId',name:'配送方式'},
                    {field:'userName',name:'配送员'},
                    {field:'licenseNumber',name:'配送车辆'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        style:'width:50px;',
                        buttons: [{
                            text: '日志',
                            call: 'getOpenModelData',
                            btnType: 'button',
                            style: 'font-size:10px;',
                            openModal: '#workLogModal'
                        }]
                    }]
            },
            getDetailThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'orderID',name:'客户单号'},
                    {field:'receAdd',name:'地址'},
                    {field:'boxCount',name:'箱数'},
                    {field:'remarks',name:'备注'}
                ]
            },
            getLogThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'handleDetail',name:'操作描述'},
                    {field:'handleMan',name:'操作人'},
                    {field:'handelTime',name:'操作时间'}
                ]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/workMonitor/getWlTaskDicLists',{})
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
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