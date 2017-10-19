/**
 * Created by xiaojiu on 2017/3/30.
 */
define(['../../../app','../../../services/platform/confirmInventOrder/confirmInventOrderConfirmService'], function (app) {
    var app = angular.module('app');
    app.controller('confirmInventOrderConfirmCtrl', ['$rootScope','$scope','$state', '$sce', '$timeout','$window', 'confirmInventOrderConfirm','$stateParams', function ($rootScope,$scope, $state,$sce, $timeout,$window, confirmInventOrderConfirm,$stateParams) {
        //theadr
        $scope.thHeader = confirmInventOrderConfirm.getThead();
        $scope.banner={};
        //获取选中 设置对象参数
        var opts ={
            taskId:$stateParams['taskId']
        }
        var promise = confirmInventOrderConfirm.getDataTable({param: {query: opts}});
        promise.then(function (data) {
            if(data.code==-1){
                alert(data.message);
                $scope.result = [];
                return false;
            }
            $scope.result = data.grid;
            $scope.banner=data.banner;
            $scope.banner.taskId=$stateParams['taskId'];
        }, function (error) {
            console.log(error);
        });
        //确认通过
        $scope.confirmAdopt=function(){
            var opts ={
                taskId:$stateParams['taskId'],
                status:1,
            }
            confirmInventOrderConfirm.getDataTable({param: {query: opts}},'/ckInventory/updateStatu')
                .then(function(data){
                   if(data.status.code=="0000"){
                       alert(data.status.msg);
                       $("#adopt").modal("hide");
                       $state.go("main.confirmInventOrder")
                   }
                })
        }
        $scope.rejectModel={
            refuseRemark:''
        }
        //确定驳回
        $scope.confirmReject=function(){
            var opts ={
                taskId:$stateParams['taskId'],
                status:3,
                refuseRemark:$scope.rejectModel.refuseRemark
            }
            confirmInventOrderConfirm.getDataTable({param: {query: opts}},'/ckInventory/updateStatu')
                .then(function(data){
                    if(data.status.code=="0000"){
                        alert(data.status.msg);
                        $("#reject").modal("hide");
                        $state.go("main.confirmInventOrder")
                    }

                })
        }
        //取消驳回
        $scope.close=function(){
            $scope.rejectModel={
                refuseRemark:''
            }
        }
        //返回
        $scope.update= function () {
            $window.history.back();
        }

    }]);
});