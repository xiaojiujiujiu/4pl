/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app'], function (app) {
    app.factory('goodsMonitor', ['$http','$q','HOST','$filter',function ($http,$q,HOST,$filter) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'ckName',name:'仓库'},
                    {field:'customerId',name:'客户'},
                    {field:'sku',name:'商品编码'},
                    {field:'factoryCode',name:'出厂编码'},
                    {field:'brand',name:'商品品牌'},
                    {field:'productName',name:'品类'},
                    {field:'model',name:'规格型号'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'goodsCount',name:'商品数量'},
                    {field:'meaUnit',name:'计量单位'},
                    {field:'price',name:'商品单价（移动加权平均价）'},
                    {field:'countMoney',name:'商品总额'},
                    {
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        buttons: [{
                            text: '查看批次价格',
                            call: 'getOpenModel',
                            btnType: 'button',
                            style: 'font-size:10px;',
                            openModal: '#lookModal'
                        }]
                    }
                ]
            },
            getOpenModelThHeader: function() {
                return [ {name:'序号',type:'pl4GridCount'},
                         {field:'updateTime',name:'操作时间'},
                         {field:'batchNo',name:'批次号'},
                         {field:'orderPrice',name:'批次价格'}]
            },
            getQuery: function(){
                //将parm转换成json字符串
                var deferred=$q.defer();
                $http.post(HOST+'/goodsMonitor/getDicLists',{})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            //test: function(data){
            //    //将parm转换成json字符串
            //    data.param=$filter('json')(data.param);
            //    var deferred=$q.defer();
            //    $http.post(HOST+'/deliveryPartyPay/getShipperLists',data)
            //        .success(function (data) {
            //            deferred.resolve(data.query.userList);
            //        })
            //        .error(function (e) {
            //            deferred.reject('error:'+e);
            //        });
            //    return deferred.promise;
            //},
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