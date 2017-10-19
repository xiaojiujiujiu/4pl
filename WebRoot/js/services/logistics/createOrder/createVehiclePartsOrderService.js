/**
 * Created by xiaojiu on 2017/7/6.
 */

'use strict';
define(['../../../app'], function(app) {
    app.factory('createVehiclePartsOrder', ['$http', '$q', '$filter','HOST', function($http, $q, $filter,HOST) {
        return {
            getThead: function() {
                return [ {name:'序号',type:'pl4GridCount'}, {
                    field: 'taskId',
                    name: '业务单号'
                }, {
                    field: 'waybillId',
                    name: '运单号'
                },
                {
                    field: 'createTime',
                    name: '创建时间'
                }, {
                        field: 'chuHuoName',
                        name: '发货方'
                    },  {
                        field: 'chuHTel',
                        name: '发货方电话'
                    }, {
                    field: 'chuHaddress',
                    name: '发货方地址'
                }, {
                        field: 'receiverName',
                        name: '收货方'
                    }, {
                        field: 'receTel',
                        name: '收货方电话'
                    }, {
                    field: 'receAddress',
                    name: '收货方地址'
                },{
                    field: 'deliveryWay',
                    name: '发货方式'
                },{
                    field: 'orderSource',
                    name: '订单来源'
                },{
                    field: 'orderFee',
                    name: '代收货款'
                },{
                    field: 'remarks',
                    name: '备注'
                },{
                    field: 'carrierName',
                    name: '第三方名称'
                },{
                    field: 'mobilePhone',
                    name: '第三方联系方式'
                },{
                    field: 'thirdWlId',
                    name: '第三方单号'
                },{
                    field: 'pay',
                    name: '订单运费'
                },{
                        field: 'orderStates',
                        name: '订单状态'
                    }, {
                        field: 'name11',
                        name: '操作',
                        type: 'operate',
                        buttons: [{
                            text: '确认收货',
                            call:'obtainId',
                            openModal:'#confirmInCk'
                        },
//                        {
//                            text: '发货',
//                            btnType: 'btn',
//                            call:'linkF',
//                            state: 'createVehiclePartsOrderChu'
//                        },
                        {
                            text: '查看明细',
                            btnType: 'btn',
                            call:'linkL',
                            //state: 'createVehiclePartsOrderLook'
                        },{
                            text: '打印',
                            btnType:'btn',
                            call:'print'
                        }]
                    }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/vehicleParts/getDicList',{})
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            getDataTable: function(data) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + '/vehicleParts/queryOrderList', data)
                    .success(function(data) {
                        // console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            confirmInCk: function(data,url) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + url, data)
                    .success(function(data) {
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