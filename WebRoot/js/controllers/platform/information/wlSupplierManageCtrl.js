/**
 * Created by xiaojiu on 2017/3/22.
 */
'use strict';
define(['../../../app', '../../../services/platform/information/wlSupplierManageService'], function(app) {
    var app = angular.module('app');
    app.controller('wlSupplierManageCtrl', ['$scope', '$state', '$sce', 'wlSupplierManage', function($scope, $state, $sce, wlSupplierManage) {
    	  $scope.searchModel={};
          // query moudle setting
          $scope.querySeting = {
              items: [{
                  type: 'text',
                  model: 'owerckName',
                  title: '仓库名称'
              }],
              btns: [{
                  text: $sce.trustAsHtml('查询'),
                  click: 'searchClick'
              }]
          };
          var pmsSearch = wlSupplierManage.getSearch();
          pmsSearch.then(function (data) {
              $scope.searchModel = data.query;
              //获取table数据

              get();
          }, function (error) {
              console.log(error)
          });

        //table头
        $scope.thHeader = wlSupplierManage.getThead();
        //查询
        $scope.searchClick= function () {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
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
            showRows: 10
        };
       
        
        function get() {
            //获取选中 设置对象参数
        	 var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = wlSupplierManage.getDataTable({
                param: {query:opts}
            },'/wlSupplier/queryWlSupplierList');
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
        //新车辆model
        $scope.newCar={
        		"id":'',
            "owerckName":'',
            "deliveryFacilitator":'',
            "bindGarageAmount":'',
            "lineName":"",
            "wlType": "1",
            "payType":"1",
            "instruction":"",
            "licenseNumber":"",
            "deliveryRate":"",
            "motorcycleType":"",
            wlTypeSelect:null,
            payTypeSelect:null
        };

//        $scope.addCarTitle='新增物流供应商';
        //新增车辆
        $scope.addCar= function () {
//            if($scope.newCar.vehicleState=='全部'){
//                alert('请选择状态!');
//                return;
//            }
        	  if($scope.newCar.wlType==-1){
                  alert('请选择配送类型!');
                  return;
              }
            if($scope.newCar.payType==-1){
                alert('请选择结算方式!');
                return;
            }
            var postResult=angular.extend({},$scope.newCar,{});
            delete postResult.wlTypeSelect;
            delete postResult.payTypeSelect;
            wlSupplierManage.getDataTable({
                    param: {
                        query: postResult
                    }
                },$scope.addCarTitle=='新增物流供应商'?'/wlSupplier/insertWlSupplier':'/wlSupplier/updateWlSupplier')
                .then(function (data) {
//                    alert(data.status.msg);
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
        	
        	 $scope.newCar.owerckName=item.owerckName;
        	 $scope.newCar.id=item.id;
             $scope.newCar.deliveryFacilitator=item.deliveryFacilitator;
             $scope.newCar.bindGarageAmount=item.bindGarageAmount;
             $scope.newCar.lineName=item.lineName;
             $scope.newCar.instruction=item.instruction;
             $scope.newCar.licenseNumber=item.licenseNumber;
             $scope.newCar.deliveryRate=item.deliveryRate;
             $scope.newCar.motorcycleType=item.motorcycleType;
            wlSupplierManage.getDataTable({
                param: {
                    "query":{
                        "id":item.id
                    }
                }
            },'/wlSupplier/initUpdateWlSupplier')
            .then(function (data) {
//                alert(data.status.msg)
                if(data.status.code=="0000") {
                	  $scope.addCarTitle='修改物流供应商';
                	 $scope.newCar.wlTypeSelect= data.query.wlType;
                	 $scope.newCar.payTypeSelect= data.query.payType;
                    
                     angular.forEach($scope.newCar.wlTypeSelect, function (k) {
                         if(k.name==item.wlType) {
                             $scope.newCar.wlType = k.id;
                             return false;
                         }
                     });
                     //设置选中状态
                     angular.forEach($scope.newCar.payTypeSelect, function (k) {
                         if(k.name==item.payType) {
                             $scope.newCar.payType = k.id;
                             return false;
                         }
                     });
                   
                }
            }, function (error) {
                console.log(error)
            });
       
        }
        //查看车辆回调
        $scope.queryCar= function (index,item) {
            $scope.addCarTitle='查看车辆';
            $scope.newCar.carId=item.carId;
            $scope.newCar.id=item.id;
            $scope.newCar.vehicleName=item.vehicleName;
            $scope.newCar.licenseNumber=item.licenseNumber;
            $scope.newCar.vehicleModel=item.vehicleModel;
            $scope.newCar.drivingNum=item.drivingNum;
            $scope.newCar.vehicleDescription=item.vehicleDescription;
            $scope.newCar.vehicleUnit=item.vehicleUnit;
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
            wlSupplierManage.getDataTable({
                    param: {
                        "query":{
                            
                            "id":item.id
                        }
                    }
                },'/wlSupplier/changeWlSupplierState')
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
            wlSupplierManage.getDataTable({
                    param: {
                        "query":{
                            "id":0
                        }
                    }
                },'/wlSupplier/initAddWlSupplier')
                .then(function (data) {
//                    alert(data.status.msg)
                    if(data.status.code=="0000") {
                    	 $scope.newCar.wlTypeSelect= data.query.wlType;
                    	 $scope.newCar.payTypeSelect= data.query.payType;
                    	 $scope.addCarTitle='新增物流供应商';
                         $scope.newCar.owerckName="";
                         $scope.newCar.deliveryFacilitator="";
                         $scope.newCar.bindGarageAmount="";
                         $scope.newCar.lineName="";
                         $scope.newCar.instruction="";
                         $scope.newCar.licenseNumber="";
                         $scope.newCar.deliveryRate="";
                         $scope.newCar.motorcycleType="";
                         $scope.newCar.wlType= "1";
                    	 $scope.newCar.payType= "1";
                    }
                }, function (error) {
                    console.log(error)
                });
           
        }
    }])
});