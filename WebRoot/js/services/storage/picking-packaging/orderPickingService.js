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
define(['../../../app'], function (app) {
  app.factory('orderPicking', ['$http', '$q', '$filter', 'HOST', function ($http, $q, $filter, HOST) {
    return {
      getThead: function () {
        return [{
          check: true,
          checkAll: true
        }, {
          field: 'taskId',
          name: '业务单号'
        }, {
          field: 'orderId',
          name: '客户单号'
        }, {
          field: 'orderTypeId',
          name: '业务类型'
        }, {
          field: 'createTime',
          name: '订单日期'
        },{
          field: 'acceGoodCount',
          name: '商品数量'
        },{
          field: 'pickGoodsCount',
          name: '拣货数量'
        }, {
          field: 'op',
          name: '操作',
          type: 'operate',
          buttons: [{
            text: '打印',
            call: 'itemPrintCall',
            btnType: 'button',
            style: 'font-size:10px;'
          }, {
            text: '查看',
            btnType: 'link',
            state: 'pickingBillsLook'
          }, {
            text: '拣货登记',
            call: 'registerCall',
            openModal: '#register'
          }]
        }]
      },
      getOpenModelThHeader: function () {
        return [{ name: '序号', type: 'pl4GridCount' },
        { field: 'supliersName', name: '供应商' },
        { field: 'typeName', name: '商品品类' },
        { field: 'brandName', name: '商品品牌' },
        { field: 'modelName', name: '商品规格' },
        { field: 'goodsName', name: '商品名称' },
        { field: 'orderCount', name: '商品数量' },
        { field: 'unitName', name: '计量单位' },
        { field: 'huoWeiNo', name: '商品货位' },
        {
          field: 'goodsCount',
          name: '拣货数量',
          //verify:{min:1,max:'field',field:'orderCount'},
          //type:'number',
          //$verifyDisabled:{eq:'1,4,5,6,7,9',filed:'orderTypeId'},
          input: 'true',
          style: 'width:80px'
        }
        ]
      },
      getSearch: function () {
        var deferred = $q.defer();
        $http.post(HOST + '/pickGoodsTask/getDicLists', {})
          .success(function (data) {
            deferred.resolve(data);
          })
          .error(function (e) {
            deferred.reject('error:' + e);
          });
        return deferred.promise;
      },
      getDataTable: function (data, url) {
        //将parm转换成json字符串
        data.param = $filter('json')(data.param);

        var deferred = $q.defer();
        $http.post(HOST + (!url ? '/pickGoodsTask/queryPickGoodsList' : url), data)
          .success(function (data) {
            deferred.resolve(data);
          })
          .error(function (e) {
            deferred.reject('error:' + e);
          });
        return deferred.promise;
      },
      printCongirm: function (data) {
        //将parm转换成json字符串
        data.param = $filter('json')(data.param);

        var deferred = $q.defer();
        $http.post(HOST + '/pickGoodsTaskZdDetail/updatePrintStatus', data)
          .success(function (data) {
            deferred.resolve(data);
          })
          .error(function (e) {
            deferred.reject('error:' + e);
          });
        return deferred.promise;
      },
      getBatchDataTable: function (url, data) {
        //将parm转换成json字符串
        data.param = $filter('json')(data.param);
        var deferred = $q.defer();
        $http.post(HOST + url, data)
          .success(function (data) {
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