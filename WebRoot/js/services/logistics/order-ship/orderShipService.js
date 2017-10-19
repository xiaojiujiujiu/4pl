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
    app.factory('orderShip', ['$http', '$q', '$filter', 'HOST', function ($http, $q, $filter, HOST) {
        return {
            getThead: function () {
                return [{
                    name: '序号',
                    type: 'pl4GridCount'
                }, {
                    field: 'taskId',
                    name: '业务单号'
                },
                {
                    field: 'orderType',
                    name: '业务类型'
                },{
                    field: 'receTel',
                    name: '联系电话'
                }, {
                    field: 'receAdd',
                    name: '配送地址'
                }, {
                    field: 'packBoxCount',
                    name: '应发箱数'
                }, {
                    field: 'boxCount',
                    name: '已扫描箱数'
                }, {
                    field: 'remarks',
                    name: '备注'
                }, {
                    type: 'operate',
                    name: '操作',
                    buttons: [
                        {text: '删除', call: 'deleteCall'}
                    ]
                }]
            },
            thirdDeliverHeader: function () {
                return [{
                    name: '序号',
                    type: 'pl4GridCount'
                }, {
                    field: 'taskId',
                    name: '业务单号'
                }, {
                    field: 'orderID',
                    name: '第三方单号',
                    pl4DataType:'number',
                    input: true,
                    style:'width:120px'
                }, {
                    field: 'recPhone',
                    name: '承运方',
                    type: 'select',
                    disable: true,
                    selected: 'recPhoneSelected'
                }, {
                    field: 'recAddress',
                    type: 'select',
                    selected: 'recAddressSelected',
                    name: '计费方式'
                }, {
                    field: 'packBoxCount',
                    name: '运费',
                    input: true,
                    pl4DataType:'float',
                    style:'width:60px'
                }, {
                    field: 'boxCount',
                    type: 'select',
                    selected: 'boxCountSelected',
                    name: '结算方式',
                    selectChange:'boxCountChange'
                }/*, {
                    type: 'operate',
                    name: '操作',
                    buttons: [
                        {text: '删除', call: 'thirdDeliverDeleteCall'}
                    ]
                }*/]
            },
            getSearch: function (data) {
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + '/orderDelivery/getDicLists', data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            getDataTable: function (data, url) {
                //将param转换成json字符串
                data.param = $filter('json')(data.param);
                var deferred = $q.defer();
                $http.post(HOST + (!url ? '/orderDelivery/queryOrderDelivery' : url), data)
                    .success(function (data) {
                        // console.log(data)
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            setThirdDeliverGrid: function (query, grid, carrier) {
                var results = [];
                angular.forEach(grid, function (item) {

                    results.push({
                        id:item.id,
                        taskId: item.taskId,
                        orderID: '',
                        recPhone: carrier,
                        recAddress: query.billingType,
                        packBoxCount: '',
                        boxCount: query.clearType,

                        //设置下拉框默认选中
                        recPhoneSelected:carrier[0].id,
                        recAddressSelected:-1,
                        boxCountSelected:-1
                    });
                });
                return results;
            }
        }

    }]);
});