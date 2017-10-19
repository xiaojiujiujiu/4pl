/**
 * Created by xiaojiu on 2017/3/25.
 */
define(['../../../app','../../../services/storage/storage-permissionManage/storageEquipmentManagementService'], function (app) {
    var app = angular.module('app');
    app.controller('storageEquipmentManagementCtrl', ['$rootScope', '$scope','$sce','$window','storageEquipmentManagement', function ($rootScope,$scope,$sce,$window,storageEquipmentManagement) {
        //theadr
        $scope.thHeader=storageEquipmentManagement.getThead();
        //分页下拉框
        $scope.pagingSelect = [
            { value: 5, text: 5 },
            { value: 10, text: 10, selected: true },
            { value: 20, text: 20 },
            { value: 30, text: 30 },
            { value: 50, text: 50 }
        ];
        //日志分页下拉框
        $scope.pagingSelect = [
            { value: 5, text: 5 },
            { value: 10, text: 10, selected: true },
            { value: 20, text: 20 },
            { value: 30, text: 30 },
            { value: 50, text: 50 }
        ];
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };        
        function query(){
        	var opts = {};
            storageEquipmentManagement.getDataTable('/Ckequipment/getDicLists',{ param: { query: opts } })
                .then(function (data) {
                    $rootScope.userId=data.query.userId;
                    $scope.equipmentType.select=data.query.equipmentType;
                    $scope.useStaff.select=data.query.useStaff;
                    $scope.useStaff.id=data.query.userId;
                    $scope.ownership.select=data.query.ownership;
                });
        }
        query()
   
        function getTable(){
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            storageEquipmentManagement.getDataTable('/Ckequipment/queryCkEquipmentList',{ param: { query: opts } })
                .then(function (data) {
                    if(data.grid.length<=0){
                        $scope.isData=false;
                    }else {
                        $scope.isData=true;
                    }
                    $scope.result=data.grid;
                    $scope.banner=data.banner;
                    $scope.paging = {
                        totalPage: data.total,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };
                });
        }

        getTable();
        $scope.goToPage= function () {
            getTable();
        }

        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        //添加设备model
        $scope.addEquipmentModel={
            "equipmentName":'',
            "type":'',
            "SNCode":'',
            "number":'',
            "price":'',
            "money":'',
            "buyTime":'',
            "useStaff":'',
            "equipmentType":'',
            "ownership":'',
            "remark":'',
        };
        $scope.equipmentType={
            select:'',
            id:'-1'
        }
        $scope.useStaff={
            select:'',
            id:$rootScope.userId
        }
        $scope.ownership={
            select:'',
            id:'-1'
        }
        $scope.addTitle='添加设备';
        //添加设备
        $scope.addStationClick= function () {
            $scope.addTitle='添加设备';
            $scope.equipmentType.id='1';
            $scope.ownership.id='1';
            $scope.useStaff.id=$rootScope.userId;
            $scope.addEquipmentModel={
                "equipmentName":'',
                "type":'',
                "SNCode":'',
                "number":'',
                "price":'',
                "money":'',
                "buyTime":'',
                "useStaff":'',
                "equipmentType":'',
                "ownership":'',
                "remark":'',
            };
        }
        //添加设备 确认
        $scope.enterAddStation= function () {
            //if($scope.equipmentType.id=='-1'){
            //    alert('请选择设备类型');
            //    return false;
            //}
            //if($scope.useStaff.id=='-1'){
            //    alert('请选择使用/保管人员');
            //    return false;
            //}
            if($scope.addEquipmentModel.number<=0){
                alert('数量不能为0！');
                return false;
            }
            var opt={
                "equipmentName": $scope.addEquipmentModel.equipmentName,
                "type":$scope.addEquipmentModel.type,
                "SNCode":$scope.addEquipmentModel.SNCode,
                "number":$scope.addEquipmentModel.number,
                "price":$scope.addEquipmentModel.price,
                "money":$scope.addEquipmentModel.money,
                "buyTime":$scope.addEquipmentModel.buyTime,
                "remark":$scope.addEquipmentModel.remark,
                "useStaff":$scope.useStaff.id,
                "equipmentType":$scope.equipmentType.id,
                "ownership":$scope.ownership.id,                
                "id":$rootScope.id
            };

            storageEquipmentManagement.getDataAdd({param:{query:opt}},$scope.addTitle=='添加设备'?'/Ckequipment/insertCkEquipment':'/Ckequipment/updateCkEquipment')
                .then(function (data) {
                    alert(data.status.msg);
                    if(data.status.code=="0000"){
                        getTable();
                        $('#addEquipment').modal('hide');
                    }
                });
        }
        //修改
        $scope.updateStation=function(i,item){
            $rootScope.id=item.id;
            $scope.equipmentType.id=item.equipmentTypeId;
            $scope.ownership.id=item.ownershipId;
            $scope.useStaff.id=item.useStaffId;
            $scope.addTitle='修改设备';
            $scope.addEquipmentModel={
                "equipmentName": item.equipmentName,
                "type":item.type,
                "SNCode":item.SNCode,
                "number":item.number,
                "price":item.price,
                "money":item.money,
                "buyTime":item.buyTime,
                "remark":item.remark,
                "useStaff":item.useStaffId,
                "equipmentType":$scope.equipmentType.id,//$scope.equipmentType.id
                "ownership":item.ownership, //item.equipmentTypeId
                'id':item.id,
            };
        }
        //删除
        $scope.delete= function (i,item) {
            if(confirm('确定删除吗?')) {
                storageEquipmentManagement.getDataAdd({param:{query:{id:item.id}}}, '/Ckequipment/deleteCkEquipment')
                    .then(function (data) {
                        if(data.status.code=="0000"){
                            getTable();
                        }
                        alert(data.status.msg);
                    });
            }
        }
        //打印
        $scope.print=function(i,item){
            $window.open('../print/equipmentCodePrint.html?tokenId='+$rootScope.userInfo.token+'&sessionid='+$rootScope.userInfo.sessionId+'&id='+item.id);//sessionId+'&taskId='+item.taskId
        }
        
    }]);
});