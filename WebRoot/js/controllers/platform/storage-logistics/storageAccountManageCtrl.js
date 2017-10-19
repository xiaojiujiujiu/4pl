/**
 * author wusheng.xu
 * date 16/4/12
 */
define(['../../../app', '../../../services/platform/storage-logistics/storageAccountManageService', '../../../services/rdc2cdcService'], function (app) {
     var app = angular.module('app');
    app.controller('storageAccountManageCtrl', ['$scope', '$sce','$stateParams', 'storageAccountManage', 'rdc2cdc', function ($scope, $sce,$stateParams, storageAccountManage, rdc2cdc) {
        $scope.ckName='';
        //theadr
        $scope.thHeader = storageAccountManage.getThead();
        //分页下拉框
        $scope.pagingSelect = [{
            value: 5,
            text: 5
        }, {
            value: 10,
            text: 10,
            selected: true
        }, {
            value: 20,
            text: 20
        }, {
            value: 30,
            text: 30
        }, {
            value: 50,
            text: 50
        }];
        //分页对象1
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        $scope.RDCModel = {
            select: [],
            id: '-1',
            change: function (call) {
                rdc2cdc.getCDC({param: {"query":{"RDC":$scope.RDCModel.id}}})
                    .then(function (data) {
                        if(data.query.CDC&&data.query.CDC.length==1&&data.query.CDC[0].id=='-1') {
                            data.query.CDC.splice(0, 1);
                            $scope.CDCModel.id='-1';
                            /*if(!$scope.isStorageOrLogistics){
                                //初始化添加物流账号物流
                                initWlDept($scope.RDCModel.id);
                            }*/
                        }
                        $scope.CDCModel.select=data.query.CDC;

                        if(!(call instanceof Function))
                            $scope.CDCModel.id='-1';
                        else
                            call();
                    }, function (error) {
                        console.log(error);
                    });
            }
        }

       /* //初始化RDC
        rdc2cdc.getRDC({param: {}})
            .then(function (data) {
                $scope.RDCModel.select=data.query.RDC;
            }, function (error) {
                console.log(error);
            });
        $scope.CDCModel = {
            select: [],
            id: '-1',
            change: function () {
                /!*if(!$scope.isStorageOrLogistics){
                    //初始化添加物流账号物流
                    initWlDept($scope.CDCModel.id);
                }*!/
            }
        }*/
        function getGrid(){
            //获取选中 设置对象参数
            var opts = {ckId:$stateParams['id']};

            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var s1 = storageAccountManage.getDataTable({param: {query: opts}},'/userInfo/queryUserInfoList');
            s1.then(function (data) {
                if (data.code == -1) {
                    alert(data.message);
                    $scope.result = [];
                    $scope.paging = {
                        totalPage: 1,
                        currentPage: 1,
                        showRows: $scope.paging.showRows,
                    };
                    return false;
                }
                $scope.result = data.grid;
                $scope.ckName=data.query.ckName;
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function (error) {
                console.log(error)
            })
        }
        getGrid();
        //添加仓储管理账号model
        $scope.storageAccountModel={
            userType:2,
            manageRange:$stateParams['id'],
            /*RDCId:'',
            CDCId:'',*/
            userName:'',
            userTel:'',
            userPosition:'',
            account:'',
            password:''
        };
        $scope.storageAccountTitle='添加仓储管理账号';
        //添加仓库按钮
        $scope.btnAddStorage= function () {
            $scope.storageAccountTitle='添加仓储管理账号';
            //添加仓储管理账号model
            $scope.storageAccountModel={
                userType:2,
                manageRange:$stateParams['id'],
               /* RDCId:'',
                CDCId:'',*/
                userName:'',
                userTel:'',
                userPosition:'',
                account:'',
                password:''
            };
            $scope.RDCModel.id='-1';
            $scope.CDCModel.select=[];
            $scope.CDCModel.id='-1';
        }
        //添加仓库账号保存
        $scope.enterAdd= function () {
            /*if($scope.RDCModel.id=='-1'){
                alert('请选择RDC!');
                return;
            }*/
            /*if($scope.CDCModel.id=='-1'&&$scope.CDCModel.select.length>0){
             alert('请选择CDC!');
             return;
             }*/
            //$scope.storageAccountModel.RDCId=$scope.RDCModel.id;
            //$scope.storageAccountModel.CDCId=$scope.CDCModel.id;
            storageAccountManage.getDataTable({param:{query:$scope.storageAccountModel}},
                $scope.storageAccountTitle=='添加仓储管理账号'?'/userInfo/insertUserInfo':'/userInfo/updateUserInfo')
                .then(function (data) {
                    if(data.code==0){
                        getGrid(0);
                        $('#addStorageModal').modal('hide');
                    }
                    alert(data.message);
                }, function (error) {

                });
        }
        //修改仓储
        $scope.updateStorage= function (i,item) {
            $scope.storageAccountTitle='修改仓储管理账号';
            storageAccountManage.getDataTable({param:{query:{id:item.id}}},'/userInfo/initUpdateUserInfo')
                .then(function (data) {
                    $scope.storageAccountModel={
                        id:item.id,
                        userType:2,
                        manageRange:$stateParams['id'],
                        /*RDCId:data.query.RDCId,
                        CDCId:data.query.CDCId,*/
                        userName:data.query.userName,
                        userTel:data.query.userTel,
                        userPosition:data.query.userPosition,
                        account:data.query.account,
                        password:data.query.password
                    };
                    /*$scope.RDCModel.id=data.query.RDCId+'';
                    if(data.query.CDCId!=-1) {
                        //触发CDC
                        $scope.RDCModel.change(function () {
                            $scope.CDCModel.id = data.query.CDCId + '';
                        });
                    }*/
                }, function () {

                });
        }
        //仓储删除
        $scope.storageDeleteCall= function (index,item) {
            if(confirm('确定删除吗?')){
                storageAccountManage.getDataTable({param:{query:{id:item.id}}},'/userInfo/deleteUserInfo')
                    .then(function (data) {
                        if(data.code==0)
                            getGrid(0);
                        alert(data.message);
                    }, function (error) {

                    });
            }

        }
        //重置密码
        $scope.resetPwd= function (index,item) {
            if(confirm('确定重置密码吗?')){
                storageAccountManage.getDataTable({param:{query:{id:item.id}}},'/userInfo/initUserInfoPassword')
                    .then(function (data) {
                        if(data.code==0)
                            getGrid(0);
                        alert(data.message);
                    }, function (error) {

                    });
            }
        }
        $scope.goToPage= function () {
            getGrid();
        }
    }]);
});

