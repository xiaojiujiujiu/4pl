/**
 * Created by xiaojiu on 2017/3/27.
 */
define(['../../../app'], function (app) {
    app.factory('stockTransfer', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'#',type:'pl4GridCount'},
                    {field:'taskId',name:'申请单号'},
                    {field:'createTime',name:'创建日期'},
                    {field:'transferType',name:'转移类型'},
                    {field:'transferCount',name:'申请转移数量'},
                    {field:'orderStatus',name:'审核状态'},
                    {field:'name11',name:'操作',type:'operate',buttons:[
                        {text:'修改',btnType:'btn',call:'updateStation'},
                        {text:'删除',call:'delete'},{
                        text: '查看',
                        btnType: 'link',
                        state: 'stockTransferLook'
                        //openModal:'#alloModal'
                    }]}]
            },
            getAllTHeader: function () {
                return [
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
                    {field:'transferCount',name:'转移数量',input:true,style:"width:80px"},
                ]
            },
            getQuery: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/stockTransfer/getTransferDicLists',{})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;

            },
            getDataTable: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+(!url?'/stockTransfer/getTransferOrder':url),data)
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