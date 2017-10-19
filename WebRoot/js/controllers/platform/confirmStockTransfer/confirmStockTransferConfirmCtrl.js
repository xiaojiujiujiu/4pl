/**
 * Created by xiaojiu on 2017/3/28.
 */
define(['../../../app','../../../services/platform/confirmStockTransfer/confirmStockTransferConfirmService'], function (app) {
    var app = angular.module('app');
    app.controller('confirmStockTransferConfirmCtrl', ['$rootScope','$scope','$state', '$sce', '$timeout','$window', 'confirmStockTransferConfirm','$stateParams', function ($rootScope,$scope,$state, $sce, $timeout,$window, confirmStockTransferConfirm,$stateParams) {
        //theadr
        $scope.thHeader = confirmStockTransferConfirm.getThead();
        $scope.banner={};
        //获取选中 设置对象参数
        var opts ={
            taskId:$stateParams['taskId']
        }
        var promise = confirmStockTransferConfirm.getDataTable({param: {query: opts}});
        promise.then(function (data) {
            if(data.code==-1){
                alert(data.message);
                $scope.result = [];
                return false;
            }
            $scope.result = data.grid;
            $rootScope.transferCount= $scope.result[0].transferCount
            $scope.banner=data.banner;
            $scope.banner.taskId=$stateParams['taskId'];
        }, function (error) {
            console.log(error);
        });
       
        //点击 通过 or 驳回 按钮
        $scope.adopt=function(i){
            var opts ={
                taskId:$stateParams['taskId'],
            }
            confirmStockTransferConfirm.getDataTable({param: {query: opts}},'/stockTransfer/updateStatu')
                .then(function(data){
                	if(data.status.code!="0000") {
                		alert(data.status.msg);
                	}else{
                		if(i==1){
                			$("#adopt").modal("show");
                		}
                		if(i==2){
                			$("#reject").modal("show");
                		}
                	}
                })
        }
        ////确认通过
        $scope.confirmAdopt=function(i){
            var opts ={
                taskId:$stateParams['taskId'],
                orderStatus:1,
                transferCount:$rootScope.transferCount,
            }
            if(i==1){
                opts.flag=true;
            }else {
                opts.flag=false;
            }
            confirmStockTransferConfirm.getDataTable({param: {query: opts}},'/stockTransfer/confirmOrCancelUpdateStatu')
                .then(function(data){

                	if(i==1){
                		opts.flag=true;
                		alert(data.status.msg);
                	}
                    $("#adopt").modal("hide");
                    
                    if(opts.flag){
                    	$state.go("main.confirmStockTransfer");
                    }
//                   if(data.status.code=="0000"){
//                       alert(data.status.msg);
//                       $("#adopt").modal("hide");
//                       $state.go("main.confirmStockTransfer");
//                   }

                })
        }
        $scope.rejectModel={
            refuseRemark:''
        }
        $scope.flag=true;
        //确定驳回/确认通过
        $scope.confirmReject=function(i){
            var opts ={
                taskId:$stateParams['taskId'],
                refuseRemark:$scope.rejectModel.refuseRemark,
                transferCount:$rootScope.transferCount,
                orderStatus:3,
            }
            if(i==1){
                opts.flag=true;
            }else {
                opts.flag=false;
                $scope.rejectModel={
                    refuseRemark:''
                }
            }
            confirmStockTransferConfirm.getDataTable({param: {query: opts}},'/stockTransfer/confirmOrCancelUpdateStatu')
                .then(function(data){

                	if(i==1){
                		opts.flag=true;
                		alert(data.status.msg);
                	}
                    $("#reject").modal("hide");
                    if(opts.flag){
                    	$state.go("main.confirmStockTransfer");
                    }
                    

//                    if(data.status.code=="0000") {
//                        alert(data.status.msg);
//                        $("#reject").modal("hide");
//                        $state.go("main.confirmStockTransfer");
//                    }
                })
        }
        //返回
        $scope.update= function () {
            $window.history.back();
        }

    }]);
});