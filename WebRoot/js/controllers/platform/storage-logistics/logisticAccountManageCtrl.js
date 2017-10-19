/**
 * author wusheng.xu
 * date 16/4/12
 */
define(['../../../app','../../../services/platform/storage-logistics/logisticAccountManageService','../../../services/rdc2cdcService'], function (app) {
     var app = angular.module('app');
    app.controller('logisticAccountManageCtrl', ['$scope', '$sce','$stateParams', 'logisticAccountManage', 'rdc2cdc', function ($scope, $sce,$stateParams, logisticAccountManage, rdc2cdc) {
        $scope.wlName='';
        //theadr
        $scope.thHeader=logisticAccountManage.getThead();
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
        function getGrid(){
            //获取选中 设置对象参数
            var opts = {wlId:$stateParams['id']};
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var s2 = logisticAccountManage.getDataTable({param: {query: opts}},'/userInfo/queryWlUserInfoList');
            s2.then(function (data) {
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
                $scope.wlName=data.query.wlName;
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

        //物流账号model
        $scope.logisticAccountModel={
            userType:3,
            manageRange:$stateParams['id'],
            userName:'',
            userTel:'',
            userPosition:'',
            account:'',
            password:'',
        };
        $scope.wlDept={
            select:[{id:-1,name:'全部'}],
            id:-1
        }
        function initWlDept(id){
            logisticAccountManage.getDataTable({param:{}},'/wlDept/getWlDeptList')
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
        //initWlDept(0);
        $scope.logisticAccountTitle='添加配送账号';
        //物流添加按钮
        $scope.btnAddLogistic= function () {
            $scope.wlDeptDisabled=false;
            $scope.logisticAccountTitle='添加配送账号';
            $scope.wlDept.id=-1;
            $scope.logisticAccountModel={
                userType:3,
                manageRange:$stateParams['id'],
                userName:'',
                userTel:'',
                userPosition:'',
                account:'',
                password:''
            };
        }
        //物流保存
        $scope.enterLogisticAdd= function () {
            /*if($scope.wlDept.id==-1){
                alert('请选择物流!');
                return;
            }*/
            /*if($scope.RDCModel.id=='-1'){
             alert('请选择RDC!');
             return;
             }
             if($scope.CDCModel.id=='-1'){
             alert('请选择CDC!');
             return;
             }*/
            //$scope.logisticAccountModel.wlDepId=$scope.wlDept.id;
            /*$scope.logisticAccountModel.RDCId=$scope.RDCModel.id;
             $scope.logisticAccountModel.CDCId=$scope.CDCModel.id;*/
            logisticAccountManage.getDataTable({param:{query:$scope.logisticAccountModel}},$scope.logisticAccountTitle=='添加配送账号'?'/userInfo/insertUserInfo':'/userInfo/updateUserInfo')
                .then(function (data) {
                    if(data.code==0){
                        getGrid(1);
                        $('#addLogisticModal').modal('hide');
                    }
                    alert(data.message);
                }, function () {

                });
        }
        $scope.wlDeptDisabled=false;
        //修改物流
        $scope.updateLogistic= function (i,item) {
            $scope.logisticAccountTitle='修改配送账号';
            logisticAccountManage.getDataTable({param:{query:{id:item.id}}},'/userInfo/initUpdateUserInfo')
                .then(function (data) {
                    $scope.wlDeptDisabled=true;
                    $scope.logisticAccountModel={
                        id:item.id,
                        userType:3,
                        manageRange:$stateParams['id'],
                        userName:data.query.userName,
                        userTel:data.query.userTel,
                        userPosition:data.query.userPosition,
                        account:data.query.account,
                        password:data.query.password,
                        //wlDepId:data.query.wlDepId
                    };
                    $scope.wlDept.id=data.query.id;
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
                logisticAccountManage.getDataTable({param:{query:{id:item.id}}},'/userInfo/deleteUserInfo')
                    .then(function (data) {
                        if(data.code==0)
                            getGrid(1);
                        alert(data.message);
                    }, function (error) {

                    });
            }
        }
        //重置密码
        $scope.resetPwd= function (index,item) {
            if(confirm('确定重置密码吗?')){
                logisticAccountManage.getDataTable({param:{query:{id:item.id}}},'/userInfo/initUserInfoPassword')
                    .then(function (data) {
                        if(data.code==0)
                            getGrid(0);
                        alert(data.message);
                    }, function (error) {

                    });
            }
        }
    }]);
});
