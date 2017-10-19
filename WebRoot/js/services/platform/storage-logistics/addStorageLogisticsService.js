/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app'], function (app) {
    app.factory('addStorageLogistics', ['$http','$q','$filter','$sce','HOST',function ($http,$q,$filter,$sce,HOST) {
        return {
            getThead0: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'code',name:'子运营编号'},
                    {field:'name',name:'子运营名称'},
                    {field:'managerAreas',name:'管理区域'},
                    {field:'address',name:'子运营地址'},
                    {field:'connector',name:'子运营负责人'},
                    {field:'phone',name:'联系方式'},
                    {field:'name11',name:'操作',type:'operate',buttons:[{text:'修改',btnType:'btn',call:'updateOperation',openModal:'#addOperationModal'},{text:'冻结',btnType:'btn',call:'freezeOperation'},{text:'恢复',btnType:'btn',call:'restoreOperation'}]}
                ]
            },
            getThead1: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'ckCode',name:'仓库编号'},
                    {field:'partyName',name:'所属运营'},
                    {field:'ckName',name:'仓库名称'},
                    {field:'ckType',name:'仓库类型'},
                    {field:'address',name:'仓库地址'},
                    {field:'acreage',name:'面积'},
                    {field:'rent',name:'仓库租金(元/月)'},
                    {field:'payType',name:'付款方式'},
                    {field:'leaseTime',name:'租期'},
                    {field:'signDate',name:'签约日期'},
                    {field:'contractPeriod',name:'合同期限'},
                    {field:'signState',name:'签约状态'},
                    {field:'cooperationType',name:'模式'},
                    {field:'ckFacilitator',name:'仓储服务商'},
                    {field:'deliveryFacilitator',name:'配送服务商'},
                    {field:'bindGarageAmount',name:'绑定汽修厂数量(家)'},
                    {field:'remarks',name:'备注'},
                    {field:'name11',name:'操作',type:'operate',buttons:[{text:'修改',btnType:'btn',call:'updateStorage',openModal:'#addStorageModal'},{text:'冻结',btnType:'btn',call:'deleteStorage'},{text:'恢复',btnType:'btn',call:'deleteStorage'},{text:'账号管理',btnType:'link',state:'storageAccountManage'}]}
                ]
            },
            getDataTable0: function (data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+'/party/queryPartyList',data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getSearch1: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/CkBaseInfo/getDicLists',{param:{query:''}})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getDataTable1: function (data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+'/CkBaseInfo/queryCkBaseInfoList',data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            postData: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+url,data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getThead2: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'wlDeptId',name:'配送中心编号'},
                    {field:'cooperationType',name:'合作形式'},
                    {field:'wlType',name:'配送中心类型'},
                    {field:'wlDeptName',name:'配送中心名称'},
                    {field:'wlAddress',name:'配送中心地址'},
                    {field:'managCompany',name:'管理公司'},
                    {field:'ckName',name:'负责仓储'},
                    {field:'partyName',name:'所属运营'},
                    //{field:'ckType',name:'负责仓库类型'},
                    {field:'bossMan',name:'配送负责人'},
                    {field:'bossPhone',name:'联系方式'},
                    {field:'name11',name:'操作',type:'operate',style:'width:135px;',buttons:[{text:'修改',btnType:'btn',call:'updateLogistic',openModal:'#addLogisticModal'},{text:'|'},{text:'删除',btnType:'btn',call:'deleteLogistic'},{text:'|'},{text:'账号管理',btnType:'link',state:'logisticAccountManage'}]}
                ]
            },
            getSearch2: function () {
                var deferred=$q.defer();
                $http.post(HOST+'/wlDept/getDicLists',{param:$filter('json')({query:''})})
                    .success(function (data) {

                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getDataTable2: function (data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+'/wlDept/queryWlDeptList',data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getQuerySet0:function(){
                return  {
                    items: [ {
                        type: 'text',
                        model: 'code',
                        title: '子运营编号'
                    },{
                        type: 'text',
                        model: 'name',
                        title: '子运营名称'
                    }],
                    btns: [{
                        text: $sce.trustAsHtml('查询'),
                        click: 'searchClick0'
                    }]
                };
            },
            getQuerySet1:function(){
            	return  {
                    items: [{
                        type: 'text',
                        model: 'ckName',
                        title: '仓库名称'
                    }, {
                        type: 'select',
                        model: 'ckType',
                        selectedModel: 'ckTypeSelect',
                        title: '仓库类型'
                    }, {
                        type: 'select',
                        model: 'partyId',
                        selectedModel: 'partyIdSelect',
                        title: '所属运营'
                    }],
                    btns: [{
                        text: $sce.trustAsHtml('查询'),
                        click: 'searchClick1'
                    }]
                };
            },
            getQuerySet2:function(){
            	return {
                    items: [ {
                        type: 'text',
                        model: 'wlDeptId',
                        title: '配送中心编号'
                    },{
                        type: 'text',
                        model: 'wlDeptName',
                        title: '配送中心名称'
                    }, {
                    	type: 'select',
                        model: 'cooperationType',
                        selectedModel: 'cooperationTypeSelect',
                        title: '合作形式'
                    }, {
                    	 type: 'select',
                         model: 'wlType',
                         selectedModel: 'wlTypeSelect',
                         title: '配送中心类型'
                    }],
                    btns: [{
                        text: $sce.trustAsHtml('查询'),
                        click: 'searchClick2'
                    }]
                };
            },
            getData: function (data,url) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+url,data)
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