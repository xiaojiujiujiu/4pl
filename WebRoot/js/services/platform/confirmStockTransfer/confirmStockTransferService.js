/**
 * Created by xiaojiu on 2017/3/28.
 */
define(['../../../app'], function (app) {
    app.factory('confirmStockTransfer', ['$http','$q','HOST','$filter',function ($http,$q,HOST,$filter) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'wareHouseName',name:'仓库名称'},
                    {field:'taskId',name:'申请单号'},
                    {field:'createTime',name:'创建日期'},
                    {field:'transferType',name:'转移类型'},
                    {field:'transferNum',name:'申请转移数量'},
                    {field:'transferStatu',name:'审核状态'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        buttons: [{
                            text: '查看',
                            call: 'getOpenModel',
                            btnType: 'button',
                            style: 'font-size:10px;',
                            openModal: '#lookModal'
                        },{
                            text: '审核',
                            btnType:'link',
                            state:'confirmStockTransferConfirm'
                        }
                        ]
                    }
                ]
            },
            getOpenModelThHeader: function() {
                return [ {name:'序号',type:'pl4GridCount'},
                    {field:'product',name:'品类'},
                    {field:'brand',name:'品牌'},
                    {field:'supplier',name:'供应商'},
                    {field:'serialNumber',name:'出厂编码'},
                    {field:'name',name:'商品名称'},
                    {field:'goodsStyle',name:'规格型号'},
                    {field:'goodsCode',name:'商品编码'},
                    {field:'goodsUnit',name:'计量单位'},
                    {field:'availableStock',name:'可用库存'},
                    {field:'damageStock',name:'残损品库存'},
                    {field:'transferType',name:'转移类型'},
                    {field:'transferCount',name:'转移数量'},
                ]
            },
            getQuery: function(){
                //将parm转换成json字符串
                var deferred=$q.defer();
                $http.post(HOST+'/stockTransfer/getStockTransferQuery',{})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },

            getDataTable: function (url,data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+url, data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getBatchDataTable: function (url,data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+url, data)
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