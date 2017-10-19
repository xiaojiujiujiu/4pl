/**
 * Created by xiaojiu on 2016/11/22.
 */
define(['../../../app'], function (app) {
    app.factory('deliveryPartyPay', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'createTime',name:'订单时间'},
                    {field:'hzTime',name:'回执时间'},
                    {field:'payStatus',name:'结算状态'},
                    {field:'collectTimeliness',name:'代收款回款时效'},
                    {field:'chuHuoName',name:'发件方'},
                    {field:'chuHTel',name:'发件方电话'},
                    {field:'deliveryPayType',name:'支付方式'},
                    {field:'totalMoney',name:'付款金额'},
                    {field:'collectMoney',name:'代收货款'},
                    {field:'fee',name:'代收货款手续费'},
                    {field:'deliveryOpUser',name:'付款人'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        style:'width:50px;',
                        buttons: [{
                            text: '付款',
                            call: 'updateGift',
                            btnType: 'button',
                            openModal: '#workLogModal'
                        }]
                    }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/deliveryPartyPay/getDicLists',{})
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
                $http.post(HOST+'/deliveryPartyPay/getShipperLists',data)
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