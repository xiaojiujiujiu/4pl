/**
 * Created by xiaojiu on 2016/11/8.
 */
define(['../../../app'], function (app) {
    app.factory('breakageTheOverflow', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'#',type:'pl4GridCount'},
                    {field:'taskId',name:'损溢单号'},
                    {field:'createTime',name:'制单日期'},
                    {field:'goodsTypeCount',name:'商品种类'},
                    //{field:'productName',name:'商品数量'},
                    {field:'status',name:'状态'},
                    {field:'optUser',name:'操作员'},
                    {field:'bar',name:'操作',type:'operate',buttons:[{
                        text: '编辑',
                        btnType:'btn',
                        call:'compileData',
                    },{
                        text: '查看',
                        btnType: 'btn',
                        call: 'checkDetail',
                        id:-1,
                        //openModal:'#alloModal'
                    }]}]
            },getQuery: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/lossAndOverflowReport/getDicLists',{})
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
                    field: 'partyName',
                    name: '供应商'
                }, {
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
                    field: 'factoryCode',
                    name: '出厂编码'
                }, {
                    field: 'goodsName',
                    name: '商品名称'
                }, {
                    field: 'unitName',
                    name: '计量单位'
                }, {
                    field: 'stockCount',
                    name: '库存数量'
                }, {
                    field: 'inventoryCount',
                    name: '实盘数量'
                }, {
                    field: 'reportTypeName',
                    name: '损溢类型'
                }, {
                    field: 'reportCount',
                    name: '损溢数量'
                }, {
                    field: 'remarks',
                    name: '备注'
                }];
            },
            compileTHeader: function () {
                return [
                    {name:'#',type:'pl4GridCount'},
                    {field:'partyName',name:'供应商'},
                    {field:'customerName',name:'客户'},
                    {field:'sku',name:'商品编码'},
                    {field:'goodsBrandName',name:'商品品牌'},
                    {field:'modelName',name:'规格型号'},
                    {field:'factoryCode',name:'出厂编码'},
                    {field:'goodsName',name:'商品名称'},
                    {field:'unitName',name:'计量单位'},
                    {field:'stockCount',name:'库存数量'},
                    {field:'inventoryCount',name:'实盘数量'},
                    {field:'differentStatus',name:'损溢类型',type:'rd',rds:[{name:'name11',text:'报损',value:'1',btnType:'r',style:'width:70px'},{name:'name11',text:'报溢',value:'2',btnType:'r'}]},
                    {field:'differentCount',name:'损溢数量',input:true,style:'width:50px'},
                    {field:'remarks',name:'备注',input:true,style:'width:100px'},
                    {field:'op',name:'操作',type:'operate',buttons:[{text:'删除',btnType:'btn',call:'deleteCustom'}]}
                ]
            },
            getDataTable: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+(!url?'/lossAndOverflowReport/queryReportList':url),data)
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
