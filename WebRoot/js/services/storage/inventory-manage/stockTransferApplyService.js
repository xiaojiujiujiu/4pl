/**
 * Created by xiaojiu on 2017/3/27.
 */
define(['../../../app'], function (app) {
    app.factory('stockTransferApply', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'#',type:'pl4GridCount'},
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
                    {field:'transferType',name:'转移类型',type:"rd",rds:[{name:'name11',text:'残转良',value:'2',btnType:'r',style:'width:70px;color:green'},{name:'name11',text:'良转残',value:'1',btnType:'r',style:'color:red'}]},
                    {field:'transferCount',name:'转移数量',input:true,type:"text",call:'clearNoNum2',style:"width:80px",maxlength:"4"},
                    {field:'name11',name:'操作',type:'operate',buttons:[
                        {text:'确认申请',btnType:'btn',call:'updateStation',openModal:'#confirmApplication'},
                        ]}
                    ]
            },
            getQuery: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/stockTransfer/getApplyDicLists',{})
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
                $http.post(HOST+(!url?'/stockTransfer/queryOrEditTransferApply':url),data)
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