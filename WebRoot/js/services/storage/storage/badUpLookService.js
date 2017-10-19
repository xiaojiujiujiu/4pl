/**
 * Created by xiaojiu on 2017/2/6.
 */
define(['../../../app'], function(app) {
    app.factory('badUpLook', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function() {
                return [{
                    field: 'supliersName',
                    name: '供应商'
                }, {
                    field: 'sku',
                    name: '商品编码'
                }, {
                    field: 'brandName',
                    name: '商品品牌'
                }, {
                    field: 'modelName',
                    name: '规格型号'
                }, {
                    field: 'goodsName',
                    name: '商品名称'
                }, {
                    field: 'unitName',
                    name: '计量单位'
                }, {
                    field: 'chuhGoodCount',
                    name: '上架数量'
                }, {
                    field: 'operation',
                    name: '操作',
                    type: 'operate',
                    buttons: [{
                        text: '查看',
                        call:'alloModalCall',
                        openModal:'#alloModal'
                    }]
                }]
            },
            getAllTHeader: function () {
                return [{
                    field: 'pl4GridCount', name: '序号', type: 'pl4GridCount'
                }, {
                    field: 'huoWeiNo',
                    name: '货位编号'
                }, {
                    field: 'putCount',
                    name: '数量'
                }];
            },
            getDataTable: function(data,url) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + (!url? '/badUpshelf/ckTaskPutDetailView':url), data)
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