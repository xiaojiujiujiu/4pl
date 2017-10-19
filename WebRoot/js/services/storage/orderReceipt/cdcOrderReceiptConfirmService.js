/**
 * Created by xiaojiu on 2017/3/25.
 */
'use strict';
define(['../../../app'], function(app) {
    app.factory('cdcOrderReceiptConfirm', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
        return {
            getThead: function() {
                return [{
                    name:'序号',
                    type:'pl4GridCount'
                }, {
                    field: 'supplier',
                    name: '供应商'
                },{
                    field: 'brand',
                    name: '商品品牌'
                },{
                    field: 'name',
                    name: '商品名称'
                },{
                    field: 'goodsStyle',
                    name: '规格型号'
                }, {
                    field: 'serialNumber',
                    name: '出厂编码'
                }, {
                    field: 'goodsCode',
                    name: '商品编码'
                },{
                    field: 'goodsUnit',
                    name: '计量单位'
                },{
                    field: 'acceGoodCount',
                    name: '商品数量'
                },{
                    field: 'outCount',
                    name: '出库数量'
                },{
                    field: 'refuseCount',
                    name: '拒收数量',
                    input:true,
                    id:'refuseCount',
                    call:'clearNoNum',
                    maxlength:"4",
                    style:"width:80px"
                }]
            },
//            getSearch: function() {
//                var deferred = $q.defer();
//                $http.post(HOST + '/cdcReceiptOrder/returnReceiptOrder',{})
//                    .success(function(data) {
//                        deferred.resolve(data);
//                    })
//                    .error(function(e) {
//                        deferred.reject('error:' + e);
//                    });
//                return deferred.promise;
//            },
            getBanner: function(data,url) {
            	  data.param=$filter('json')(data.param);
	              var deferred = $q.defer();
	              $http.post(HOST + (!url?'/cdcReceiptOrder/getReceiptOrderBanner':url),data)
	                  .success(function(data) {
	                      deferred.resolve(data);
	                  })
	                  .error(function(e) {
	                      deferred.reject('error:' + e);
	                  });
	              return deferred.promise;
	          },
	         getSearch: function() {
	              var deferred = $q.defer();
	              $http.post(HOST + '/cdcReceiptOrder/getReceiptOrderDicLists',{})
	                  .success(function(data) {
	                      deferred.resolve(data);
	                  })
	                  .error(function(e) {
	                      deferred.reject('error:' + e);
	                  });
	              return deferred.promise;
	          },
            getDataTable: function(data,url) {
                //将parm转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
//              $http.post(HOST + url, data)
                $http.post(HOST + (!url?'/cdcReceiptOrder/getReceiptOrder':url), data)
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
        }

    }]);
});