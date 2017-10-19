/**
 * author wusheng.xu
 * date 16/7/11
 */
'use strict';
define(['../../../app', '../../../services/logistics/order-ship/fillPrintOrderService'], function (app) {
     var app = angular.module('app');
    app.controller('fillPrintOrderCtrl', ['$rootScope', '$scope', '$state', '$sce', '$window', 'FillPrintOrder', function ($rootScope, $scope, $state, $sce, $window, fillPrintOrder) {
        //配送员
        $scope.distributionMan = {
            id: -1,
            select: []
        }
        //table头
        $scope.ThHeader = fillPrintOrder.getThead();
        //获取配送员
        fillPrintOrder.getDataTable({
                param: {}
            }, '/orderDelivery/getPrintDicLists')
            .then(function (data) {
                $scope.distributionMan.select=data.query.driverId;//插入配送员
            });
        //查询
        $scope.search1Click1 = function () {
        		get();
        }
        function get() {
            var promise = fillPrintOrder.getDataTable({
                param: {
                    query: {
                        opUser: $scope.distributionMan.id
                    }
                }
            }, '/orderDelivery/queryPrintOrderDelivery');
            promise.then(function (data) {
                if (data.code == -1) {
                    alert(data.message);
                    $scope.result = [];
                    return false;
                }
                $scope.result = data.grid;
                /*$scope.paging = {
                 totalPage: data.total,
                 currentPage: $scope.paging.currentPage,
                 showRows: $scope.paging.showRows,
                 };*/
            }, function (error) {
                console.log(error);
            });
        }

//        get();
        //打印
        $scope.print = function () {
            if (confirm('确定打印吗?')) {
                var taskIds = '';
                angular.forEach($scope.result, function (item) {
                	  if (item.pl4GridCheckbox.checked) {
                		  taskIds += item.taskId + ',';
                      }
                });
                if (taskIds !== ''){
                    taskIds = taskIds.substr(0, taskIds.length - 1);
                }
                else {
                    alert('请勾选需要打印的任务单!');
                    return false;
                }
                $window.open('/print/distributionJoin.html?tokenId=' + $rootScope.userInfo.token + '&sessionid=' + $rootScope.userInfo.sessionId + '&taskIds=' + taskIds + '&driverId=' + ($scope.distributionMan.id || '') );

            }
        }
    }])
})