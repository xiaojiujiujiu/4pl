/**
 * Created by xiaojiu on 2016/11/28.
 */

define(['../../../app'], function (app) {
    app.factory('otherChuRuOrder', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'#',type:'pl4GridCount'},
                    {field:'taskId',name:'申请编号'},
                    {field:'type',name:'内部出库类型'},
                    {field:'createTime',name:'制单日期'},
                    {field:'createUser',name:'申请人'},
                    {field:'examineStatus',name:'审批状态'},
                    {field:'examineUser',name:'审批人'},
                    {field:'bar',name:'操作',type:'operate',buttons:[{
                        text: '编辑',
                        btnType:'btn',
                        call:'compileData',
                    },{
                        text: '查看',
                        btnType: 'btn',
                        call: 'checkDetail',
                        openModal:'#alloModal'
                    },{
                        text: '打印',
                        btnType: 'btn',
                        call: 'print'
                    }]}]
            },getQuery: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/ckOtherChuRuOrder/getDicLists',{})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;

            },
            getAllTHeader: function () {
                return [
                    {name:'#',type:'pl4GridCount'},
                    {
                        field: 'suppliersName',
                        name: '供应商'
                    }, {
                        field: 'customerName',
                        name: '客户'
                    }, {
                        field: 'sku',
                        name: '商品编码'
                    }, {
                        field: 'goodsBrandName',
                        name: '商品品牌'
                    }, {
                        field: 'modelName',
                        name: '规格型号'
                    }, {
                        field: 'factoryCode',
                        name: '出厂编码'
                    }, {
                        field: 'goodsName',
                        name: '商品名称'
                    }, {
                        field: 'unitName',
                        name: '计量单位'
                    }, {
                        field: 'reportcount',
                        name: '申请数量'
                    }, {
                        field: 'price',
                        name: '单价'
                    }, {
                        field: 'subtotal',
                        name: '小计'
                    }];
            },
            compileTHeader: function () {
                return [
                    {name:'',type:'input',checkAll:true,check:true},
                    {field:'suppliersName',name:'供应商'},
                    {field:'customerName',name:'客户'},
                    {field:'sku',name:'商品编码'},
                    {field:'goodsBrandName',name:'商品品牌'},
                    {field:'modelName',name:'规格型号'},
                    {field:'factoryCode',name:'出厂编码'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'unitName',name:'计量单位'},
                    {field:'stockCount',name:'库存数量'},
                    {field:'reportcount',name:'申请数量',input:true,style:'width:50px;'},
                    {field:'price',name:'单价'},
                    {field:'subtotal',name:'小计'},
                    {field:'op',name:'操作',type:'operate',buttons:[{text:'删除',btnType:'btn',call:'delete'}]}
                ]
            },
            getDataTable: function (url,data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+url,data)
                    // $http.post(HOST+url,data)
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
