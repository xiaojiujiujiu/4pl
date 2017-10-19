/**
 * Created by xiaojiu on 2016/11/22.
 */
define(['../../../app'], function (app) {
    app.factory('distributionPointPay', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'receiptId',name:'结算单号'},
                    {field:'createTime',name:'回执结算时间'},
                    {field:'wlDeptName',name:'配送中心'},
                    {field:'payStatu',name:'确认状态'},
                    {field:'totalMoney',name:'收款金额'},
                    {field:'clearType',name:'支付方式'},
                    {field:'pay',name:'运费'},
                    {field:'collectMoney',name:'代收货款'},
                    {field:'opUser',name:'操作人'},
                    {field:'remarks',name:'备注'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        buttons: [{
                            text: '确认到账',
                            call: 'updateGift',
                            btnType: 'button',
                            openModal: '#workLogModal'
                        },{
                            text: '查看订单详情',
                            call: 'lookGift',
                            btnType: 'button',
                            openModal: '#lookModal'
                        }]
                    }]
            },
            lookHeader: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'createTime',name:'订单时间'},
                    {field:'userName',name:'配送员'},
                    {field:'totalMoney',name:'收款金额'},
                    {field:'paySideName',name:'运费付费方'},
                    {field:'payType',name:'结算方式'},
                    {field:'pay',name:'运费'},
                    {field:'clearType',name:'支付方式'},
                    {field:'collectMoney',name:'代收货款'},
                    {field:'chuHuoName',name:'发件方'},
                    {field:'chuHTel',name:'发件方电话'},
                    {field:'receiverName',name:'收件方'},
                    {field:'receTel',name:'收件方电话'},
                    {field:'payOpUser',name:'收款人'},
                ]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/distributionPointPay/getDicLists',{})
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