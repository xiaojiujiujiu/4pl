/**
 * author wusheng.xu
 * date 16/4/12
 */
define(['../../../app'], function (app) {
    app.factory('storageAccountManage', ['$http', '$q', '$filter', '$sce', 'HOST', function ($http, $q, $filter, $sce, HOST) {
        return {
            getThead: function () {
                return [
                    {name: '序号', type: 'pl4GridCount'},
                    {field: 'userName', name: '账号持有人'},
                    {field: 'userTel', name: '联系电话'},
                    {field: 'userPosition', name: '公司职位'},
                    {field: 'account', name: '平台账号'},
                    //{field: 'password', name: '平台密码'},
                    {
                        field: 'origTypeCount', name: '操作', type: 'operate',
                        buttons: [
                            {text: '修改', btnType: 'btn', call: 'updateStorage', openModal: '#addStorageModal'},{text:'|'},
                            {text: '删除', call: 'storageDeleteCall'},{text:'|'},
                            {text: '重置密码', call: 'resetPwd'}
                        ]
                    },
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
        };
    }]);
});