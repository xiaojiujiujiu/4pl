/**
 * Created by xiaojiu on 2017/4/20.
 */
'use strict';
define(['../../../app'], function(app) {
    app.factory('monadAmend', ['$http', '$q', '$filter', 'EHOST', function($http, $q, $filter, EHOST) {
        return {
            getThead: function () {
                return [{ name:'序号',
                    type:'pl4GridCount'}, {
                    field: 'taskId',
                    name: '业务单号'
                }, {
                    field: 'createWlDeptName',//createWlDeptName
                    name: '收货点'
                }, {
                    field: 'cdcWlDeptName',
                    name: '配送点'
                }, {
                    field: 'auditStatus',
                    name: '审核状态'
                }, {
                    field: 'userName',
                    name: '配送员'
                }, {
                    field: 'chuHuoName',
                    name: '发件方'
                }, {
                    field: 'receiverName',
                    name: '收件方'
                }, {
                    field: 'payType',
                    name: '结算方式'
                }, {
                    field: 'paySide',
                    name: '运费付费方'
                }, {
                    field: 'pay',
                    name: '运费'
                }, {
                    field: 'changePay',
                    name: '修改运费'
                }, {
                    field: 'acceGoodCount',
                    name: '件数'
                }, {
                    field: 'acceGoodCount',
                    name: '实出件数'
                },{
                        field: 'collectMoney',
                        name: '代收货款'
                    }, {
                        field: 'changeCollectMoney',
                        name: '修改代收货款'
                    }, {
                        field: 'fee',
                        name: '代收款手续费'
                    }, {
                    	field: 'changeFee',
                    	name: '修改代收款手续费'
                    }, {
                        field: 'offerMoney',
                        name: '保价金额'
                    }, {
                        field: 'insuranceMoney',
                        name: '保价费'
                    }, {
                    	field: 'rejectRemarks',
                    	name: '驳回备注'
                    }, {
                        field: 'name11',
                        name: '操作',
                        type: 'operate',
                        buttons: [{
                            text: '修改',
                            call: 'modifyCar',
                            openModal: '#modifyCar'
                        }, {
                            text: '删除',
                            call: 'deleteData',
                            openModal: '#deleteData'
                        }]
                    }]
            },

            getSearch: function () {
                var deferred = $q.defer();
                $http.post(EHOST + '/personalOrder/getUpdateDicList', {})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            getDataTable: function (data) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(EHOST + '/personalOrder/queryUpdatePersonalOrder', data)
                    .success(function (data) {
                        // console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            getData: function(data,url) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(EHOST + url, data)
                    .success(function(data) {
                        // console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
        }

    }]);
});