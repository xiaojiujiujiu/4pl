/**
 *
 * @authors Hui Sun
 * @date    2015-12-10 16:17:32
 * @version $Id$
 */
'use strict';
define(['../../../app', '../../../services/storage/inventory-manage/differenceConfirmationLookService'], function(app) {
     var app = angular.module('app');     app.controller('differenceConfirmationLookCtrl', ['$scope', '$state', '$stateParams', '$sce','$rootScope', 'differenceConfirmationLook', function($scope, $state, $stateParams, $sce,$rootScope, differenceConfirmationLook) {

        //table头
        $scope.thHeader = differenceConfirmationLook.getThead();

        $scope.exGoodsAlloParam={
            query:{
                taskId: $stateParams['taskId'],
                custTaskId: $stateParams['custTaskId'],
                checkCount: $stateParams['checkCount']
            }
        };
        var pmsBanner = differenceConfirmationLook.getBanner({param:$scope.exGoodsAlloParam});
        pmsBanner.then(function(data) {
            $scope.result = data.grid;
            $scope.banner = data.banner
            // get();
        })

        $scope.goBack = function(){
            $state.go('main.differenceConfirmation');

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
            var pmsBanner = differenceConfirmationLook.getDataTable(sendParams);
            pmsBanner.then(function(data) {
                $scope.goodsDifferenceModel.packageDamage=data.banner.packageDamage;
                $scope.goodsDifferenceModel.damage=data.banner.damage;
                $scope.goodsDifferenceModel.lost=data.banner.lost;
            })
        }
    }])
});