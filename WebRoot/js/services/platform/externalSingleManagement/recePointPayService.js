/**
 * Created by xiaojiu on 2016/11/22.
 */
define(['../../../app'], function (app) {
    app.factory('recePointPay', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'',type:'input',check:true,checkAll:true,},
                    {field:'taskId',name:'业务单号'},
                    {field:'createTime',name:'创建时间'},
                    {field:'receivingPointName',name:'收货点'},
                    {field:'clearType',name:'支付方式'},
                    {field:'totalMoney',name:'收款金额'},
                    {field:'paySideName',name:'付款方'},
                    {field:'payType',name:'结算方式'},
                    {field:'pay',name:'运费'},
                    {field:'offerMoney',name:'保险金额'},
                    {field:'insuranceMoney',name:'保险费'},
                    {field:'chuHuoName',name:'发件方'},
                    {field:'chuHTel',name:'发件方电话'},
                    {field:'receiverName',name:'收件方'},
                    {field:'receTel',name:'收件方电话'}
                    //{field:'payOpUser',name:'收款人'},
                    //{
                    //    field: 'op',
                    //    name: '操作',
                    //    type: 'operate',
                    //    style:'width:50px;',
                    //    buttons: [{
                    //        text: '收款',
                    //        call: 'updateGift',
                    //        btnType: 'button',
                    //        openModal: '#workLogModal'
                    //    }]
                    //}
                ]
            },
            getTheadChange: function () {
                return [
                    {name:'#',type:'pl4GridCount'},
                    {field:'settleId',name:'结算单号'},
                    {field:'createTime',name:'结算时间'},
                    {field:'receivableMoney',name:'应收金额'},
                    {field:'actualMoney',name:'实收金额'},
                    {field:'payType',name:'支付方式'},
                    {field:'payOpUser',name:'收款人'},
                    {field:'remark',name:'备注'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        style:'width:50px;',
                        buttons: [{ text: '查看',
                    call: 'getOpenModelData',
                    btnType: 'button',
                    style: 'font-size:10px;',
                    openModal: '#logModal'}]
                    }]
            },
            getOpenModelThHeader: function() {
                return [ {
                    field: 'pl4GridCount',
                    name: '#',
                    type: 'pl4GridCount'
                },{
                    field: 'taskId',
                    name: '业务单号'
                },{
                    field: 'createTime',
                    name: '创建时间'
                }, {
                    field: 'receivingPointName',
                    name: '收货点'
                }, {
                    field: 'clearType',
                    name: '支付方式'
                },{
                    field: 'total',
                    name: '收款金额'
                }, {
                    field: 'paySideName',
                    name: '付款方'
                }, {
                    field: 'payType',
                    name: '结算方式'
                }, {
                    field: 'pay',
                    name: '运费'
                }, {
                    field: 'offerMoney',
                    name: '保险金额'
                }, {
                    field: 'remarks',
                    name: '保险费'
                }, {
                    field: 'chuHuoName',
                    name: '发件方'
                }
                ]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/recePointPay/getDicLists',{})
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