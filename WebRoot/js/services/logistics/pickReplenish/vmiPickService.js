/**
 * author wusheng.xu
 * date 16/4/15
 */
define(['../../../app'], function(app) {
    app.factory('vmiPick', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function() {
                return [{
                    check:true,
                    checkAll:true
                }, {
                    field: 'taskId',
                    name: '取货单号'
                }, {
                    field: 'createTime',
                    name: '订单日期'
                }, {
                    field: 'chuHAdd',
                    name: '取货地址'
                }, {
                    field: 'boxCount',
                    name: '箱数'
                }, {
                    field: 'remarks',
                    name: '备注'
                }, {
                    field: 'printState',
                    name: '状态'
                }, {
                    field: 'operation',
                    type:'operate',
                    buttons:[{
                        text:'打印',
                        bntType:'btn',
                        state:'',
                        call: 'print'
                    }],
                    name: '操作'
                }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/returnPickQuery/getVMIDicLists',{})
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            getDataTable: function(url, data) {
                //将param转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + url, data)
                    .success(function(data) {
                        // console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            }
        }
    }]);
});