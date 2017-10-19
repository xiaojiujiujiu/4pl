/**
 * Created by xuwusheng on 15/12/10.
 */
define(['../../../app','../../../services/storage/storage/takegoodsConfirmService'], function (app) {
     var app = angular.module('app');     app.controller('takegoodsConfirmCtrl',['$scope','$state','$stateParams','$window','takegoodsConfirm', function ($scope,$state,$stateParams,$window,takegoodsConfirm) {
        //table头
        $scope.thHeader = takegoodsConfirm.getThead();
        $scope.banner={};
        //获取选中 设置对象参数
        var opts ={
            taskId:$stateParams['taskId']
        }
        var promise = takegoodsConfirm.getDataTable({param: {query: opts}});
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
            //$state.go('main.checkstorage',{taskId:$stateParams['taskId']});
        }
        //打印
        $scope.print= function () {

        }
        //导航
        $scope.navClick= function (i) {
            switch (i){
                case 0:
                    $state.go('main.takegoods');
                    break;
                case 1:
                    $state.go('main.checkstorage',{taskId:$stateParams['taskId']});
                    break;
                case 2:
                    $state.go('main.takegoodsconfirm',{taskId:$stateParams['taskId']});
                    break;
            }
        }
    }]);
});