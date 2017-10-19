/**
 * Created by hui.sun on 15/12/13.
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
  app.factory('itemUpshelf', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
    return {
      getThead: function() {
        return [{
          type:'pl4GridCount',
          name: '序号'
        }, {
          field: 'taskId',
          name: '业务单号'
        }, {
            field: 'orderID',
            name: '客户单号'
        }, {
          field: 'createTime',
          name: '收货日期'
        }, {
          field: 'customerName',
          name: '客户'
        }, {
          field: 'createUser',
          name: '收货人'
        },{
          field: 'chuhGoodCount',
          name: '上架数量',
          //input: true,
          //style: 'width:40px;text-align:center;',
          //type: 'text',
          //blur: 'origGoodCountBlur'
        }/*, {
          field: 'putDiffCount',
          name: '差异'
        }*/, {
          field: 'name11',
          name: '操作',
          type: 'operate',
          style:'width:108px;',
          buttons: [{
            text: '上架',
            btnType: 'link',
            state: 'confirmation'
          }, {
            text: '打印',
            btnType: 'btn',
            call: 'print'
          }, {
            text: '查看',
            btnType: 'link',
            state: 'confirmationCheck'
          }]
        }]
      },
      getSearch: function() {
        var deferred = $q.defer();
        $http.post(HOST+'/ckTaskPut/getSelects',{})
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
        $http.post(HOST+'/ckTaskPut/ckTaskPutList', data)
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