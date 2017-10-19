/**
 * Created by hui.sun on 15/12/18.
 */
define(['../../../app'], function (app) {
    app.factory('damageAudit', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'recordId',name:'登记单号'},
                    {field:'taskId',name:'业务单号'},
                    {field:'custTaskId',name:'客户单号'},
                    {field:'distributype',name:'配送方式'},
                    {field:'distributName',name:'配送员'},
                    {field:'phone',name:'联系方式'},
                    {field:'recordDate',name:'登记日期'},
//                    {field:'recordMan',name:'登记人'},
                    {field:'payState',name:'支付状态'},
                    {field:'payMoney',name:'应支付金额'},
                    {field:'payMan',name:'结账人'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        buttons: [{
                            text: '支付登记',
                            call: 'payRegistration',
                            btnType: 'button',
                            style: 'font-size:10px;',
                            openModal: ''
                        },{text:'|'},{
                            text: '查看',
                            call: 'inspect',
                            btnType: 'button',
                            style: 'font-size:10px;',
                            openModal: ''
                        }]
                    }]
            },
            getPayThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'supliers',name:'供应商'},
                    {field:'sku',name:'商品编码'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'model',name:'商品规格'},
                    {field:'breakCount',name:'数量'},
                    {field:'meaUnit',name:'计量单位'},
                    {field:'payPrice',name:'单价'},
                    {field:'moneyCount',name:'小计'},
                    {field:'diffDescription',name:'差异'}
                ]
            },
            getLookThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'supliers',name:'供应商'},
                    {field:'sku',name:'商品编码'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'model',name:'商品规格'},
                    {field:'breakCount',name:'数量'},
                    {field:'meaUnit',name:'计量单位'},
                    {field:'payPrice',name:'单价'},
                    {field:'moneyCount',name:'小计'},
                    {field:'diffDescription',name:'差异'}
                ]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/compensateMonitor/getDicLists',{})
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
                $http.post(url, data)
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