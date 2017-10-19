
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
  app.factory('receiptPerOrder', ['$http', '$q', '$filter', 'EHOST', function($http, $q, $filter, EHOST) {
    return {
      getThead: function() {
        return [ {name: '选择',check:true,checkAll:true},{
          field: 'taskId',
          name: '业务单号'
        }, {
          field: 'createTime',
          name: '创建时间'
        }, {
            field: 'auditStatus',
            name: '审核状态'
        }, {
          field: 'wlStatu',
          name: '订单状态'
        }, {
            field: 'userName',
            name: '配送员'
          }, {
          field: 'chuHuoName',
          name: '发件方'
        },{
          field: 'receiverName',
          name: '收件方'
        }, {
              field: 'payType',
              name: '结算方式'
          },  {
              field: 'paySide',
              name: '运费付费方'
            },{
                field: 'pay',
                name: '运费'
            },{
            field: 'receiptsCarriage',
            name: '实收运费'
              },{
                field: 'acceGoodCount',
                name: '件数'
             } ,
            {
            field: 'realcount',
            name: '实出件数'
        },
            {
               field: 'collectMoney',
               name: '代收货款'
            },{
            field: 'collectionCarriage',
            name: '实收代收货款'
        },{
                field: 'fee',
                name: '代收款手续费'
            },{
                field: 'offerMoney',
                name: '保价金额'
            },{
                field: 'insuranceMoney',
                name: '保价费'
            }, {
                field: 'fBdistributionWay',
                name: '配送方式'
            }
           , {
          field: 'name11',
          name: '操作',
          type: 'operate',
          buttons: [{
              text: '再派',
              btnType: 'btn',
             call:'obtainTaskid',
              openModal:'#sendOrder'
          },{
            text: '外单修改',
              call: 'obtainTaskid',
              openModal:'#compileData'
          },{
              text: '拒收',
              btnType: 'btn',
              call:'refuseOrder',
              openModal:'#refuseOrder'
            },{
              text: '半签半退',
              call:'halfRefuseOrder',
              openModal:'#halfRefuseOrder'
          }]
        }]
      },

      getSearch: function() {
        var deferred = $q.defer();
        $http.post(EHOST + '/personalOrder/getReceiptDicList',{})
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
        $http.post(EHOST + '/personalOrder/getRecieptOrderList', data)
          .success(function(data) {
            // console.log(data)
            deferred.resolve(data);
          })
          .error(function(e) {
            deferred.reject('error:' + e);
          });
        return deferred.promise;
      },
      refuseOrder: function(data,url) {
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
        },
        receiptOrder: function(url,data) {
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
          },
        halfRefuseOrder: function(data,url) {
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