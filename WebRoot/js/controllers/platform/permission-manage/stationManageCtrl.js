/**
 * Created by xuwusheng on 15/12/12.
 */
define(['../../../app','../../../services/platform/permission-manage/stationManageService'], function (app) {
     var app = angular.module('app');
    app.controller('platformStationManageCtrl', ['$scope','$sce','platformStationManage', function ($scope,$sce,platformStationManage) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'name',
                title: '姓名'
            }, {
                type: 'text',
                model: 'phone',
                title: '手机号'
            }, {
                type: 'select',
                model: 'postName',
                modelSelect:'postNameSelect',
                title: '职位'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        $scope.stationTitle='添加岗位';
        //theadr
        $scope.thHeader=platformStationManage.getThead();
        //添加岗位 系统功能数据
        $scope.sysStationData=[
            {
                name:'4PL仓储操作',
                checked:false,
                child:[
                    {
                        name:'收货入库',
                        checked:false
                    },
                    {
                        name:'商品上架',
                        checked:false
                    },{
                        name:'订单拣货',
                        checked:false
                    },{
                        name:'订单包装',
                        checked:false
                    },{
                        name:'退货取货单打印',
                        checked:false
                    }
                ]
            },{
                name:'4PL仓储操作2',
                child:[
                    {
                        name:'收货入库2',
                        checked:false
                    },
                    {
                        name:'商品上架2',
                        checked:false
                    },{
                        name:'订单拣货2',
                        checked:false
                    },{
                        name:'订单包装2',
                        checked:false
                    },{
                        name:'退货取货单打印2',
                        checked:false
                    }
                ]
            }
        ];
        $scope.storagePermissionMenu=[];
        //初始化查询数据
        platformStationManage.getDataTable({param:{}},'/postInfoManger/getDicLists')
            .then(function (data) {
                $scope.sysStationData=data.query.menu;
                $scope.searchModel=data.query;
                $scope.searchModel.postNameSelect=-1;
                getTable();
            });
        //获取table
        function getTable(){
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            //opts.postName = $scope.searchModel.postNameSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            platformStationManage.getDataTable({param:{query:opts}},'/postInfoManger/postInfoList')
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
                    $scope.result=data.grid;
                    $scope.paging = {
                        totalPage: data.total,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };
                });
        }
        //添加岗位 checkbox change事件
        $scope.checkedChange= function (item,check) {
            var isCheckFlag = false;
            angular.forEach(item.child, function (k) {
                if(!k.checked){
                    isCheckFlag = true;
                    return false;
                }
            });
            item.checked = !isCheckFlag;
        }
        $scope.checkedChangeAll= function (item) {
            angular.forEach(item.child, function (k) {
                k.checked=item.checked;
            });
        }
        //添加岗位model
        $scope.stationModel={
//            code:'',
            parentName:'',
            postName:'',
            postRemark:'',
            systemRoles:''
        };

        //添加岗位 确认
        $scope.enterAddStation= function () {
            $scope.stationModel.systemRoles='';
            //设置权限
            angular.forEach($scope.sysStationData, function (item) {
                angular.forEach(item.children, function (child) {
                    if(child.checked){
                        $scope.stationModel.systemRoles+=child.id+',';
                    }
                })
            });
            if($scope.stationModel.systemRoles!=''){
                $scope.stationModel.systemRoles=$scope.stationModel.systemRoles.substr(0,$scope.stationModel.systemRoles.length-1);
            }
            $scope.stationModel.postType=3;
            platformStationManage.getDataTable({param:{query:$scope.stationModel}},$scope.stationTitle=='添加岗位'?'/postInfoManger/addPost':'/postInfoManger/updatePost')
                .then(function (data) {
                    alert(data.status.msg);
                    if(data.status.code=="0000"){
                        getTable();
                        $('#addStation').modal('hide');
                    }
                });
        }

        //查询
        $scope.searchClick= function () {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            getTable();
        }
        //添加岗位按钮
        $scope.addStationClick= function () {
            $scope.stationTitle='添加岗位';
//            $scope.stationModel.code='';
            $scope.stationModel.parentName='';
            $scope.stationModel.postName='';
            $scope.stationModel.postRemark='';
            $scope.stationModel.systemRoles='';
            $('input[type="checkBox"]').attr('checked', false);
            $('#addStation').modal();
        }
        //修改岗位
        $scope.updateStation= function (i,item) {
            $scope.stationTitle='修改岗位';
            $scope.stationModel={
//                code:item.code,
                parentName:item.parentName,
                postName:item.postName,
                postRemark:item.postRemarks,
                systemRoles:'',
                id:item.id
            };
            if(item.systemRoles){
                var systemRolesArray=item.systemRoles.split(',');
                angular.forEach($scope.sysStationData, function (item) {
                    angular.forEach(item.children, function (child) {
                        if(systemRolesArray.indexOf(child.id.toString())>=0){
                            child.checked=true;
                        }
                    })
                });
            }
        }
        //删除
        $scope.storageDeleteCall= function (i,item) {
            if(confirm('确定删除吗?')){
                platformStationManage.getDataTable({param:{query:{id:item.id}}},'/postInfoManger/deletePost')
                    .then(function (data) {
                        alert(data.status.msg);
                        if(data.status.code=='0000'){
                            getTable();
                        }
                    });
            }
        }
      //冻结
        $scope.staFreeze= function (i,item) {
            if(confirm('确定冻结该岗位?')) {
            	platformStationManage.getDataTable({param:{query:{id:item.id,status:0}}}, '/postInfoManger/updatePostStatus')
                    .then(function (data) {
                        if(data.status.code=="0000"){
                        	 getTable();
                        }
                        alert(data.status.msg);
                    });
            }
        }
        //恢复
        $scope.staResume= function (i,item) {
            if(confirm('确定恢复该岗位?')) {
            	platformStationManage.getDataTable({param:{query:{id:item.id,status:-1}}}, '/postInfoManger/updatePostStatus')
                    .then(function (data) {
                        if(data.status.code=="0000"){
                        	 getTable();
                        }
                        alert(data.status.msg);
                    });
            }
        }
        $scope.goToPage= function () {
            getTable();
        }
        //分页下拉框
        $scope.pagingSelect = [
            {value: 5, text: 5},
            {value: 10, text: 10, selected: true},
            {value: 20, text: 20},
            {value: 30, text: 30},
            {value: 50, text: 50}
        ];
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        $scope.offChecked=function(item){
            angular.forEach($scope.sysStationData, function (item) {
                angular.forEach(item.children, function (child) {
                    if(child.checked){
                        child.checked=false;
                    }
                })
            });
        }
    }]);
});