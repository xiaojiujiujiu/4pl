/**
 * Created by xiaojiu on 2017/7/21.
 */
'use strict';
define(['../../../app','../../../services/logistics/createOrder/createVehiclePartsOrderChuService'], function (app) {
    var app = angular.module('app');
    app.controller('createVehiclePartsOrderChuCtrl',['$rootScope','$scope','$state','$stateParams','createVehiclePartsOrderChu', '$window', function ($rootScope,$scope,$state,$stateParams,createVehiclePartsOrderChu,$window) {
        //table头
        $scope.thHeader = createVehiclePartsOrderChu.getThead();
        $scope.banner={};
        //获取选中 设置对象参数
        var opts ={
            taskId:$stateParams['taskId'],
            waybillId:$stateParams['waybillId'],
        }
        $scope.isAmountShow=true;
        var promise = createVehiclePartsOrderChu.getDataTable({param: {query: opts}});
        promise.then(function (data) {
        	if (data.status.code == "0000") {
            data.query.status ==0 ? $scope.isAmountShow=false :$scope.isAmountShow=true;
            $scope.result = data.grid;
            $scope.banner=data.query;
            $scope.newIndentModel.wlDeptNameSelect=data.query.wlDeptName;
            $scope.newIndentModel.wlDeptName=data.query.state;
            $scope.dataList=data.query.carrierName;
            var num=0;
            angular.forEach($scope.result, function (item) {
                if(item.pay && item.pay!=''){
                    num +=  parseFloat(item.pay);
                }
            });
            num = num.toFixed(2);
            $scope.amountModel.amountTo = num;
        	 } else{
        		 $window.history.back();
        	 }   
        }, function (error) {
            console.log(error);
            
        });
        //合计
       $scope.amountModel={
           amountTo:''
       }
        $scope.payWatch=function(){
           var num = 0;
            angular.forEach($scope.result, function (k) {
            	var str = k.pay;
            	var n = Number(str);
            	if (isNaN(n))
            	{
            		alert("请输入正确的运费");
            	}
                if(k.pay && k.pay!=''){
                    num +=  parseFloat(k.pay);
                }
            });
            num = num.toFixed(2);
            $scope.amountModel.amountTo = num;
        }   

        //发货model
        $scope.newIndentModel={
            carrierName:'',
            wlDeptName:$scope.banner.state,
            wlDeptNameSelect:$scope.banner.state,
            mobilePhone:'',
            carrierMan:'',
            thirdWlId:'',
            pay:''
        }
        $scope.operationTitle="发货信息";
        $scope.isWlDeptShow=true;
        $scope.sendGoods=function(flag){
            $rootScope.flag=flag;
            $scope.newIndentModel.pay = $scope.amountModel.amountTo;
            if(flag==0){
                $scope.operationTitle="发货信息";
                $scope.isWlDeptShow=false;
            }else {
                $scope.operationTitle="中转信息";
                $scope.isWlDeptShow=true;
            }
            $("#sendGoods").modal("show");
        }
        $scope.isShow =false;
        $scope.showListFun =function(){
            $scope.isShow =!$scope.isShow;
        }
        $scope.listSelect = function(item){
            $scope.isShow =!$scope.isShow;
            $scope.newIndentModel.carrierName=item.name;
            createVehiclePartsOrderChu.confirmInCk({
                param: {
                    query:{
                        carrierName:item.name
                    }
                }
            },'/vehicleParts/getCompInformation')
                .then(function(data){
                    console.log(data)
                    if (data.status.code == "0000") {
                       $scope.newIndentModel.carrierMan = data.query.carrierMan;
                       $scope.newIndentModel.mobilePhone = data.query.mobilePhone;
                    }
                })
        }
        //确认发货
        $scope.operationEnterAdd=function(){
            var opts = angular.extend({}, $scope.newIndentModel, {});
            delete opts.wlDeptNameSelect;
            opts.taskId=$stateParams['taskId'];
            opts.list= $scope.result;
            opts.waybillId=$scope.banner.waybillId;
            createVehiclePartsOrderChu.confirmInCk({
                    param: {
                        query: opts
                    }
                },$rootScope.flag== 0 ? '/vehicleParts/confirmDelivery' : '/vehicleParts/confirmTransit')

                .then(function (data) {
                    if (data.status.code == "0000") {
                        alert(data.status.msg);
                        $('#sendGoods').modal('hide');
                       
                    } else{
                    	 alert(data.status.msg);
                        $('#sendGoods').modal('hide');
                    
                    }
                    $window.history.back();
                })
                
        }
        //取消
        $scope.deleteData=function(){
            $scope.newIndentModel.carrierName='';
            $scope.newIndentModel.mobilePhone='';
            $scope.newIndentModel.carrierMan='';
            $scope.newIndentModel.thirdWlId='';
        }
        // 返回
        $scope.goBack = function(){
            $window.history.back();
        }
    }]);
});