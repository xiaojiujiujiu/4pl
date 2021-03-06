
'use strict';
define(['../../../app'], function (app) {
    app.factory('refuseOrderOutCkConfirm', ['$http', '$q', '$filter', 'HOST', function ($http, $q, $filter, HOST) {
        return {
            getThead: function () {
            return [{field: 'pl4GridCount',
                name: '序号',
                type: 'pl4GridCount'}, {
                field: 'taskId',
                name: '业务单号'
              }, {
                  field: 'acceGoodCount',
                  name: '应出件数'
                }, {
                field: 'realcount',
                name: '实出件数'
              }, {
                field: 'chuHName',
                name: '发件方'
              }, {
                field: 'chuHTel',
                name: '发件方电话'
              }, {
                field: 'receiverName',
                name: '收件方'
              }, {
                field: 'receTel',
                name: '收件方电话'
              },  {
                  field: 'receAdd',
                  name: '收件方地址'
                },{field:'origTypeCount',name:'操作',type:'operate',
                buttons:[
                    {text:'删除',call:'deleteCall'}
                ]
            }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/personalOrder/getOutDicList',{})
                  .success(function(data) {
                    deferred.resolve(data);
                  })
                  .error(function(e) {
                    deferred.reject('error:' + e);
                  });
                return deferred.promise;
              },
            getDataTable: function (data, url) {
                //将param转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + (!url ? '/returnPersonalOrder/RequeryRefuseOutGoods' : url), data)
                    .success(function (data) {
                        // console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            deliverOrderConfrim: function (url,data) {
                //将param转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + (!url ? '/personalOrder/OrderconfirmOutCk' : url), data)
                    .success(function (data) {
                        // console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            }
            
        }

    }]);
});