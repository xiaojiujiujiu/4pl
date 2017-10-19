/**
 * Created by xiaojiu on 2017/3/22.
 */
'use strict';
define(['../../../app'], function(app) {
    app.factory('storageCarManage', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function() {
                return [{
                    field: 'pl4GridCount',
                    name: '序号',
                    type: 'pl4GridCount'
                }, {
                    field: 'vehicleName',
                    name: '车辆名称'
                }, {
                    field: 'licenseNumber',
                    name: '车牌号'
                }, {
                    field: 'property',
                    name: '权属'
                }, {
                    field: 'leaseType',
                    name: '租赁模式'
                }, {
                    field: 'leaseDate',
                    name: '起租日'
                }, {
                    field: 'leaseTime',
                    name: '租期'
                }, {
                    field: 'rent',
                    name: '租金(元/月)'
                }, {
                    field: 'originalValue',
                    name: '原值/参考原值'
                }, {
                    field: 'salesDate',
                    name: '购入时间(年/月)'
                }, {
                    field: 'remarks',
                    name: '备注'
                }, {
                    field: 'name11',
                    name: '操作',
                    type: 'operate',
                    buttons: [{
                        text: '修改',
                        btnType: 'btn',
                        call:'editCar',
                        openModal:'#addCar'
                    },{
                        text: '冻结',
                        call: 'freezeCar'
                    }, {
                        text: '恢复',
                        call: 'recovery'
                    }]
                }]
            },
            getDataTable: function(data,url) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + (!url?'/CkCar/queryCkCarInfoList':url), data)
                    .success(function(data) {
                        // console.log(data)
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