/**
 * Created by xuwusheng on 15/12/10.
 */
define(['../../../app','../../../services/platform/settle-accounts/differenceCheckService'], function (app) {
     var app = angular.module('app');
    app.controller('differenceCheckCtrl',['$scope','$state','$stateParams','differenceCheck', '$window', function ($scope,$state,$stateParams,differenceCheck,$window) {
        //table头
        $scope.thHeader = differenceCheck.getThead();
        $scope.banner={};
        //获取选中 设置对象参数
        var opts ={
            taskId:$stateParams['taskId'],
            custTaskId:$stateParams['custTaskId'],
            checkCount:$stateParams['checkCount']
        }
        var promise = differenceCheck.getDataTable({param: {query: opts}});
        promise.then(function (data) {
        	// console.log(data)
            $scope.result = data.grid;
            $scope.banner=data.banner;
        }, function (error) {
            console.log(error);
        });
        $scope.exGoodsAlloParam={query: opts};
        // 返回
        $scope.goBack = function(){
            $window.history.back();
        }
    }]);
});