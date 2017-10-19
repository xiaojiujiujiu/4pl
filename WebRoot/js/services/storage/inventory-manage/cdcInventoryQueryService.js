
'use strict';
define(['../../../app'], function(app) {
  app.factory('cdcInventoryQuery', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
    return {
      getThead: function() {
        return [{
          field: 'pl4GridCount',
          name: '序号',
          type: 'pl4GridCount'
        }, {
          field: 'product',
          name: '品类'
        }, {
          field: 'brand',
          name: '品牌'
        },{
            field: 'updateTime',
            name: '库存更新日期'
        },{
              field: 'supplier',
              name: '供应商'
        },{
            field: 'goodsStyle',
            name: '规格型号'
        },{
            field: 'name',
            name: '商品名称'
        },{
          field: 'serialNumber',
          name: '出厂编码'
        }, {
          field: 'goodsCode',
          name: '商品编码'
        }, {
          field: 'goodsUnit',
          name: '计量单位'
        }, {
          field: 'totalStock',
          name: '合计'
        }, {
          field: 'availableStock',
          name: '可用库存'
        },{
          field: 'damageStock',
          name: '残损品库存'
        },{
            field: 'inwayQuantity',
            name: '在途数量'
          },
        {
            field: 'lockedStock',
            name: '冻结数量'
        },
        {
            field: 'cost',
            name: '库存成本'
        }
        ,{
          field: 'name11',
          name: '操作',
          type: 'operate',style:'width:50px;',
          buttons: [{
            text: '日志',
            call: 'logModalCall',
            btnType: 'button',
            style: 'font-size:10px;'
          }]
        }]
      },
      getLogThead: function(){
      	return [{
          field: 'pl4GridCount',
          name: '序号',
          type: 'pl4GridCount'
        },{
          field: 'changeType',
          name: '操作描述'
        }, {
          field: 'opUser',
          name: '操作人'
        }, {
          field: 'taskType',
          name: '变更原因'
        },{
            field: 'taskId',
            name: '关联业务单号'
          },  {
            field: 'beforeStock',
            name: '变更前库存数量'
          },  {
          field: 'changeCount',
          name: '变更数量'
        }, {
          field: 'afterStock',
          name: '变更后库存数量'
        }, {
          field: 'opTime',
          name: '操作时间'
        }]
      },
      getSearch: function() {
        var deferred = $q.defer();
        $http.post(HOST + '/cdcStockMonitor/getDicLists',{})
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