/**
 * 
 * @authors Hui Sun 
 * @date    2015-12-10 16:17:32
 * @version $Id$
 */
'use strict';
define(['../../../app', '../../../services/storage/inventory-manage/differenceConfirmService'], function(app) {
     var app = angular.module('app');     app.controller('differenceConfirmCtrl', ['$scope', '$state', '$stateParams', '$sce', 'differenceConfirm', function($scope, $state, $stateParams, $sce, differenceConfirm) {
       
        //table头
        $scope.thHeader = differenceConfirm.getThead();
        // get banner and grid data
        var pmsBanner = differenceConfirm.getBanner({
            param: {
					query:{
            		taskId: $stateParams['taskId'],
            		custTaskId: $stateParams['custTaskId'],
            		checkCount: $stateParams['checkCount']
            	}
            }
        });
        pmsBanner.then(function(data) {
        	$scope.result = data.grid;
            $scope.banner = data.banner
        })
        // 返回
        $scope.goBack = function(){
        	$state.go('main.differenceConfirmation')
        }
		$scope.showRemarks=function(){
			$("#remarks").modal('show');
		}
		$scope.remarksModel={
			remarks:'',
		}
        // 确认差异
        $scope.diffConfirm = function(){
        	var sendParam = {
        		query: $scope.banner
        	}
        	sendParam.query.list = $scope.result;
			sendParam.query.remarks=$scope.remarksModel.remarks;
        	var diffComfirmPms = differenceConfirm.getDataTable({
        		param: sendParam
        	});
        	diffComfirmPms.then(function(data){
        		if(data.status.code == "0000"){
					$("#remarks").modal('hide');
        			alert('确认成功',function(){
        				$state.go('main.differenceConfirmation')
        			});
        		}else {
					alert(data.status.msg);
				}
        	})
        }
		//删除备注差异
		$scope.deleteRemarks=function(){
			$scope.remarksModel={
				remarks:'',
			}
		}
    }])
});