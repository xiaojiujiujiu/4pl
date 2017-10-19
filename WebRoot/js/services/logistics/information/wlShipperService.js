/**
 * Created by xiaojiu on 2016/11/21.
 */
define(['../../../app'], function (app) {
    app.factory('wlShipper', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'senderNumber',name:'发件方编号'},
                    {field:'userName',name:'发件方名称'},
                    {field:'createTime',name:'创建时间'},
                    {field:'tel',name:'发货方电话'},
                    {field:'freightdiscount',name:'运费折扣'},
                    {field:'collectionRate',name:'代收货款费率'},
                    {field:'premiumRate',name:'保价费率'},
                    {field:'provinceName',name:'省'},
                    {field:'cityName',name:'市'},
                    {field:'countName',name:'区（县）'},
                    {field:'address',name:'详细地址'},
                    //{field:'cooperationStateName',name:'合作状态'},
                    {field:'collectTimeliness',name:'代收款回款时效'},
                    //{field:'shareProvinceName',name:'共享发件方省'},
                    //{field:'shareCityName',name:'共享发件方市'},
                    //{field:'shareCountyName',name:'共享发件方区（县）'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        style:'width:50px;',
                        buttons: [{
                            text: '编辑',
                            call: 'updateGift',
                            btnType: 'button',
                            openModal: '#workLogModal'
                        },{
                            text: '删除',
                            call: 'deleteCustom',
                            btnType: 'button',
                        },{
                            text: '验证',
                            call: 'verify',
                            btnType: 'button',
                        }]
                    }]
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
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/distributionUser/getDicLists',{})
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