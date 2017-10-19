/**
 * Created by xuwusheng on 15/12/21.
 */
define(['../../../app'], function (app) {
    app.factory('giftTransfersConfirm', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead0: function () {
                return [
                    {name:'#',type:'pl4GridCount'},
                    {field:'sku',name:'礼品编码'},
                    {field:'giftName',name:'礼品名称'},
                    {field:'giftBrand',name:'礼品品牌'},
                    {field:'giftType',name:'礼品分类'},
                    {field:'stockCount',name:'库存数量'},
                    {field:'price',name:'礼品单价',},
                    {field:'count',name:'调拨数量',input:true,pl4DataType:'number',style:'width:100px;'},
                    {field:'op',name:'操作',type:'operate',buttons:[{text:'删除',btnType:'btn',call:'deleteGift'}]}
                ]
            },
            getThead1: function () {
                return [
                    {name:'全选',check:true,checkAll:true},
                    {field:'sku',name:'礼品编码'},
                    {field:'giftName',name:'礼品名称'},
                    {field:'giftBrand',name:'礼品品牌'},
                    {field:'giftType',name:'礼品分类'},
                    {field:'stockCount',name:'库存数量'},
                    {field:'price',name:'礼品单价'}
                ]
            },
            getSearch: function () {

                var deferred=$q.defer();
                //绑定查询接口
                $http.post(HOST+'/giftAllotted/getAllottedDicList',{})
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