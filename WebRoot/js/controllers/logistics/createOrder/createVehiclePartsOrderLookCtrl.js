/**
 * Created by xiaojiu on 2017/7/21.
 */
define(['../../../app','../../../services/logistics/createOrder/createVehiclePartsOrderLookService'], function (app) {
    var app = angular.module('app');
    app.controller('createVehiclePartsOrderLookCtrl',['$scope','$state','$stateParams','createVehiclePartsOrderLook', '$window', function ($scope,$state,$stateParams,createVehiclePartsOrderLook,$window) {
        //table头
        $scope.thHeader = createVehiclePartsOrderLook.getThead();
        $scope.banner={};
        //获取选中 设置对象参数
        var opts ={
            taskId:$stateParams['taskId'],
            waybillId:$stateParams['waybillId'],
            flag:1,
        }
        $scope.isAmountShow=true;
        var promise = createVehiclePartsOrderLook.getDataTable({param: {query: opts}});
        promise.then(function (data) {
            data.query.status ==0 ? $scope.isAmountShow=false :$scope.isAmountShow=true;
            $scope.result = data.grid;
            $scope.banner=data.query;
            var num=0;
            angular.forEach($scope.result, function (item) {
                 num += parseFloat(item.pay);
                 
            });
            num = num.toFixed(2);
            $scope.amountModel.amountTo = num;
        }, function (error) {
            console.log(error);
        });
        //合计
       $scope.amountModel={
           amountTo:''
       }
        // 返回
        $scope.goBack = function(){
            $window.history.back();
        }
    }]);
});