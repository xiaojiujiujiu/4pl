/**
 * Created by xiaojiu on 2016/11/19.
 */
define(['../../../app'], function (app) {
    app.factory('profitorLossPay', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'#',type:'pl4GridCount'},
                    {field:'ckName',name:'仓库名称'},
                    {field:'taskId',name:'损溢单号'},
                    {field:'orderPrice',name:'差异总金额'},
                    {field:'examineUser',name:'审批人'},
                    {field:'updateTime',name:'结算时间'},
                    {field:'balanceStatus',name:'结算状态'},
                    {field:'optUser',name:'操作人'},
                    {field:'op',name:'操作',type:'operate',buttons:[{text:'打印', btnType: 'button',call: 'print'},{text:'结算', btnType: 'btn',call:'lookCus',openModal:'#settleModal'},{text:'查看',btnType:'btn',call:'lookCus',openModal:'#lookModal'}]}
                ]
            },
            getLookModelThHeader: function() {
                return [ {
                    field: 'pl4GridCount',
                    name: '#',
                    type: 'pl4GridCount'
                }, {
                    field: 'partyName',
                    name: '供应商'
                },  {
                    field: 'customerName',
                    name: '客户'
                }, {
                    field: 'sku',
                    name: '商品编码'
                }, {
                    field: 'goodsBrand',
                    name: '商品品牌'
                }, {
                    field: 'modelName',
                    name: '规格型号'
                }, {
                    field: 'goodsName',
                    name: '商品名称'
                }, {
                    field: 'unitName',
                    name: '计量单位'
                }, {
                    field: 'reportTypeName',
                    name: '损溢类型'
                }, {
                    field: 'reportCount',
                    name: '损溢数量'
                },{
                    field: 'subTotal',
                    name: '小计'
                },  {
                    field: 'remarks',
                    name: '备注'
                }
                ]
            },
            getSearch: function () {

                var deferred=$q.defer();
                $http.post(HOST+'/lossAndOverflowPay/getDicLists',{})
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
            }
        }
    }]);
});
