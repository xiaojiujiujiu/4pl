/**
 * Created by xiaojiu on 2017/4/24.
 */
define(['../../../app'], function (app) {
    app.factory('thirdPartyFreightPay', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'createTime',name:'订单时间'},
                    {field:'chuHuoName',name:'发件方'},
                    {field:'chuHTel',name:'发件方电话'},
                    {field:'chuHuoAddress',name:'发件方地址'},
                    {field:'receiverName',name:'收件方'},
                    {field:'receTel',name:'收件方电话'},
                    {field:'receiverAddress',name:'收件方地址'},
                    {field:'thirdWlId',name:'第三方单号'},
                    {field:'thirdpartyPay',name:'第三方运费'},
                    {field:'shippedFreightStatu',name:'是否结算'},
                    {field:'userName',name:'付款人'},
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
                $http.post(HOST + '/deliveryPartyPay/thirdPartyFreightPayDicList',{})
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