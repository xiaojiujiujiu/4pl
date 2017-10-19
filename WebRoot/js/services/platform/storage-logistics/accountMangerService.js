/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app'], function (app) {
    app.factory('accountManger', ['$http','$q','$filter','$sce','HOST',function ($http,$q,$filter,$sce,HOST) {
        return {
            getTheadFirst: function () {
                return [
                    {
                        name:'序号',
                        type:'pl4GridCount'
                    }, {
                        field:'ckName',
                        name:'仓库名称'
                    }, {
                        field:'wlDeptName',
                        name:'配送名称'
                    }, {
                        field:'userName',
                        name:'账号负责人'
                    }, {
                        field:'tel',
                        name:'负责人电话'
                    }, {
                        field:'userPosition',
                        name:'公司职位'
                    }, {
                        field:'account',
                        name:'平台账号'
                    }, {
                        field:'OP',
                        name:'操作',
                        type:'operate',
                        buttons:[{
                            text:'修改',
                            btnType:'btn',
                            call:'modification'
                        },{text:'|'},{
                            text:'重置密码',
                            btnType:'btn',
                            call:'resetPassword'
                        },{text:'|'},{
                            text:'冻结',
                            btnType:'btn',
                            call: 'frozen'
                        },{text:'|'},{
                            text:'恢复',
                            btnType:'btn',
                            call: 'recovery'
                        }]
                    }
                ]
            },
            getTheadSecond: function () {
                return [
                    {
                        name:'序号',
                        type:'pl4GridCount'
                    }, {
                        field:'partyName',
                        name:'子运营名称'
                    }, {
                        field:'userName',
                        name:'账号负责人'
                    }, {
                        field:'tel',
                        name:'负责人电话'
                    }, {
                        field:'userPosition',
                        name:'公司职位'
                    }, {
                        field:'account',
                        name:'平台账号'
                    }, {
                        field:'OP',
                        name:'操作',
                        type:'operate',
                        buttons:[{
                            text:'修改',
                            btnType:'btn',
                            call:'modification'
                        },{text:'|'},{
                            text:'重置密码',
                            btnType:'btn',
                            call:'resetPassword'
                        },{text:'|'},{
                            text:'冻结',
                            btnType:'btn',
                            call: 'frozen'
                        },{text:'|'},{
                            text:'恢复',
                            btnType:'btn',
                            call: 'recovery'
                        }]
                    }
                ]
            },
            getTheadThird: function () {
                return [
                    {
                        name:'序号',
                        type:'pl4GridCount'
                    }, {
                        field:'ckName',
                        name:'仓库名称'
                    }, {
                        field:'userName',
                        name:'账号负责人'
                    }, {
                        field:'tel',
                        name:'负责人电话'
                    }, {
                        field:'userPosition',
                        name:'公司职位'
                    }, {
                        field:'account',
                        name:'平台账号'
                    }, {
                        field:'OP',
                        name:'操作',
                        type:'operate',
                        buttons:[{
                            text:'修改',
                            btnType:'btn',
                            call:'modification'
                        },{text:'|'},{
                            text:'重置密码',
                            btnType:'btn',
                            call:'resetPassword'
                        },{text:'|'},{
                            text:'冻结',
                            btnType:'btn',
                            call: 'frozen'
                        },{text:'|'},{
                            text:'恢复',
                            btnType:'btn',
                            call: 'recovery'
                        }]
                    }
                ]
            },
            getTheadFourth: function () {
                return [
                    {
                        name:'序号',
                        type:'pl4GridCount'
                    }, {
                        field:'wlDeptName',
                        name:'配送中心名称'
                    }, {
                        field:'userName',
                        name:'账号负责人'
                    }, {
                        field:'tel',
                        name:'负责人电话'
                    }, {
                        field:'userPosition',
                        name:'公司职位'
                    }, {
                        field:'account',
                        name:'平台账号'
                    }, {
                        field:'OP',
                        name:'操作',
                        type:'operate',
                        buttons:[{
                            text:'修改',
                            btnType:'btn',
                            call:'modification'
                        },{text:'|'},{
                            text:'重置密码',
                            btnType:'btn',
                            call:'resetPassword'
                        },{text:'|'},{
                            text:'冻结',
                            btnType:'btn',
                            call: 'frozen'
                        },{text:'|'},{
                            text:'恢复',
                            btnType:'btn',
                            call: 'recovery'
                        }]
                    }
                ]
            },
            getDataTable: function (url, data) {
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