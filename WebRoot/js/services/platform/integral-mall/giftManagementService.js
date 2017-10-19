/**
 * Created by xuwusheng on 15/12/21.
 */
define(['../../../app'], function (app) {
    app.factory('giftManagement', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'sku',name:'礼品编码'},
                    {field:'giftName',name:'礼品名称'},
                    {field:'brand',name:'礼品品牌'},
                    {field:'giftType',name:'礼品分类'},
                    {field:'op',name:'操作',type:'operate',buttons:[{text:'修改',btnType:'btn',call:'updateGift',openModal:'#createGift'}]}
                ]
            },
            getSearch: function () {

                var deferred=$q.defer();
                //绑定查询接口
                $http.post(HOST+'/gift/getGiftTypeLists',{})
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
                       // console.log(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            }
        }
    }]);
});