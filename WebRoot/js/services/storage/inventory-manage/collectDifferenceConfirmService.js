/**
 * Created by xiaojiu on 2017/2/9.
 */
define(['../../../app'], function(app) {
    app.factory('collectDifferenceConfirm', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function() {
                return [{
                    field: 'pl4GridCount',
                    name: '序号',
                    type: 'pl4GridCount'
                },  {
                    field: 'supliers',
                    name: '供应商'
                },{
                    field: 'sku',
                    name: '商品编码'
                }, {
                    field: 'brand',
                    name: '商品品牌'
                }, {
                    field: 'model',
                    name: '规格型号'
                }, {
                    field: 'factoryCode',
                    name: '出厂编码'
                }, {
                    field: 'goodsName',
                    name: '商品名称'
                }, {
                    field: 'meaUnit',
                    name: '计量单位'
                }, {
                    field: 'chuHuoCount',
                    name: '应收数量'
                }, {
                    field: 'receCount',
                    name: '良品数量'
                }, {
                    field: 'different',
                    name: '差异数量'
                },{field:'bar',name:'操作',type:'operate',buttons:[{
                    text: '查看差异',
                    btnType: 'btn',
                    call: 'checkDetail',
                    openModal:'#editDate'
                }]}]
            },
            getBanner: function(data){
                data.param=$filter('json')(data.param);
                var deferred = $q.defer();

                $http.post(HOST + '/differentMonitor/query_differentDetail', data)
                    .success(function(data){
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e)
                    });
                return deferred.promise;
            },
            getDataTable: function(data) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                /*console.log(data)*/
                var deferred = $q.defer();
                $http.post(HOST + '/differentMonitor/update_recedifferent', data)
                    .success(function(data) {
                        // console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            getDataTableLook: function(data) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                /*console.log(data)*/
                var deferred = $q.defer();
                $http.post(HOST + '/ckTaskIn/getInGoodsDiffCountDetail', data)
                    .success(function(data) {
                        // console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            printCongirm: function(data){
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);

                var deferred=$q.defer();
                $http.post(HOST+'/pickGoodsTaskZdDetail/updatePrintStatus',data)
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