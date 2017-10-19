/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/platform/storage-logistics/accountStorageLogisticService','../../../services/rdc2cdcService'], function (app) {
     var app = angular.module('app');
    app.controller('accountStorageLogisticCtrl', ['$scope','$sce','accountStorageLogistic','rdc2cdc', function ($scope,$sce,accountStorageLogistic,rdc2cdc) {
        $scope.searchModel={
            ckName:'',
            wlName:''
        };
        $scope.wlName='';
        //theadr
        $scope.storageThHeader=accountStorageLogistic.getThead1();
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
        $scope.storagePaging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        //分页对象2
        $scope.logisticPaging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        //仓储查询查询
        $scope.searchClick1= function () {
            $scope.storagePaging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.storagePaging.showRows
            };
            getGrid(0);
        }
        //物流查询查询
        $scope.searchClick2= function () {
            $scope.logisticPaging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.logisticPaging.showRows
            };
            getGrid(1);
        }
        $scope.isStorageOrLogistics=true;
        //标签切换
        $scope.navClick= function (n) {
            switch (n){
                case 0:
                    $scope.storageThHeader=accountStorageLogistic.getThead1();
                    $scope.isStorageOrLogistics=true;
                    getGrid(0);
                    break;
                case 1:
                    $scope.logisticThHeader=accountStorageLogistic.getThead2();
                    $scope.isStorageOrLogistics=false;
                    getGrid(1);
                    break;
            }
        }
        function getGrid(i){
            if(i==0){
                //获取选中 设置对象参数
                var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
                opts.wlName=undefined;
                //opts.ckName = $scope.storageName;

                opts.page = $scope.storagePaging.currentPage;
                opts.pageSize = $scope.storagePaging.showRows;
                var s1 = accountStorageLogistic.getDataTable({param: {query: opts}},'/userInfo/queryUserInfoList');
                s1.then(function (data) {
                    if(data.code==-1){
                        alert(data.message);
                        $scope.storageResult = [];
                        $scope.storagePaging = {
                            totalPage: 1,
                            currentPage: 1,
                            showRows: $scope.storagePaging.showRows,
                        };
                        return false;
                    }
                    $scope.storageResult = data.grid;
                    $scope.storagePaging = {
                        totalPage: data.total,
                        currentPage: $scope.storagePaging.currentPage,
                        showRows: $scope.storagePaging.showRows,
                    };
                }, function (error) {
                    console.log(error)
                })
            }else{
                var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
                opts.ckName=undefined;
                opts.wlName = $scope.wlName;

                opts.page = $scope.logisticPaging.currentPage;
                opts.pageSize = $scope.logisticPaging.showRows;
                var s2 = accountStorageLogistic.getDataTable({param: {query: opts}},'/userInfo/queryWlUserInfoList');
                s2.then(function (data) {
                    if(data.code==-1){
                        alert(data.message);
                        $scope.logisticResult = [];
                        $scope.logisticPaging = {
                            totalPage: 1,
                            currentPage: 1,
                            showRows: $scope.logisticPaging.showRows,
                        };
                        return false;
                    }
                    $scope.logisticResult = data.grid;
                    $scope.logisticPaging = {
                        totalPage: data.total,
                        currentPage: $scope.logisticPaging.currentPage,
                        showRows: $scope.logisticPaging.showRows,
                    };
                }, function (error) {
                    console.log(error)
                })
            }
        }
        getGrid(0);
        //初始化RDC
        rdc2cdc.getRDC({param: {}})
            .then(function (data) {
                $scope.RDCModel.select=data.query.RDC;
            }, function (error) {
                console.log(error);
            });
        $scope.RDCModel = {
            select: [],
            id: '-1',
            change: function (call) {
                rdc2cdc.getCDC({param: {"query":{"RDC":$scope.RDCModel.id}}})
                    .then(function (data) {
                        if(data.query.CDC.length==1&&data.query.CDC[0].id=='-1') {
                            data.query.CDC.splice(0, 1);
                            $scope.CDCModel.id='-1';
                            if(!$scope.isStorageOrLogistics){
                                //初始化添加物流账号物流
                                initWlDept($scope.RDCModel.id);
                            }
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
        $scope.CDCModel = {
            select: [],
            id: '-1',
            change: function () {
                if(!$scope.isStorageOrLogistics){
                    //初始化添加物流账号物流
                    initWlDept($scope.CDCModel.id);
                }
            }
        }
        //添加仓储管理账号model
        $scope.storageAccountModel={
            userType:2,
            RDCId:'',
            CDCId:'',
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
                RDCId:'',
                CDCId:'',
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
            if($scope.RDCModel.id=='-1'){
                alert('请选择RDC!');
                return;
            }
            /*if($scope.CDCModel.id=='-1'&&$scope.CDCModel.select.length>0){
                alert('请选择CDC!');
                return;
            }*/
            $scope.storageAccountModel.RDCId=$scope.RDCModel.id;
            $scope.storageAccountModel.CDCId=$scope.CDCModel.id;
            accountStorageLogistic.getDataTable({param:{query:$scope.storageAccountModel}},
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
            accountStorageLogistic.getDataTable({param:{query:{id:item.id}}},'/userInfo/initUpdateUserInfo')
                .then(function (data) {
                    $scope.storageAccountModel={
                        id:item.id,
                        userType:2,
                        RDCId:data.query.RDCId,
                        CDCId:data.query.CDCId,
                        userName:data.query.userName,
                        userTel:data.query.userTel,
                        userPosition:data.query.userPosition,
                        account:data.query.account,
                        password:data.query.password
                    };
                    $scope.RDCModel.id=data.query.RDCId+'';
                    if(data.query.CDCId!=-1) {
                        //触发CDC
                        $scope.RDCModel.change(function () {
                            $scope.CDCModel.id = data.query.CDCId + '';
                        });
                    }
                }, function () {

                });
        }
        //仓储删除
        $scope.storageDeleteCall= function (index,item) {
            if(confirm('确定删除吗?')){
                accountStorageLogistic.getDataTable({param:{query:{id:item.id}}},'/userInfo/deleteUserInfo')
                    .then(function (data) {
                        if(data.code==0)
                            getGrid(0);
                        alert(data.message);
                    }, function (error) {
                        
                    });
            }

        }
        //物流账号model
        $scope.logisticAccountModel={
            userType:3,
            RDCId:'',
            CDCId:'',
            userName:'',
            userTel:'',
            userPosition:'',
            account:'',
            password:'',
            wlDepId:''
        };
        $scope.wlDept={
            select:[{id:-1,name:'全部'}],
            id:-1
        }
        function initWlDept(id){
            accountStorageLogistic.getDataTable({param:{}},'/wlDept/getWlDeptList')
                .then(function (data) {
                    $scope.wlDept.select=data.query.wlDeptList;
                    try {
                        $scope.wlDept.select.splice(0, 0, {id: -1, name: '全部'});
                    }catch (e){
                        $scope.wlDept.select=[{id:-1,name:'全部'}];
                    }
                }, function () {

                });
        }
        initWlDept(0);
        $scope.logisticAccountTitle='添加物流账号';
        //物流添加按钮
        $scope.btnAddLogistic= function () {
            $scope.logisticAccountTitle='添加物流账号';
            $scope.RDCModel.id='-1';
            $scope.CDCModel.select=[];
            $scope.CDCModel.id='-1';

        }
        //物流保存
        $scope.enterLogisticAdd= function () {
            if($scope.wlDept.id==-1){
                alert('请选择物流!');
                return;
            }
            /*if($scope.RDCModel.id=='-1'){
                alert('请选择RDC!');
                return;
            }
            if($scope.CDCModel.id=='-1'){
                alert('请选择CDC!');
                return;
            }*/
            $scope.logisticAccountModel.wlDepId=$scope.wlDept.id;
            /*$scope.logisticAccountModel.RDCId=$scope.RDCModel.id;
            $scope.logisticAccountModel.CDCId=$scope.CDCModel.id;*/
            accountStorageLogistic.getDataTable({param:{query:$scope.logisticAccountModel}},$scope.logisticAccountTitle=='添加物流账号'?'/userInfo/insertUserInfo':'/userInfo/updateUserInfo')
                .then(function (data) {
                    if(data.code==0){
                        getGrid(1);
                        $('#addLogisticModal').modal('hide');
                    }
                    alert(data.message);
                }, function () {

                });
        }
        //修改物流
        $scope.updateLogistic= function (i,item) {
            $scope.logisticAccountTitle='修改物流账号';
            accountStorageLogistic.getDataTable({param:{query:{id:item.id}}},'/userInfo/initUpdateUserInfo')
                .then(function (data) {
                    $scope.logisticAccountModel={
                        id:item.id,
                        userType:3,
                       /* RDCId:data.query.RDCId,
                        CDCId:data.query.CDCId,*/
                        userName:data.query.userName,
                        userTel:data.query.userTel,
                        userPosition:data.query.userPosition,
                        account:data.query.account,
                        password:data.query.password,
                        //wlDepId:data.query.wlDepId
                    };
                    $scope.wlDept.id=data.query.wlDepId;
                    /*$scope.RDCModel.id=data.query.RDCId+'';
                    if(data.query.CDCId!=-1) {
                        //触发CDC
                        $scope.RDCModel.change(function () {
                            $scope.CDCModel.id = data.query.CDCId + '';
                        });
                    }*/
                    //初始化物流
                    //initWlDept(data.query.CDCId!=-1?data.query.CDCId:data.query.RDCId);
                }, function () {

                });
        }
        //物流删除
        $scope.logisticDeleteCall= function (index,item) {
            if(confirm('确定删除吗?')){
                accountStorageLogistic.getDataTable({param:{query:{id:item.id}}},'/userInfo/deleteUserInfo')
                    .then(function (data) {
                        if(data.code==0)
                            getGrid(1);
                        alert(data.message);
                    }, function (error) {

                    });
            }
        }
        $scope.goToPage= function (i) {
            getGrid(i);
        }
    }]);
});