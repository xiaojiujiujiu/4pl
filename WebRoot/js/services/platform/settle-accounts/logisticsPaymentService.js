/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app'], function (app) {
    app.factory('logisticsPayment', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'receiptId',name:'物流应付单号'},
                    {field:'receiptTime',name:'结算日期'},
                    {field:'wlCompId',name:'结算物流中心'},
                    {field:'wlTaskType',name:'物流类型'},
                    {field:'cashCount',name:'应付现金'},
                    {field:'posCount',name:'POS刷卡'},
                    {field:'onLineCount',name:'在线支付'},
                    {field:'monthBalance',name:'月结'},
                    {field:'state',name:'应付状态'},
                    {field:'receiptUser',name:'操作人'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        buttons: [{
                            text: '确认已付',
                            call: 'confirmPayment',
                            btnType: 'button',
                            style: 'font-size:10px;'
                        }]
                    }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/payMent/getpayMentDicLists',{})
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            getDataTable: function (url,data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(url, data)
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