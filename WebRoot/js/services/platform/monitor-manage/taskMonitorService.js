/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app'], function (app) {
    app.factory('taskMonitor', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'chuCkName',name:'发货仓库'},
                    {field:'recCkName',name:'收货仓库'},
                    {field:'taskId',name:'业务单号'},
                    {field:'custTaskId',name:'客户单号'},
                    {field:'thirdWild',name:'第三方单号'},
                    {field:'taskType',name:'业务类型'},
                    {field:'customer',name:'客户'},
                    {field:'receTel',name:'联系电话'},
                    {field:'receAdd',name:'地址'},
                    // {field:'boxCount',name:'箱数'},
                    //{field:'taskState',name:'订单状态'},
                    {field:'fhTime',name:'发货日期'},
                    {field:'wlTaskTypeId',name:'配送方式'},
                    {field:'userName',name:'配送员'},
                    {field:'licenseNumber',name:'配送车辆'},
//                    {field:'ckName',name:'所属仓库'},
//                    {field:'toArea',name:'仓库地域'},
//                    {field:'wlComp',name:'物流中心'},
//                    {field:'handelTime',name:'业务时间'},
//                    {field:'moneyCount',name:'订单金额'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        style:'width:50px;',
                        buttons: [{
                            text: '详情',
                            call: 'getOpenModelData',
                            btnType: 'button',
                            style: 'font-size:10px;',
                            openModal: '#workLogModal'
                        }]
                    }]
            },
            getDetailThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'supliers',name:'供应商'},
                    {field:'goodName',name:'商品名称'},
                    {field:'model',name:'规格型号'},
                    {field:'factoryCode',name:'出厂编码'},
                    {field:'brand',name:'品牌'},
                    {field:'origGoodCount',name:'订购数量'},
                    {field:'acceGoodCount',name:'实发数量'},
                    {field:'meaUnit',name:'计量单位'},
                    {field:'orderPrice',name:'单价'},
                    {field:'money',name:'小计'},
                    {field:'moneyCount',name:'优惠后金额'},
                    {field:'remark',name:'备注'}
                ]
            },
            getLogThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'custTaskId',name:'客户单号'},
                    {field:'handleDetail',name:'操作描述'},
                    {field:'handleMan',name:'操作人'},
                    {field:'handelTime',name:'操作时间'}
                ]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/workMonitor/getTaskDicLists',{})
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