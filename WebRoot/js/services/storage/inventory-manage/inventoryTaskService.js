/**
 * author wusheng.xu
 * date 16/4/19
 */
define(['../../../app'], function (app) {
    app.factory('inventoryTask', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'#',type:'pl4GridCount'},
                    {field:'taskId',name:'盘点单号'},
                    {field:'createTime',name:'盘点日期'},
                    {field:'inventoryType',name:'盘点方式'},
                    {field:'inventoryStatus',name:'盘点状态'},
                    {field:'name11',name:'操作',type:'operate',buttons:[{
                        text: '打印',
                        btnType: 'btn',
                        call:'print'
                    },{
                        text: '录入',
                        btnType:'link',
                        state:'inventoryEntry',
                    },{
                        text: '查看',
                        btnType: 'link',
                        state: 'inventoryDetails'
                        //openModal:'#alloModal'
                    }]}]
            },
            getQuery: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/ckInventory/getDicLists',{})
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
                $http.post(HOST+(!url?'/ckInventory/ckInventoryList':url),data)
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