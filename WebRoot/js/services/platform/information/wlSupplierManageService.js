/**
 * Created by xiaojiu on 2017/3/22.
 */
'use strict';
define(['../../../app'], function(app) {
    app.factory('wlSupplierManage', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function() {
                return [{
                    field: 'pl4GridCount',
                    name: '序号',
                    type: 'pl4GridCount'
                }, {
                    field: 'owerckName',
                    name: '仓库名称'
                }, {
                    field: 'wlType',
                    name: '配送类型'
                }, {
                    field: 'lineName',
                    name: '路线名称'
                }, {
                    field: 'deliveryFacilitator',
                    name: '合作配送商/百库直营'
                }, {
                    field: 'payType',
                    name: '结算方式'
                }, {
                    field: 'bindGarageAmount',
                    name: '覆盖汽修厂数量'
                }, {
                    field: 'motorcycleType',
                    name: '配送车型'
                }, {
                    field: 'licenseNumber',
                    name: '车牌号码'
                }, {
                    field: 'deliveryRate',
                    name: '配送频次(每天或每周)'
                }, {
                    field: 'instruction',
                    name: '路线说明(起点-途径-终点)'
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
            getSearch: function () {

                var deferred=$q.defer();
                //绑定查询接口
                $http.post(HOST+'/wlSupplier/getDicLists',{})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getDataTable: function(data,url) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + (!url?'/wlSupplier/queryWlSupplierList':url), data)
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