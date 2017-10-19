/**
 * Created by xiaojiu on 2017/3/30.
 */
define(['../../../app'], function (app) {
    app.factory('confirmInventOrder', ['$http','$q','HOST','$filter',function ($http,$q,HOST,$filter) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'wareHouseName',name:'仓库名称'},
                    {field:'taskId',name:'盘点单号'},
//                    {field:'userName',name:'盘点人'},
                    {field:'updateTime',name:'盘点日期'},
                    {field:'confirmStatus',name:'审核状态'},
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
                            state:'confirmInventOrderConfirm'
                        }
                        ]
                    }
                ]
            },
            getOpenModelThHeader: function() {
                return [ {name:'序号',type:'pl4GridCount'},
                    {field:'supplier',name:'供应商'},
                    {field:'goodsCode',name:'商品编码'},
                    {field:'brand',name:'品牌'},
                    {field:'product',name:'品类'},
                    {field:'name',name:'商品名称'},
                    {field:'goodsStyle',name:'规格型号'},
                    {field:'serialNumber',name:'出厂编码'},
                    {field:'goodsUnit',name:'计量单位'},
                    {field:'stockCount',name:'库存数量'},
                    {field:'inventoryCount',name:'实盘数量'},
                    {field:'differentCount',name:'差异数量'},
                ]
            },
            getQuery: function(){
                //将parm转换成json字符串
                var deferred=$q.defer();
                $http.post(HOST+'/ckInventory/getInventoryQuery',{})
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