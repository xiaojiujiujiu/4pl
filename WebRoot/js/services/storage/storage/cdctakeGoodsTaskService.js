/**
 * Created by xuwusheng on 15/11/16.
 *
 * 4pl Grid   thead配置
 * check:true //使用checkbox 注(选中后对象中增加pl4GridCheckbox.checked:true)
 * checkAll:true //使用全选功能
 * field:’id’  //字段名（用于绑定）
 * name:’序号’  //表头标题名
 * link:{
 * 		url:’/aaa/{id}’ //a标签跳转 {id}为参数 (与click只存在一个)
 * 		click:’test’  //点击事件方法 参数test(index(当前索引),item(当前对象))
 * 	}
 * input:true  //使用input   注(不设置默认普通文本)
 * type:text  //与input一起使用  注(type:operate为操作项将不绑定field,与按钮配合使用,type:pl4GridCount表示序号列将会自动累加数字)
 * buttons:[{
 * 			text:’收货’, //显示文本
 * 			call:’tackGoods’, //点击事件 参数tackGoods(index(当前索引),item(当前对象))
 * 			type:’link  button’ //类型 link:a标签 button:按钮
 * 		    state:'checkstorage', //跳转路由	注（只有当后台传回按钮数据op.butType=link 才会跳转）
 * 		    openModal:'#myModal', //打开模态框id
 * 			style:’’ //设置样式
 * 	}] //启用按钮 与type:operate配合使用 可多个按钮
 * style:’width:10px’  //设置样式
 * verify:{min:0,max:'field',field:'count'} //验证 {min:0|'field'(最小值或根据字段判断),max:10|'field'(最大值或根据字段判断),field:字段名}
 *
 */
'use strict';
define(['../../../app'], function (app) {
    app.factory('cdcTakeGoods', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
              return [
                  {name:'序号',type:'pl4GridCount'},
                  {field:'taskId',name:'业务单号'},
                  {field:'orderId',name:'客户单号'},
                  {field:'orderTypeName',name:'业务类型'},
                  {field:'chuHuoName',name:'发货方'},
                  {field:'createTime',name:'订单日期'},
                  {field:'acceGoodCount',name:'订单商品数量'},
                  {field:'goodsCount',name:'应收数量'},
                  {field:'name11',name:'操作',type:'operate',style:'width:108px;',buttons:[{text:'收货',btnType:'link',state:'cdccheckstorage'},{text:'查看',btnType:'link',state:'cdctakegoodsconfirm'},{text:'打印',btnType:'btn',call:'print'}]}]//{text:'货位',call:'goodsAlloCall',openModal:'#goodsAlloModal'},{text:'确认',call:'enterGoodsAllo'}
            },
            getThead2: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号',link:{url:'#/main/cdctakegoodsconfirm/{taskId}',click:'test'}},
                    {field:'orderId',name:'客户单号'},
                    {field:'orderTypeName',name:'业务类型'},
                    {field:'chuHuoName',name:'发货方'},
                    {field:'createTime',name:'订单日期'},
                    {field:'inGoodsDate',name:'收货日期'},
                    {field:'acceGoodCount',name:'订单商品数量'},
                    {field:'goodsCount',name:'应收数量'},
                    {field:'inCount',name:'实收数量'},
                    {field:'name11',name:'操作',type:'operate',style:'width:108px;',buttons:[{text:'查看',btnType:'link',state:'cdctakegoodsconfirm'},{text:'打印',btnType:'btn',call:'print'}]}]//{text:'货位',call:'goodsAlloCall',openModal:'#goodsAlloModal'},{text:'确认',call:'enterGoodsAllo'}
            },
            getSearch: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/inGoodsOrder/getDicLists',{})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getDataTable: function (data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+'/inGoodsOrder/inGoodsOrderList',data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                       deferred.reject('error:'+e);
                    });
                return deferred.promise;
            }
        }

    }]);
});