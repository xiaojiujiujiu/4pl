/**
 * Created by xiaojiu on 2017/3/27.
 */
define(['../../../app','../../../services/storage/orderReceipt/cdcOrderReceiptLookService'], function (app) {
    var app = angular.module('app');
    app.controller('cdcOrderReceiptLookCtrl',['$scope','$state','$stateParams','$window','cdcOrderReceiptLook', function ($scope,$state,$stateParams,$window,cdcOrderReceiptLook) {
        //table头
        $scope.thHeader = cdcOrderReceiptLook.getThead();
        $scope.banner={};
        //获取选中 设置对象参数
        var opts ={
            taskId:$stateParams['taskId']
        }
        var promise = cdcOrderReceiptLook.getDataTable({param: {query: opts}});
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
        //返回
        $scope.update= function () {
            $window.history.back();
        }
        //打印
        $scope.print= function () {

        }
    }]);
});