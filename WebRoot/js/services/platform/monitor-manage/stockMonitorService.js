/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app'], function (app) {
    app.factory('stockMonitor', ['$http','$q', '$filter','HOST',function ($http,$q, $filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount',style:'padding:8px 10px 0 10px;'},
                    {
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
                      name: '品牌'
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
                    },
                    // {
                    //   field: 'lowStock',
                    //   name: '安全库存'
                    // },  {
                    //     field: 'highStock',
                    //     name: '库存上限'
                    //   },
                    {
                        field: 'factStock',
                        name: '库存数量'
                     },
                    {
                      field: 'allStock',
                      name: '可用库存'
                    },
                    {
                      field: 'damageStock',
                       name: '残损品库存'
                     },
                      
                    // {
                    //   field: 'different',
                    //   name: '安全库存差异'
                    // }, {
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
                        field: 'op',
                        name: '操作',
                        type: 'operate',
                        style:'width:60px;',
                        buttons: [{
                            text: '日志',
                            call: 'getOpenModelData',
                            btnType: 'button',
                            style: 'font-size:10px;',
                            openModal: '#logModal'
                        }]
                    }]
            },
            getOpenModelThHeader: function() {
                return [ {name:'序号',type:'pl4GridCount'},
                         {field:'changeType',name:'操作描述'},
                         {field:'opUser',name:'操作人'},
                         {field:'taskType',name:'变更原因'},
                         {field:'taskId',name:'关联业务单号'},
                         {field:'beforeStock',name:'变更前数量'},
                         {field:'changeCount',name:'变更数量'},
                         {field:'afterStock',name:'变更后数量'},
                         {field:'opTime',name:'操作时间'}
                         ]
            },
            getSearch: function() {
                var deferred = $q.defer();
                $http.post(HOST+'/inventoryMonitor/getDicLists',{})
                    .success(function(data) {
                        deferred.resolve(data);
                    })
                    .error(function(e) {
                        deferred.reject('error:' + e);
                    });
                return deferred.promise;
            },
            getDataTable: function (url,data) {
                //将parm转换成json字符串
            	  data.param = $filter('json')(data.param);
                  //console.log(data)
                  var deferred = $q.defer();
                $http.post(url, data)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getDetailTable: function (url,data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(url, data)
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