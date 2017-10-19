
'use strict';
define(['../../../app'], function(app) {
  app.factory('cdcOrderQutbound', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
    return {
      getThead: function() {
        return [{
        	name:'序号',type:'pl4GridCount'
        }, {
          field: 'taskId',
          name: '业务单号'
        },{
          field: 'orderId',
          name: '客户单号'
        }, {
          field: 'orderTypeName',
          name: '业务类型'
        }, {
          field: 'receiverName',
          name: '收货方'
        },{
            field: 'createTime',
            name: '订单日期'
          },{
          field: 'acceGoodCount',
          name: '订单商品数量'
        }, {
          field: 'op',
          name: '操作',
          type: 'operate',style:'width:50px;',
          buttons: [{
            text: '打印',
            btnType: 'btn',
            call:'print',
            style: 'font-size:10px;'
          },
          {
              text: '出库',
              btnType: 'link',
              state:'cdcOrderOutboundConfirm',
              style: 'font-size:10px;'
            },
            {
              text: '查看',
              btnType: 'link',
              state:'cdcOrderOutboundLook',
              style: 'font-size:10px;'
            }
          ]
        }]
      },
      getThead2: function() {
        return [{
          name:'序号',type:'pl4GridCount'
        }, {
          field: 'taskId',
          name: '业务单号'
        },{
          field: 'orderId',
          name: '客户单号'
        }, {
          field: 'orderTypeName',
          name: '业务类型'
        }, {
          field: 'receiverName',
          name: '收货方'
        },{
          field: 'createTime',
          name: '订单日期'
        },{
          field: 'outGoodsTime',
          name: '出库日期'
        },{
          field: 'acceGoodCount',
          name: '订单商品数量'
        },{
          field: 'acceGoodCount',
          name: '出库数量'
        }, {
          field: 'op',
          name: '操作',
          type: 'operate',style:'width:50px;',
          buttons: [{
            text: '打印',
            btnType: 'btn',
            call:'print',
            style: 'font-size:10px;'
          },
            {
              text: '查看',
              btnType: 'link',
              state:'cdcOrderOutboundLook',
              style: 'font-size:10px;'
            }
          ]
        }]
      },
      /*, {
            text: '确认出库',
            btnType: 'button',
            call:'confirmOutboundCall',
            openModal:'#confirmOutbound'
          }*/
      getSearch: function(data) {
    	  data.param = $filter('json')(data.param);
        var deferred = $q.defer();
        $http.post(HOST + '/outGoodsOrder/getDicLists',data)
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
        $http.post(HOST + '/outGoodsOrder/outGoodsOrderList', data)
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