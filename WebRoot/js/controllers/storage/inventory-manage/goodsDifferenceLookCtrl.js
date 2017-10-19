/**
 * 
 * @authors Hui Sun 
 * @date    2015-12-10 16:17:32
 * @version $Id$
 */
'use strict';
define(['../../../app', '../../../services/storage/inventory-manage/goodsDifferenceLookService'], function(app) {
     var app = angular.module('app');     app.controller('goodsDifferenceLookCtrl', ['$scope', '$state', '$stateParams', '$sce','$rootScope', 'goodsDifferenceLook', function($scope, $state, $stateParams, $sce,$rootScope, goodsDifferenceLook) {
       
        //table头
        $scope.thHeader = goodsDifferenceLook.getThead();

        $scope.exGoodsAlloParam={
                	query:{
                		taskId: $stateParams['taskId'],
                		custTaskId: $stateParams['custTaskId']
                	}
            };
        var pmsBanner = goodsDifferenceLook.getBanner({param:$scope.exGoodsAlloParam});
        pmsBanner.then(function(data) {
        	$scope.result = data.grid;
            $scope.banner = data.banner
            // get();
        })
        
        $scope.goBack = function(){
        	$state.go('main.goodsDifferenceManage');
        }
        if($rootScope.previousStateName=='main.goodsDifferenceManage'){
        	$scope.action="/differentMonitor/impDetailToExcel";
        }else if($rootScope.previousStateName=='main.differenceConfirmation'){
        	$scope.action="/differentMonitor/impDetailToXls";
        }
        //定义表单模型
        $scope.goodsDifferenceModel={
            packageDamage:'',
            damage:'',
            lost:'',
            id:''
        }
        //查看差异
        $scope.checkDetail=function(i,item){
            $scope.goodsDifferenceModel.id=item.id;
            var opts={};
            opts.id=item.id;
            var sendParams = {
                param: {
                    query:opts
                }
            }
            var pmsBanner = goodsDifferenceLook.getDataTable(sendParams);
            pmsBanner.then(function(data) {
                $scope.goodsDifferenceModel.packageDamage=data.banner.packageDamage;
                $scope.goodsDifferenceModel.damage=data.banner.damage;
                $scope.goodsDifferenceModel.lost=data.banner.lost;
            })
        }
        //分页跳转回调
        /*$scope.goToPage = function() {
            get()
        }*/
    }])
});