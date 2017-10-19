/**
 * Created by xiaojiu on 2017/5/6.
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
  app.factory('createOrder', ['$http', '$q', '$filter', 'HOST', function($http, $q, $filter, HOST) {
    return {
      getThead: function() {
        return [{
          type: 'input',
            check:true,
            checkAll:true
        }, {
          field: 'taskId',
          name: '业务单号'
        }, {
            field: 'waybillId',
            name: '运单号'
          },{
          field: 'createTime',
          name: '创建时间'
        },
        //    {
        //  field: 'wlStatu',
        //  name: '订单状态'
        //},
            {
          field: 'chuHuoName',
          name: '发件方'
        }, {
            field: 'senderNumber',
            name: '发件方编号'
        }, {
          field: 'chuHTel',
          name: '发件人电话'
        }, {
          field: 'receiverName',
          name: '收件方'
        }, {
          field: 'receTel',
          name: '收件人电话'
        },{
             field: 'acceGoodCount',
             name: '件数',
          },{
              field: 'pay',
              name: '运费',
          },{
              field: 'payType',
              name: '结算方式'
          },{
              field: 'paySide',
              name: '运费付费方'
            },{
               field: 'collectMoney',
               name: '代收货款'
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
          field: 'name11',
          name: '操作',
          type: 'operate',
          buttons: [{
            text: '确认收货',
            call:'confirmInCk'
          },{
              text: '修改',
              btnType: 'btn',
              call:'updateOperation',
              openModal:'#addCar'
            }, {
              text: '作废',
              openModal:'#deleteCar',
              call: 'obtainId',
            },{
            text: '查看',
            btnType: 'btn',
            call: 'lookCar',
            openModal:'#lookCar'
          },{
              text:'打印配送单', btnType: 'button',call: 'print'
          },{
              text:'打印箱单', btnType: 'button',call: 'printBox'
          }]
        }]
      }, getTheadChange: function() {
            return [{
                field: 'pl4GridCount',
                name: '序号',
                type: 'pl4GridCount'
            }, {
                field: 'taskId',
                name: '业务单号'
            }, {
                field: 'createTime',
                name: '创建时间'
            }, {
                field: 'wlStatu',
                name: '订单状态'
            }, {
                field: 'chuHuoName',
                name: '发件方'
            },{
                field: 'senderNumber',
                name: '发件方编号'
            } ,{
                field: 'chuHTel',
                name: '发件人电话'
            }, {
                field: 'receiverName',
                name: '收件方'
            }, {
                field: 'receTel',
                name: '收件人电话'
            }, {
                field: 'frequency',
                name: '班次'
              },
            //    {
            //    field: 'shouhuoState',
            //    name: '收货状态'
            //},
                {
                field: 'acceGoodCount',
                name: '件数',
            },{
                field: 'pay',
                name: '运费',
            },{
                    field: 'pay',
                    name: '实收运费',
                },{
                field: 'payType',
                name: '结算方式'
            },{
                field: 'paySide',
                name: '运费付费方'
            },{
                field: 'collectMoney',
                name: '代收货款'
            },{
                    field: 'collectMoney',
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
            },
                {
                    field: 'distributionWay',
                    name: '配送方式'
                },{
                    field: 'fBdistributionWay',
                    name: '调拨方式'
                },
                //{
                //    field: 'distributionType',
                //    name: '配送类型'
                //},
                {
                    field: 'auditStatus',
                    name: '审核状态'
                },
                {
                field: 'name11',
                name: '操作',
                type: 'operate',
                buttons: [{
                    text: '查看',
                    btnType: 'btn',
                    call: 'lookCar',
                    openModal:'#lookCar'
                },{
                    text: '外单修改',
                    btnType: 'btn',
                    call: 'modification'
                },{
                    text:'打印配送单', btnType: 'button',call: 'print'
                },{
                    text:'打印箱单', btnType: 'button',call: 'printBox'
                }]
            }]
        },
      getSearch: function() {
        var deferred = $q.defer();
        $http.post(HOST + '/personalOrder/getDicList',{})
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
        $http.post(HOST + '/personalOrder/queryPersonalOrder', data)
          .success(function(data) {
            // console.log(data)
            deferred.resolve(data);
          })
          .error(function(e) {
            deferred.reject('error:' + e);
          });
        return deferred.promise;
      },
      confirmInCk: function(data,url) {
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
        deletePersonOrder: function(data,url) {
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
          }
    }

  }]);
});