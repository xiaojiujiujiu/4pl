/**
 * Created by xiaojiu on 2016/11/19.
 */
define(['../../../app'], function (app) {
    app.factory('examineBlaOutIn', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'#',type:'pl4GridCount'},
                    {field:'ckName',name:'仓库名称'},
                    {field:'taskId',name:'申请编号'},
                    {field:'type',name:'特殊出入库类型'},
                    {field:'examineUserName',name:'审批人'},
                    {field:'createTime',name:'申请时间'},
                    {field:'status',name:'结算状态'},
                    {field:'createUserName',name:'操作人'},
                    {field:'op',name:'操作',type:'operate',buttons:[{text:'打印', btnType: 'button',call: 'print'},{text:'结算', btnType: 'btn',call:'lookCus',openModal:'#settleModal'},{text:'查看',btnType:'btn',call:'lookCus',openModal:'#lookModal'}]}
                ]
            },
            getLookModelThHeader: function() {
                return [ {
                    field: 'pl4GridCount',
                    name: '#',
                    type: 'pl4GridCount'
                }, {
                    field: 'supliersName',
                    name: '供应商'
                },  {
                    field: 'customerName',
                    name: '客户'
                }, {
                    field: 'sku',
                    name: '商品编码'
                }, {
                    field: 'brandName',
                    name: '商品品牌'
                }, {
                    field: 'modelName',
                    name: '规格型号'
                },{
                    field: 'factoryCode',
                    name: '出厂编码'
                }, {
                    field: 'goodsName',
                    name: '商品名称'
                }, {
                    field: 'meaUnit',
                    name: '计量单位'
                },  {
                    field: 'reportcount',
                    name: '申请数量'
                },{
                    field: 'price',
                    name: '单价'
                },  {
                    field: 'xiaojiMoney',
                    name: '小计'
                }
                ]
            },
            getSearch: function () {

                var deferred=$q.defer();
                $http.post(HOST+'/examine/getBlaOutInCkOrderBranner',{})
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
