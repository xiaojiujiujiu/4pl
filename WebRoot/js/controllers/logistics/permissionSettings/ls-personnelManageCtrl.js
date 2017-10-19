/**
 * Created by xuwusheng on 15/12/12.
 */
define(['../../../app','../../../services/logistics/permissionSettings/personnelManageService'], function (app) {
     var app = angular.module('app');
    app.controller('lsPersonnelManageCtrl', ['$scope','$sce','lsPersonnelManage', function ($scope,$sce,personnelManage) {
        $scope.searchModel={};
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'driverName',
                title: '姓名'
            }, {
                type: 'text',
                model: 'mobilephone',
                title: '手机号'
            }, {
                type: 'select',
                model: 'position',
                selectedModel:'positionSelect',
                title: '岗位'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //theadr
        $scope.thHeader=personnelManage.getThead();

        //查询
        $scope.searchClick= function () {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows,
            };
            get();
        }
        var wlopts ={'postType':2} ;
        //初始化query
        personnelManage.getDataTable({param:{'query':wlopts}},'/user/getDicLists')
            .then(function (data) {
                $scope.searchModel=data.query;
                $scope.CustomerPos.select=data.query.position;
                $scope.searchModel.positionSelect='-1';
                get();
            });
        function get(){
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.position=$scope.searchModel.positionSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            opts.sysType = 2;
            personnelManage.getDataTable({param:{query:opts}})
                .then(function (data) {
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
                    //重置paging 解决分页指令不能监听对象问题
                    $scope.paging = {
                        totalPage: data.total,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };
                });
        }
        //人员model
        $scope.addCustomerModel={
            "jobNum":'',
            "mobilephone":'',
            "driverName":'',
            "account":'',
            "position":''
        };
        $scope.CustomerPos={
            select:'',
            id:'-1'
        }
        $scope.addTitle='添加人员';
        $scope.accountDisable=true;
        //添加人员
        $scope.addStationClick= function () {
            $scope.addTitle='添加人员';
            $scope.accountDisable=true;
            $scope.CustomerPos.id='-1';
            $scope.addCustomerModel={
                'sysType':2,
                "jobNum":'',
                "mobilephone":'',
                "driverName":'',
                "account":'',
                "position":''
            };
        }

        //添加人员 确认
        $scope.enterAddStation= function () {
            if($scope.CustomerPos.id=='-1'){
                alert('请选择岗位');
                return false;
            }
            var opt=[{
                'sysType':2,
                "jobNum":$scope.addCustomerModel.jobNum,
                "mobilephone":$scope.addCustomerModel.mobilephone,
                "driverName":$scope.addCustomerModel.driverName,
                "account":$scope.addCustomerModel.account,
                "position":$scope.CustomerPos.id,
                id:$scope.addCustomerModel.id
            }];

            personnelManage.getDataTable({param:{grid:opt}},$scope.addTitle=='添加人员'?'/user/saveUser':'/user/updateUser')
                .then(function (data) {
                    alert(data.status.msg);
                    if(data.status.code=="0000"){
                        get();
                        $('#addCustomer').modal('hide');
                    }
                });
        }
        //编辑
        $scope.editCus= function (i,item) {
            $scope.addTitle='修改人员';
            $scope.accountDisable=false;
            $scope.addCustomerModel={
                'sysType':2,
                "jobNum":item.jobNum,
                "mobilephone":item.mobilephone,
                "driverName":item.driverName,
                "account":item.account,
                'id':item.id,
                "position":item.position,
            };
            $scope.CustomerPos.id=item.position+'';
        }
        //删除
        $scope.delete= function (i,item) {
            if(confirm('确定删除吗?')) {
                personnelManage.getDataTable({param:{query:{id:item.id}}}, '/user/delUser')
                    .then(function (data) {
                        if(data.status.code=="0000"){
                            get();
                        }
                        alert(data.status.msg);
                    });
            }
        }
        $scope.goToPage= function () {
            get();
        }
        //冻结
        $scope.perFreeze= function (i,item) {
            if(confirm('确定冻结吗?')) {
                personnelManage.getDataTable({param:{query:{id:item.id,status:0}}}, '/userInfo/lockUserInfo')
                    .then(function (data) {
                        if(data.status.code=="0000"){
                            get();
                        }
                        alert(data.status.msg);
                    });
            }
        }
        //恢复
        $scope.perResume= function (i,item) {
            if(confirm('确定恢复吗?')) {
                personnelManage.getDataTable({param:{query:{id:item.id,status:2}}}, '/userInfo/lockUserInfo')
                    .then(function (data) {
                        if(data.status.code=="0000"){
                            get();
                        }
                        alert(data.status.msg);
                    });
            }
        }

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
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
    }]);
});