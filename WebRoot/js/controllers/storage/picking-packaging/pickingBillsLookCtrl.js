/**
 * 
 * @authors Hui Sun 
 * @date    2015-12-10 16:17:32
 * @version $Id$
 */
'use strict';
define(['../../../app', '../../../services/storage/picking-packaging/pickingBillsLookService'], function(app) {
     var app = angular.module('app');     app.controller('pickingBillsLookCtrl', ['$rootScope','$scope', '$state', '$stateParams', '$sce', 'pickingBillsLook','$window', function($rootScope,$scope, $state, $stateParams, $sce, pickingBillsLook,$window) {
        // 头部标签跳转
        $scope.orderPickingHref = function() {
            $state.go('main.orderPicking')
        }
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'businessId',
                title: '业务单号'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '订单日期'
            }, {
                type: 'select',
                model: 'status',
                title: '状态'
            }, {
                type: 'select',
                model: 'orderType',
                title: '订单类型',
                selectedModel: 'orderTypeSelect'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = pickingBillsLook.getThead();
        //分页下拉框
        $scope.pagingSelect = [{
            value: 5,
            text: 5
        }, {
            value: 10,
            text: 10,
            selected: true
        }, {
            value: 20,
            text: 20
        }, {
            value: 30,
            text: 30
        }, {
            value: 50,
            text: 50
        }];
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        var pmsBanner = pickingBillsLook.getBanner({
            "param": {'query':{'taskId':$stateParams['taskId']}}
        });
        pmsBanner.then(function(data) {
            $scope.banner = data.banner
            get();
        })
        // get grid 数据
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = pickingBillsLook.getDataTable({
                param: {'query':{'taskId': $stateParams['taskId']}}
            });
            promise.then(function(data) {
                if(data.code==-1){
                    alert(data.message);
                    $scope.result = [];
                    $scope.paging = {
                        totalPage: 1,
                        currentPage: 1,
                        showRows: $scope.paging.showRows,
                    };
                    return ;
                }
                $scope.result = data.grid;
                $scope.paging = {
                    totalPage: data.total,
                    currentPage:$scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function(error) {
                console.log(error);
            });
            $scope.tackGoods = function(obj) {
                $location.path('/checkstorage');
            }
        }
        //分页跳转回调
        $scope.goToPage = function() {
            get()
        }
        // 打印拣货单
        $scope.printPickingOrders = function(){
            $('#enterPrintModal').modal('show');
            window.open("/print/orderPickingList.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskIds="+$scope.banner.taskId);
        }
        // 打印状态确认
        $scope.printConfirm = function(){
            var printPromise = pickingBillsLook.printCongirm({
                param: {
                    query:{
                        taskIds: $scope.banner.taskId
                    }
                }
            });
            printPromise.then(function(data){
                $('#enterPrintModal').modal('hide');
                if(data.status.code == "0000"){
                    get();
                }else {
                    alert(data.status.msg);
                }
            })
        }
        //返回
        $scope.back= function () {
            $window.history.back();
        }
    }])
});