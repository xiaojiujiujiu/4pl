/**
 * Created by xiaojiu on 2017/5/27.
 */

'use strict';
define(['../../../app'], function(app) {
    app.factory('fsOutGoodsOrderManage', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function() {
                return [{
                    name:'序号',type:'pl4GridCount'
                }, {
                    field: 'taskId',
                    name: '业务单号'
                },{
                    field: 'orderId',
                    name: '客户单号'
                }, {
                    field: 'orderType',
                    name: '业务类型'
                }, {
                    field: 'receiverName',
                    name: '收货方'
                },{
                    field: 'createTime',
                    name: '订单日期'
                },{
                    field: 'acceGoodCount',
                    name: '订单商品数量'
                }, {
                    field: 'op',
                    name: '操作',
                    type: 'operate',style:'width:50px;',
                    buttons: [{
                        text: '打印',
                        btnType: 'btn',
                        call:'print',
                        style: 'font-size:10px;'
                    },
                        {
                            text: '出库',
                            btnType: 'link',
                            state:'cdcOrderOutboundConfirm',
                            style: 'font-size:10px;'
                        },
                        {
                            text: '查看',
                            btnType: 'btn',
                            call:'lookGird',
                            style: 'font-size:10px;'
                        }
                    ]
                }]
            },
            getLogThead: function(){
                return [{
                    field: 'name',
                    name: '商品名称'
                }, {
                    field: 'goodsStyle',
                    name: '规格型号'
                }, {
                    field: 'huoweiNo',
                    name: '货位'
                },{
                    field: 'serialNumber',
                    name: '出厂编码'
                },  {
                    field: 'goodsCode',
                    name: '商品编码'
                },  {
                    field: 'product',
                    name: '商品品类'
                }, {
                    field: 'brand',
                    name: '商品品牌'
                }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/fsMonitor/getOutGoodsDicLists',{})
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
                $http.post(HOST + '/fsMonitor/outGoodsOrderList', data)
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