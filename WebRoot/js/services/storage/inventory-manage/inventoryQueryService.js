/**
 * Created by hui.sun on 15/12/10.
 */

/**
 * 4pl Grid   thead配置
 * check:true //使用checkbox 注(选中后对象中增加pl4GridCheckbox.checked:true)
 *  checkAll:true //使用全选功能
 * field:’id’  //字段名（用于绑定）
 * name:’序号’  //表头标题名
 * link:{
 * 		url:’/aaa/{id}’ //a标签跳转 {id}为参数 (与click只存在一个)
 * 		click:’test’  //点击事件方法 参数test(index(当前索引),item(当前对象))
 * 	}
 * input:true  //使用input   注(不设置默认普通文本)
 * type:text  //与input一起使用  注(type:operate为操作项将不绑定field,与按钮配合使用)
 * buttons:[{
 * 			text:’收货’, //显示文本
 * 			call:’tackGoods’, //点击事件 参数tackGoods(index(当前索引),item(当前对象))
 * 			type:’link  button’ //类型 link:a标签 button:按钮
 * 		    state:'checkstorage', //跳转路由	注（只有当后台传回按钮数据op.butType=link 才会跳转）
 * 			style:’’ //设置样式
 * 	}] //启用按钮 与type:operate配合使用 可多个按钮
 * style:’width:10px’  //设置样式
 *
 */
'use strict';
define(['../../../app'], function(app) {
  app.factory('inventoryQuery', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
    return {
      getThead: function() {
        return [{
          field: 'pl4GridCount',
          name: '序号',
          type: 'pl4GridCount'
        }, {
            field: 'ckName',
            name: '仓库'
        },{
            field: 'updateTime',
            name: '库存更新日期'
        },{
              field: 'supliers',
              name: '供应商'
        },{
          field: 'customer',
          name: '客户'
        }, {
          field: 'sku',
          name: '商品编码'
        }, {
          field: 'goodsType',
          name: '品类'
        }, {
          field: 'brand',
          name: '商品品牌'
        }, {
          field: 'goodsName',
          name: '商品名称'
        }, {
          field: 'model',
          name: '型号'
        }, {
          field: 'meaUnit',
          name: '计量单位'
        }, {
          field: 'factoryCode',
          name: '出厂编码'
        }, /*{
          field: 'lowStock',
          name: '安全库存'
        },  {
            field: 'highStock',
            name: '库存上限'
          },*/ {
          field: 'factStock',
          name: '实际库存'
        },{
            field: 'kyStock',
            name: '可用库存'
          },
        {
            field: 'damageStock',
            name: '残损品库存'
        },
        //  {
        //  field: 'ckId',
        //  name: '隐藏列'
        //},
          //{
        //   field: 'state',
        //   name: '库存状态'
        // },
          {
          field: 'sentCounts',
          name: '在途数量'
        }, {
          field: 'djStock',
          name: '冻结数量'
        },
        {
            field: 'cost',
            name: '库存成本'
          }
          , {
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
        $http.post(HOST + '/inventoryMonitor/getDicLists',{})
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