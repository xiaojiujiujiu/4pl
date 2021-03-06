/**
 * author wusheng.xu
 * date 16/4/19
 */
define(['../../../app'], function (app) {
    app.factory('deliverPutStorage', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getTab1ThHeader1: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'relationTaskId',name:'业务单号'},
                    {field:'orderID',name:'客户单号'},
                    {field:'receAdd',name:'配送地址'},
                    {field:'acceGoodCount',name:'箱数',input:true,style:'width:80px;text-align:center'},
                    {field:'remarks',name:'备注'},
                ]
            },
            getTab1ThHeader2: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'orderID',name:'客户单号'},
                    {field:'receAdd',name:'地址'},
                    {field:'boxCount',name:'箱数'},
                    {field:'scanBoxCount',name:'已扫描箱数'},
                    {field:'remarks',name:'备注'}
                ]
            },
            getTab2ThHeader1: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'relationTaskId',name:'业务单号'},
                    {field:'orderID',name:'客户单号'},
                    {field:'receAdd',name:'配送地址'},
                    {field:'acceGoodCount',name:'箱数'},
                    {field:'remarks',name:'备注'},
                ]
            },
            getTab2ThHeader2: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'orderID',name:'客户单号'},
                    {field:'receAdd',name:'地址'},
                    {field:'boxCount',name:'箱数'},
                    {field:'scanBoxCount',name:'已扫描箱数'},
                    {field:'remarks',name:'备注'}
                ]
            },
            getDataTable: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+url,data)
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