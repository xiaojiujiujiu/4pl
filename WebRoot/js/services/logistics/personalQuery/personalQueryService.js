/**
 * Created by xiaojiu on 2017/5/3.
 */
define(['../../../app'], function (app) {
    app.factory('personalQuery', ['$http','$q','$filter','EHOST',function ($http,$q,$filter,EHOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'createTime',name:'订单时间'},
                    {field:'createWlDeptName',name:'收货点'},
                    {field:'rdcWlDeptName',name:'分拨中心'},
                    {field:'cdcWlDeptName',name:'配送点'},
                    {field:'wlStatu',name:'订单状态'},
                    {field:'chuHuoName',name:'发件方'},
                    {field:'chuHTel',name:'发件方电话'},
                    {field:'chuHAdd',name:'发件方地址'},
                    {field:'receiverName',name:'收件方'},
                    {field:'receTel',name:'收件方电话'},
                    {field:'receAdd',name:'收件方地址'},
                    {field:'clearType',name:'结算方式'},
                    {field:'paySide',name:'运费付费方'},
                    {field:'pay',name:'运费'},
                    {field:'receiptsCarriage',name:'实收运费'},
                    {field:'acceGoodCount',name:'件数'},
                    {field:'realcount',name:'实收件数'},
                    {field:'collectMoney',name:'代收货款'},
                    {field:'collectionCarriage',name:'实收代收货款'},
                    {field:'fee',name:'代收货手续费'},
                    {field:'offerMoney',name:'保价金额'},
                    {field:'insuranceMoney',name:'保价费'},
                    {field:'stockTaskId',name:'分拨入库单号'},
                    {field:'shipmentTaskId',name:'分拨出库单号'},
                    {field:'fBdistributionWay',name:'分拨方式'},
                    {field:'fBthirdpartyWl',name:'分拨第三方物流'},
                    {field:'fBthirdpartyTaskId',name:'分拨第三方单号'},
                    {field:'fBthirdpartyPay',name:'分拨第三方运费'},
                    {field:'assignTaskId',name:'分派单号'},
                    {field:'distributionWay',name:'配送方式'},
                    {field:'thirdpartyWl',name:'配送第三方物流'},
                    {field:'thirdpartyTaskId',name:'配送第三方单号'},
                    {field:'thirdpartyPay',name:'配送第三方运费'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        style:'width:50px;',
                        buttons: [{
                            text: '查看日志',
                            call: 'getOpenModelData',
                            btnType: 'button',
                            openModal: '#workLogModal'
                        }]
                    }]
            },

            getLogThead: function () {
                return [
                    {field:'handleTime',name:'操作时间'},
                    {field:'handleDetail',name:'状态信息'},
                    {field:'handleName',name:'操作人'}
                ]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(EHOST + '/personalMonitor/getDicLists',{})
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
                $http.post(EHOST + url, data)
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