/**
 * Created by xuwusheng on 15/12/21.
 */
define(['../../../app'], function (app) {
    app.factory('payablePayment', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'createTime',name:'统计日期'},
                    {field:'receiptId',name:'结算单号'},
                    {field:'wlDeptName',name:'结算配送中心'},
                    {field:'cooperationType',name:'合作形式'},
                    {field:'money',name:'应付代收货款'},
                    {field:'statu',name:'支付状态'},
                    {field:'opUser',name:'操作人'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        buttons: [{
                            text: '确认已付',
                            call: 'confirmPayment',
                            btnType: 'button',
                            style: 'font-size:10px;'
                        },{
                            text: '驳回',
                            call: 'cancelPayment',
                            btnType: 'button',
                            style: 'font-size:10px;'
                        },{text:'|'},{
                            text: '查看明细',
                            call: 'lookDetails',
                            btnType: 'button',
                            style: 'font-size:10px;'
                        }]
                    }
                ]
            },
            getDetailThead: function(){
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'orderId',name:'客户单号'},
                    {field:'createTime',name:'回执时间'},
                    {field:'opUser',name:'配送员'},
                    {field:'collectMoney',name:'应付代收款'}
                ]
            },
            getSearch: function () {

                var deferred=$q.defer();
                $http.post(HOST+'/payMent/getPSDicLists',{})
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
                $http.post(HOST+url, data)
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