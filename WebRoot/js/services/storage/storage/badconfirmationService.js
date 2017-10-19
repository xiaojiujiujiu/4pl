/**
 * Created by xiaojiu on 2017/2/6.
 */
define(['../../../app'], function(app) {
    app.factory('badconfirmation', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function() {
                return [{
                    check: true,
                    checkAll: true
                },{
                    field: 'supliersName',
                    name: '供应商'
                },{
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
                },{
                    field: 'putCount',
                    name: '上架数量',
                    type: 'text',
                    verify:{eq:'field',field:'chuhGoodCount'},
                    blur: 'actualQuantityBlur'
                },{
                    field: 'operation',
                    name: '操作',
                    type: 'operate',
                    buttons: [{
                        text: '设置货位',
                        call:'goodsAlloCall',
                        openModal:'#goodsAlloModal'
                    }]
                }]
            },
            getDataTable: function(data,url) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + (!url? '/badUpshelf/ckTaskPutDetailList':url), data)
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