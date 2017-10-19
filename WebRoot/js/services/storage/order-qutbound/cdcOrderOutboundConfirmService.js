/**
 * Created by xiaojiu on 2017/3/23.
 */
'use strict';
define(['../../../app'], function(app) {
  app.factory('cdcOrderOutboundConfirm', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
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
          field: 'goodsName',
          name: '商品名称'
        },{
          field: 'goodsStyle',
          name: '规格型号'
        }, {
          field: 'serialNumber',
          name: '出厂编码'
        }, {
          field: 'sku',
          name: '商品编码'
        },{
            field: 'goodsUnit',
            name: '计量单位'
        },{
          field: 'needCount',
          name: '商品数量'
        },{
            field: 'outGoodCount',
            name: '出库数量',
            id:'outGoodCount',
            call:'clearNoNum',
            input:true,
            style:"width:80px"
        }]
      },
      getSearch: function() {
        var deferred = $q.defer();
        $http.post(HOST + '/orderOutbound/getDetailDicLists',{})
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
        $http.post(HOST + url, data)
          .success(function(data) {
            deferred.resolve(data);
          })
          .error(function(e) {
            deferred.reject('error:' + e);
          });
        return deferred.promise;
      },
      getConfirmOutbound: function(data){
        data.param = $filter('json')(data.param);
        var deferred = $q.defer();
        $http.post(HOST + '/orderOutbound/confirmOutbound', data)
          .success(function(data){
            deferred.resolve(data)
          })
          .error(function(){
            deferred.reject(data)
          })
          return deferred.promise;
      }
    }

  }]);
});