/**
 * Created by xiaojiu on 2017/3/22.
 */
'use strict';
define(['../../../app', '../../../services/storage/storage-permissionManage/storageCarManageService'], function(app) {
    var app = angular.module('app');
    app.controller('storageCarManageCtrl', ['$scope', '$state', '$sce', 'storageCarManage', function($scope, $state, $sce, storageCarManage) {
        // 商品条码查询
        $scope.searchBarcode = function(barCode){
            alert(barCode)
        }

        //table头
        $scope.thHeader = storageCarManage.getThead();
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
            showRows: 10
        };
       
          get();
        
        function get() {
            //获取选中 设置对象参数
            var opts ={};
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = storageCarManage.getDataTable({
                param: {query:opts}
            });
            promise.then(function(data) {
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
            }, function(error) {
                console.log(error);
            });
        }
        //编辑输入框显示隐藏
        $scope.isShow=false;
        $scope.toggleInput=function(){
            if($scope.newCar.property==="1"){
                $scope.isShow=!$scope.isShow;
            }else if($scope.newCar.property==="2"){
                $scope.isShow=!$scope.isShow;
            }
        }
        //新车辆model
        $scope.newCar={
        		"id":0,
            "vehicleName":'',
            "rent":'',
            "leaseDate":'',
            "licenseNumber":"",
            "leaseType": -1,
            "property":-1,
            "leaseTime":-1,
            "salesDate":"",
            "remarks":"",
            "originalValue":"",
            leaseTypeSelect:null,
            propertySelect:null,
            leaseTimeSelect:null
        };

        $scope.addCarTitle='新增车辆';
        //新增车辆
        $scope.addCar= function () {
//            if($scope.newCar.vehicleState=='全部'){
//                alert('请选择状态!');
//                return;
//            }
//            var date1=$scope.newCar.leaseDate,date2=$scope.newCar.salesDate;
//            date1=new Date(date1).getTime();
//            date2=new Date(date2).getTime();
//            if(date1<date2){
//                alert('起租日不能小于购入时间');
//                return false;
//            }
//        	  if($scope.newCar.property==-1){
//                  alert('请选择权属!');
//                  return;
//              }
//            if($scope.newCar.leaseType==-1){
//                alert('请选择租赁模式!');
//                return;
//            }
//
//            if($scope.newCar.leaseTime==-1){
//                alert('请选择租期!');
//                return;
//            }
            var postResult=angular.extend({},$scope.newCar,{});
            delete postResult.leaseTypeSelect;
            delete postResult.propertySelect;
            delete postResult.leaseTimeSelect;
            storageCarManage.getDataTable({
                    param: {
                        query: postResult
                    }
                },$scope.addCarTitle=='新增车辆'?'/CkCar/saveCkCar':'/CkCar/updateCkCar')
                .then(function (data) {
                    alert(data.status.msg);
                    if(data.status.code=="0000") {
                        get();
                        $('#addCar').modal('hide');
                    }
                }, function (error) {
                    console.log(error)
                });
        }
        //编辑车辆回调
        $scope.editCar= function (index,item) {
        	 $scope.newCar.licenseNumber=item.licenseNumber;
             $scope.newCar.vehicleName=item.vehicleName;
             $scope.newCar.rent=item.rent;
             $scope.newCar.leaseDate=item.leaseDate;
             $scope.newCar.salesDate=item.salesDate;
             $scope.newCar.remarks=item.remarks;
             $scope.newCar.id=item.id;
             $scope.newCar.originalValue=item.originalValue;
            storageCarManage.getDataTable({
                param: {
                    "query":{
                        "id":item.id
                    }
                }
            },'/CkCar/updateCkCarInit')
            .then(function (data) {
//                alert(data.status.msg)
                if(data.status.code=="0000") {
                	  $scope.addCarTitle='修改车辆';
                	  $scope.newCar.leaseType= "1";
                	  $scope.newCar.leaseTime= "1";
                	 $scope.newCar.leaseTypeSelect= data.query.leaseType;
                	 $scope.newCar.propertySelect= data.query.property;
                	 $scope.newCar.leaseTimeSelect= data.query.leaseTime;
                    
                     angular.forEach($scope.newCar.leaseTypeSelect, function (k) {
                         if(k.name==item.leaseType) {
                             $scope.newCar.leaseType = k.id;
                             return false;
                         }
                     });
                     //设置选中状态
                     angular.forEach($scope.newCar.propertySelect, function (k) {
                         if(k.name==item.property) {
                             $scope.newCar.property = k.id;
                             if($scope.newCar.property==="1"){
                                 $scope.isShow=false;
                             }else if($scope.newCar.property==="2"){
                                 $scope.isShow=true;
                             }
                             return false;
                         }
                     });
                     angular.forEach($scope.newCar.leaseTimeSelect, function (k) {
                         if(k.name==item.leaseTime) {
                             $scope.newCar.leaseTime = k.id;
                             return false;
                         }
                     });
                }
            }, function (error) {
                console.log(error)
            });
       
        }
        // 冻结
        $scope.freezeCar= function (index,item) {
            if(confirm('确定冻结吗?'))
                freezeAndRecovery(item);
        }
        //恢复
        $scope.recovery= function (index,item) {
            if(confirm('确定恢复吗?'))
                freezeAndRecovery(item);
        }
        function freezeAndRecovery(item){
            storageCarManage.getDataTable({
                    param: {
                        "query":{
                            
                            "id":item.id
                        }
                    }
                },'/CkCar/changeCkCarState')
                .then(function (data) {
                    alert(data.status.msg)
                    if(data.status.code=="0000") {
                        get();
                    }
                }, function (error) {
                    console.log(error)
                });
        }
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
        $scope.addData=function(){
            storageCarManage.getDataTable({
                    param: {
                        "query":{
                            "id":0
                        }
                    }
                },'/CkCar/getInitDicLists')
                .then(function (data) {
//                    alert(data.status.msg)
                    if(data.status.code=="0000") {
                    	 $scope.newCar.leaseTypeSelect= data.query.leaseType;
                    	 $scope.newCar.propertySelect= data.query.property;
                    	 $scope.newCar.leaseTimeSelect= data.query.leaseTime;
                    	 $scope.addCarTitle='新增车辆';
                         $scope.newCar.licenseNumber="";
                         $scope.newCar.vehicleName="";
                         $scope.newCar.rent="";
                         $scope.newCar.leaseDate="";
                         $scope.newCar.salesDate="";
                         $scope.newCar.remarks="";
                         $scope.newCar.originalValue="";
                         $scope.newCar.leaseType= "1";
                    	 $scope.newCar.property= "1";
                    	 $scope.newCar.leaseTime= "1";
                    	 $scope.isShow=false;
                    }
                }, function (error) {
                    console.log(error)
                });
           
        }
    }])
});