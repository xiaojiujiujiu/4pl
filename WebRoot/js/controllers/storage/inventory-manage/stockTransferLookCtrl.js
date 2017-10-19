/**
 * Created by xiaojiu on 2017/3/27.
 */
define(['../../../app','../../../services/storage/inventory-manage/stockTransferLookService'], function (app) {
    var app = angular.module('app');
    app.controller('stockTransferLookCtrl', ['$rootScope','$scope', '$sce', '$timeout','$window', 'stockTransferLook','$stateParams', function ($rootScope,$scope, $sce, $timeout,$window, stockTransferLook,$stateParams) {
        //theadr
        $scope.thHeader = stockTransferLook.getThead();
        $scope.banner={};
        $scope.isShow=true;
        //获取选中 设置对象参数
        var opts ={
            taskId:$stateParams['taskId']
        }
        var promise = stockTransferLook.getDataTable({param: {query: opts}});
        promise.then(function (data) {
            if(data.code==-1){
                alert(data.message);
                $scope.result = [];
                return false;
            }
            $scope.result = data.grid;
            $scope.banner=data.banner;
            if(!!$scope.banner.refuseRemark){
                $scope.isShow=true;
            }else {
                $scope.isShow=false;
            }
            $scope.banner.taskId=$stateParams['taskId'];
        }, function (error) {
            console.log(error);
        });
        //返回
        $scope.update= function () {
            $window.history.back();
        }

    }]);
});