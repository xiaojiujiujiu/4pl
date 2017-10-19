/**
 * Created by xiaojiu on 2017/4/21.
 */
define(['../../../app'], function (app) {
    app.factory('billUpdateAudit', ['$http','$q','EHOST','$filter',function ($http,$q,EHOST,$filter) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'receiverName',name:'收货点'},
                    {field:'cdcWlDeptName',name:'配送点'},
                    {field:'createWlDeptName',name:'发起点'},
                    {field:'chuHuoName',name:'发起人'},
                    {field:'pay',name:'修改前运费'},
                    {field:'changePay',name:'修改后运费'},
                    {field:'collectMoney',name:'修改前代收货款'}, 
                    {field:'changeCollectMoney',name:'修改后代收货款'},
                    {field:'fee',name:'修改前代收款手续费'},
                    {field:'changeFee',name:'修改后代收款手续费'},
                    {field:'auditStatus',name:'审核状态'},
                    {field:'remarks',name:'修改备注'},
                    {field:'rejectRemarks',name:'驳回备注'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        buttons: [{
                            text: '通过',
                            call: 'getTaskid',
                            btnType: 'button',
                            style: 'font-size:10px;',
                            openModal: '#adopt'
                        },{
                            text: '驳回',
                            call: 'getTaskid',
                            btnType: 'button',
                            style: 'font-size:10px;',
                            openModal: '#reject'
                        }
                        ]
                    }
                ]
            },

            getQuery: function(){
                //将parm转换成json字符串
                var deferred=$q.defer();
                $http.post(EHOST+'/personalOrder/ydAuditDicList',{})
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
                $http.post(EHOST+url, data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
        }
    }]);
});