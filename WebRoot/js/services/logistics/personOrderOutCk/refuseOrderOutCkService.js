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
define(['../../../app'], function (app) {
    app.factory('refuseOrderOutCk', ['$http', '$q', '$filter', 'HOST', function ($http, $q, $filter, HOST) {
        return {
            getThead: function () {
            return [{field: 'pl4GridCount',
                name: '序号',
                type: 'pl4GridCount'}, {
                field: 'taskId',
                name: '业务单号'
              }, {
                  field: 'updateTime',
                  name: '订单时间'
                }, {
                field: 'wlStatu',
                name: '订单状态'
              }, {
                field: 'chuHuoName',
                name: '发件人'
              }, {
                field: 'chuHTel',
                name: '发件人电话'
              }, {
                field: 'receiverName',
                name: '收件人'
              }, {
                field: 'receTel',
                name: '收件人电话'
              },  {
                  field: 'receAdd',
                  name: '收件人地址'
                },{
                    field: 'realpay',
                    name: '运费'
                },{

                    field: 'acceGoodCount',//acceGoodCount
                    name: '件数'
                 },{
                    field: 'payType',
                    name: '结算方式'
                }, {
                     field: 'realcollectMoney',
                     name: '代收货款'
                  }]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST + '/personalOrder/getRefuseOutDicList',{})
                  .success(function(data) {
                    deferred.resolve(data);
                  })
                  .error(function(e) {
                    deferred.reject('error:' + e);
                  });
                return deferred.promise;
              },
            getDataTable: function (data, url) {
                //将param转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + (!url ? '/personalOrder/queryRefuseOutGoods' : url), data)
                    .success(function (data) {
                        // console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            deliverOrderConfrim: function (url,data) {
                //将param转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + (!url ? '/personalOrder/confirmQueryRefuseOutGoods' : url), data)
                    .success(function (data) {
                        // console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            }
            
        }

    }]);
});