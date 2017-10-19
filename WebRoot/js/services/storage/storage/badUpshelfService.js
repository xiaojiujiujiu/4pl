/**
 * Created by xiaojiu on 2017/2/6.
 */
define(['../../../app'], function(app) {
    app.factory('badUpshelf', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function() {
                return [{
                    type:'pl4GridCount',
                    name: '序号'
                },{
                    field: 'taskId',
                    name: '业务单号'
                }, {
                    field: 'orderID',
                    name: '客户单号'
                }, {
                    field: 'createTime',
                    name: '收货日期'
                }, {
                    field: 'customerName',
                    name: '客户'
                },
                //     {
                //     field: 'chuhTypeCount',
                //     name: '残损商品种类'
                // },
                    {
                    field: 'chuhGoodCount',
                    name: '残损上架数量'
                }, {
                    field: 'name11',
                    name: '操作',
                    type: 'operate',
                    style:'width:108px;',
                    buttons: [{
                        text: '上架',
                        btnType: 'link',
                        state: 'badconfirmation'
                    }, {
                        text: '打印',
                        btnType: 'btn',
                        call: 'print'
                    }, {
                        text: '查看',
                        btnType: 'link',
                        state: 'badUpLook'
                    }]
                }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST+'/badUpshelf/getSelects',{})
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            getDataTable: function(data) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST+'/badUpshelf/ckTaskPutList', data)
                    .success(function(data) {
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