/**
 * Created by xuwusheng on 15/12/12.
 */
define(['../../../app','../../../services/storage/storage-permissionManage/personnelManageService'], function (app) {
    var app = angular.module('app');     app.controller('personnelManageCtrl', ['$scope','$sce','personnelManage', function ($scope,$sce,personnelManage) {
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
                title: '手机'
            }, {
                type: 'select',
                model: 'userCaetgory',
                selectedModel:'userCaetgorySelect',
                title: '人员类别'
            }, {
                type: 'select',
                model: 'contractList',
                selectedModel:'contractListSelect',
                title: '合同期限'
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
                showRows: $scope.paging.showRows
            };
            get();
        }
        var ckopts ={'postType':1} ;
        //初始化query
        personnelManage.getDataTable({param:{'query':ckopts}},'/user/getDicLists')
            .then(function (data) {
                $scope.searchModel=data.query;
                $scope.searchModel.userCaetgorySelect="-1";
                $scope.searchModel.contractListSelect="-1";
                //$scope.sexList.select=data.query.sexList;
                //$scope.educationList.select=data.query.educationList;
                //$scope.position.select=data.query.position;
                //$scope.userCaetgory.select=data.query.userCaetgory;
                //$scope.contractList.select=data.query.contractList;
                get();
            });
        function get(){
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.userCaetgory=$scope.searchModel.userCaetgorySelect;
            opts.contract=$scope.searchModel.contractListSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            opts.sysType = 3;
            personnelManage.getDataTable({param:{query:opts}})
                .then(function (data) {
                    if(data.code==-1){
                        alert(data.message);
                        $scope.result = [];
                        $scope.paging = {
                            totalPage: 1,
                            currentPage: 1,
                            showRows: $scope.paging.showRows,
                        };
                        return false;
                    }
                    if(data.grid.length<=0){
                        $scope.isData=false;
                    }else {
                        $scope.isData=true;
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
            "driverName":'',
            "age":'',
            "mobilephone":'',
            "account":'',
            'contractStartTime ':'',
            "jobNum":'',
            "remark":'',
            "contractEndTime":''
        };
        $scope.sexList={
            select:'',
            id:1
        }
        $scope.educationList={
            select:'',
            id:'1'
        }
        $scope.position={
            select:'',
            id:''
        }
        $scope.userCaetgory2={
            select:'',
            id:'1'
        }
        $scope.contractList={
            select:'',
            id:'1'
        }
        $scope.addTitle='添加人员';
        $scope.accountDisable =true;
        //添加人员
        $scope.addStationClick= function () {
            personnelManage.getDataTable({param:{'query':ckopts}},'/user/initAddUser')
                .then(function (data) {
                    $scope.sexList.select=data.query.sexList;
                    $scope.educationList.select=data.query.educationList;
                    $scope.position.select=data.query.position;
                    $scope.userCaetgory2.select=data.query.userCaetgory;
                    $scope.contractList.select=data.query.contractList;
                });
            $scope.addTitle='添加人员';
            $scope.accountDisable = true;
            $scope.sexList.id=1;
            $scope.educationList.id='1';
            $scope.position.id='';
            $scope.userCaetgory2.id='1';
            $scope.contractList.id='1';
            $scope.addCustomerModel={
                "driverName":'',
                "age":'',
                "mobilephone":'',
                "account":'',
                'contractStartTime ':'',
                "jobNum":'',
                "remark":'',
                "contractEndTime":'',
            };
        }

        //添加人员 确认
        $scope.enterAddStation= function () {
            //if($scope.educationList.id=="-1"){
            //    alert("请选择学历！");
            //    return false;
            //}
            if($scope.position.id==""){
                alert("请选择岗位！");
                return false;
            }
            var reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
            if(!reg.test($scope.addCustomerModel.mobilephone)){
                alert("请输入正确的手机号！")
                return false;
            }
            var date1=$scope.addCustomerModel.contractStartTime,date2=$scope.addCustomerModel.contractEndTime;
            //if(date1&&date2&&date1!==''&&date2!==''){
            date1=new Date(date1).getTime();
            date2=new Date(date2).getTime();
            var time = new Date().getTime();
            if(date1>time){
                alert('合同起始日需为今天或今天以前');
                return false;
            }
            if(date2<time){
                alert('合同结束日需为今天以后');
                return false;
            }
            if(date1>date2){
                alert('合同起始日不能大于合同结束日');
                return false;
            }
            else if(date1==date2){
                alert('合同结束日不能等于合同起始日');
                return false;
            }
            //}
            if(!$scope.isHide){
                if($scope.addCustomerModel.contractStartTime===''){
                    alert("请输入合同起始日");
                    return false;
                }
            }
            if(!$scope.isHi){
                if($scope.addCustomerModel.contractEndTime===''){
                    alert("请输入合同结束日");
                    return false;
                }
            }
            var opt=[{
                'sysType':3,
                "driverName":$scope.addCustomerModel.driverName,
                "age":$scope.addCustomerModel.age,
                "contractEndTime":$scope.addCustomerModel.contractEndTime,
                "mobilephone":$scope.addCustomerModel.mobilephone,
                "account":$scope.addCustomerModel.account,
                "contractStartTime":$scope.addCustomerModel.contractStartTime,
                "jobNum":$scope.addCustomerModel.jobNum,
                "remark":$scope.addCustomerModel.remark,
                "sexList":$scope.sexList.id,
                "educationList":$scope.educationList.id,
                "position":$scope.position.id,
                "userCaetgory":$scope.userCaetgory2.id,
                "contractList":$scope.contractList.id,
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
            $scope.accountDisable = false;
            personnelManage.getDataTable({param:{query:{id:item.id}}}, '/user/initUpdateUser')
                .then(function (data) {
                    $scope.sexList.select=data.query.sexList;
                    $scope.educationList.select=data.query.educationList;
                    $scope.position.select=data.query.positionList;
                    $scope.userCaetgory2.select=data.query.userCaetgoryList;
                    $scope.contractList.select=data.query.contractList;


                    $scope.sexList.id=data.query.sex;
                    $scope.educationList.id=data.query.education;
                    $scope.position.id=data.query.positionId;
                    $scope.userCaetgory2.id=data.query.userCaetgory;
                    $scope.contractList.id=data.query.contract;
                });
            $scope.addCustomerModel={
                'sysType':3,
                "driverName":item.driverName,
                "age":item.age,
                "contractEndTime":item.contractEndTime,
                "mobilephone":item.mobilephone,
                "account":item.account,
                "contractStartTime":item.contractStartTime,
                "jobNum":item.jobNum,
                "remark":item.remark,
                'id':item.id,
               // "sexList":item.sexList,
              //  "educationList":item.educationList,
               // "position":item.position,
               // "userCaetgory2":item.userCaetgory,
               // "contractList":item.contractList
            };
        }
        //删除
        $scope.delete= function (i,item) {
            if(confirm('确定冻结吗?')) {
                personnelManage.getDataTable({param:{query:{id:item.id}}}, '/userInfo/lockUserInfo')
                    .then(function (data) {
                        if(data.status.code=="0000"){
                            get();
                        }
                        alert(data.status.msg);
                    });
            }
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


        $scope.goToPage= function () {
            get();
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