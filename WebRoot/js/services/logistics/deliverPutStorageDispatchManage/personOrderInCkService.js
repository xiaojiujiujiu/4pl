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
  app.factory('personOrderInCk', ['$http', '$q', '$filter', 'EHOST', function($http, $q, $filter, EHOST) {
    return {
      getThead: function() {
        return [ { field: 'pl4GridCount',
            name: '序号',
            type: 'pl4GridCount'
        }, {
          field: 'taskId',
          name: '业务单号'
        }, {
            field: 'stockTaskId',
            name: '分拨入库单号'
        }, {
          field: 'inGoodsTime',
          name: '入库时间'
        }, {
            field: 'distributionType',
            name: '配送类型'
        }, {
          field: 'inGoodsStatus',
          name: '入库状态'
        }, {
          field: 'chuHuoName',
          name: '发件方'
        }, {
          field: 'chuHTel',
          name: '发件方电话'
        },{
             field: 'acceGoodCount',
             name: '应收件数'
          },{
            field: 'realcount',
            name: '实收件数'
        },{
              field: 'pay',
              name: '运费'
          },{
               field: 'collectMoney',
               name: '代收货款'
            },{field:'origTypeCount',name:'操作',type:'operate',
            buttons:[
                {text:'查看',btnType:'btn',call:'lookCall', openModal: '#lookCall'},
                {text:'打印',btnType:'btn',call:'print'}
            ]
        }]
      },
        getOpenModelThHeader: function () {
            return [{ name: '序号', type: 'pl4GridCount' },
                { field: 'taskId', name: '业务单号' },
                { field: 'createWlDeptName', name: '出库配送中心' },
                { field: 'chuHuoName', name: '发件方' },
                { field: 'chuHTel', name: '发件方电话' },
                { field: 'receiverName', name: '收件方' },
                { field: 'receTel', name: '收件方电话' },
                { field: 'receAdd', name: '收件方地址' },
                { field: 'payType', name: '结算方式' },
                { field: 'pay', name: '运费' },
                { field: 'acceGoodCount', name: '应收件数' },
                { field: 'realcount', name: '实收件数' },
                { field: 'collectMoney', name: '代收货款' },
            ]
        },
      getSearch: function() {
        var deferred = $q.defer();
        $http.post(EHOST + '/personalOrder/getConfirmInDicList',{})
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
        $http.post(EHOST + '/personalOrder/queryConfirmInGoods', data)
          .success(function(data) {
            // console.log(data)
            deferred.resolve(data);
          })
          .error(function(e) {
            deferred.reject('error:' + e);
          });
        return deferred.promise;
      },
      deliverOrderConfrim: function(url,data) {
          //将parm转换成json字符串
          data.param = $filter('json')(data.param);
          var deferred = $q.defer();
          $http.post(EHOST + url, data)
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