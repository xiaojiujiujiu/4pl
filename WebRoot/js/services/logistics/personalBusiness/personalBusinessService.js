/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app'], function (app) {
    app.factory('personalBusiness', ['$http','$q','$filter','HOST',function ($http,$q,$filter,HOST) {
        return {
            getThead: function () {
                return [
                    {name:'',check:true,checkAll:true},
                    {field:'taskId',name:'业务单号'},
                    {field:'receAdd',name:'收货地址'},
                    {field:'acceTypeCount',name:'商品种类'},
                    {field:'createTime',name:'创建时间'},
                    {field:'remarks',name:'备注',style:'width: 300px'},
                    {field:'pay',name:'配送费'},
                    {
                        field:'op',
                        name:'操作',
                        type:'operate',
                        buttons:[{
                            text:'修改',
                            btnType:'btn',
                            call:'updateCustom', 
                            openModal:'#addCustomerModal'
                        },{text:'|'},{
                            text:'删除',
                            btnType:'btn',
                            call:'deleteCustom'
                        }]
                    }
                ]
            },
            getTheadSecond: function () {
                return [
                    {field: 'pl4GridCount',
                        name: '序号',
                        type: 'pl4GridCount'},
                    {field:'taskId',name:'业务单号'},
                    {field:'receAdd',name:'收货地址'},
                    {field:'acceTypeCount',name:'商品种类'},
                    {field:'createTime',name:'创建时间'},
                    {field:'remarks',name:'备注',style:'width: 300px'},
                    {field:'pay',name:'配送费'},
                    {
                        field:'op',
                        name:'操作',
                        type:'operate',
                        buttons:[{
                            text:'打印业务单',
                            btnType:'btn',
                            call:'printFirst'
                        }]
                    }
                ]
            },
            getDataTable: function (url,data) {
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