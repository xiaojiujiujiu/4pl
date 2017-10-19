/**
 * Created by xuwusheng on 15/12/21.
 */
define(['../../../app'], function (app) {
    app.factory('giftReplenishment', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'序号',type:'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'createTime',name:'创建日期'},
                    {field:'chuHuoName',name:'供应商'},
                    {field:'receiverName',name:'收货仓库'},
                    {field:'wlDeptName',name:'承运快递'},
                    {field:'thirdWlId',name:'快递单号'},
                    {field:'inGoodsState',name:'订单状态'},
                    {field:'op',name:'操作',type:'operate',buttons:[{text:'查看',btnType:'btn',call:'lookCus',openModal:'#lookModal'},{text:'日志',btnType:'btn',call:'getOpenModelData',openModal:'#logModal'}]}
                ]
            },
            getOpenModelThHeader: function() {
                return [ {
                    field: 'pl4GridCount',
                    name: '序号',
                    type: 'pl4GridCount'
                }, {
                    field: 'handleDetail',
                    name: '操作描述'
                },  {
                    field: 'handleName',
                    name: '操作人'
                }, {
                    field: 'orderState',
                    name: '订单状态'
                }, {
                    field: 'handleTime',
                    name: '操作时间'
                }
                ]
            },
            getLookModelThHeader: function() {
            return [ {
                field: 'pl4GridCount',
                name: '#',
                type: 'pl4GridCount'
            }, {
                field: 'sku',
                name: '礼品编码'
            },  {
                field: 'goodsName',
                name: '礼品名称'
            }, {
                field: 'goodsBrand',
                name: '礼品品牌'
            }, {
                field: 'goodsType',
                name: '礼品分类'
            }, {
                field: 'price',
                name: '礼品单价'
            }, {
                field: 'count',
                name: '补货数量'
            }
            ]
        },
            getSearch: function () {

                var deferred=$q.defer();
                $http.post(HOST+'/giftReplenishment/getGiftDicList',{})
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (e) {
                        deferred.reject('error:'+e);
                    });
                return deferred.promise;
            },
            getDataTable: function (url,data) {
                //将parm转换成json字符串
                data.param=$filter('json')(data.param);
                var deferred=$q.defer();
                $http.post(HOST+url, data)
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