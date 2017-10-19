/**
 * Created by xiaojiu on 2016/11/19.
 */
define(['../../../app'], function (app) {
    app.factory('examineOutIn', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'#',type:'pl4GridCount'},
                    {field:'taskId',name:'申请编号'},
                    {field:'createTime',name:'申请时间'},
                    {field:'type',name:'特殊出入库类型'},
                    {field:'ckName',name:'申请仓库'},
                    {field:'userRemarks',name:'用途描述'},
                    {field:'status',name:'审批状态'},
                    {field:'examineUserName',name:'审核人'},
                    {field:'op',name:'操作',type:'operate',buttons:[{text:'审批', btnType: 'btn',call:'lookCus',openModal:'#settleModal'},{text:'查看',btnType:'btn',call:'lookCus',openModal:'#lookModal'}]}
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
                }, {
                    field: 'reportcount',
                    name: '申请数量'
                },{
                    field: 'price',
                    name: '单价'
                },{
                    field: 'xiaojiMoney',
                    name: '小计'
                }
                ]
            },
            getSearch: function () {

                var deferred=$q.defer();
                $http.post(HOST+'/examine/getOutInCkOrderBranner',{})
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
