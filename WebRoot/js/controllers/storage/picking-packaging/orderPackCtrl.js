/**
 * 
 * @authors Hui Sun 
 * @date    2015-12-11 
 * @version $Id$
 */
'use strict';
define(['../../../app', '../../../services/storage/picking-packaging/orderPackService'], function(app) {
     var app = angular.module('app');     app.controller('orderPackCtrl', ['$rootScope','$scope', '$state','$stateParams','$window', '$sce', 'orderPack', function($rootScope,$scope, $state, $stateParams,$window, $sce, orderPack) {
        // 头部标签跳转
        $scope.packBusinessHref = function(){
            $state.go('main.packBusiness')
        }
        $scope.isBtnShow=$stateParams['isBtnShow']
        //table头
        $scope.thHeader = orderPack.getThead();
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

        get()

        //查询
  /*      $scope.searchClick = function(sku) {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            get(sku);
        }*/
            //任务类型 下拉框change
        $scope.orderTypeIdChange = function() {
            //  console.log($scope.searchModel.orderTypeIdSelect)
        }

        function get(flag) {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var param;
            if(flag){
                param = {
                    param: {
                    	query:{
                    		taskId: $stateParams['taskId'],
                    		sku: flag,
                    		pageNo:$scope.paging.currentPage,
                    		pageSize:$scope.paging.showRows
                    	}
                    }
                }
            } else {
                param = {
                    param: {'query':{'taskId': $stateParams['taskId'],
                		pageNo:$scope.paging.currentPage,
                		pageSize:$scope.paging.showRows}}
                }
            }
            var promise = orderPack.getDataTable(param);
            promise.then(function(data) {
                if(data.code==-1){
                    alert(data.message);
                    $scope.result = [];
                    $scope.paging = {
                        totalPage: 1,
                        currentPage: 1,
                        showRows: $scope.paging.showRows,
                    };
                    return false;
                }
            	$scope.enable = data.toolbar[0].Enable;
                $scope.result = data.grid;
                $scope.paging.totalPage = data.total;
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
                $scope.banner = data.banner;
            }, function(error) {
                console.log(error);
            });
            $scope.tackGoods = function(obj) {
                $location.path('/checkstorage');
            }
        }
        $scope.pageModel={
            sku:''
        }
        $scope.skuKeyUp= function () {
            var reg=/[\u4E00-\u9FA5\uF900-\uFA2D]/g;
            $scope.pageModel.sku=$scope.pageModel.sku.replace(reg,'');
        }
        //分页跳转回调
        $scope.goToPage = function() {
            get()
        }

        // 装箱
        $scope.zxPrint = function(){
            $scope.sendGrid = [];
            var ckId = '';
            angular.forEach($scope.result, function(val, index, arr ){


                        ckId += val.ckId + ',';
                        $scope.sendGrid.push(val);

                })
            /*if(ckId != ''){
                $('#comfirmPrint').modal('show');
            }else{
                alert('请勾选需要装箱商品！')
            }*/
            var sendParam = {
                param: {
                    query:{
                        taskId: $stateParams['taskId'],
                        grid: $scope.sendGrid
                    }
                }
            }
            var packID="";

            var printPackingPromise = orderPack.getPrintData('/orderBoxDetail/insertOrderBoxDetail',sendParam);
            printPackingPromise.then(function(data){
                packID=$scope.banner.taskId;
                alert(data.status.msg);
                if(data.status.code == "0000"){
                    alert(data.status.msg);
                    get();
                    $state.go("main.packBusiness");
                }
                //$window.open("/print/pickingList.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+packID);
            })
        }
        // 确认装箱
        //$scope.printPacking = function(){
        //    var sendParam = {
        //        param: {
        //            query:{
        //                taskId: $stateParams['taskId'],
        //                grid: $scope.sendGrid
        //            }
        //        }
        //    }
        //    var printPackingPromise = orderPack.getPrintData('/orderBoxDetail/insertOrderBoxDetail',sendParam);
        //    printPackingPromise.then(function(data){
        //        console.log(data);
        //        var packID="";
        //        get();
        //        if(!!data.status){//当状态不为空的时候 表示不成功
        //            //if(data.status.code == "1000"){
        //            //    $('#comfirmPrint').modal('hide');
        //            //    alert(data.status.msg);
        //            //    return false;
        //            //}
        //            packID=$scope.banner.taskId;
        //            if(data.status.code == "0000"){
        //                $('#comfirmPrint').modal('hide');
        //                alert('装箱成功', function () {
        //                    $window.open("/print/pickingList.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+packID);
        //                })
        //            }
        //        }
        //    })
        //}


        // 打印面單
        //$scope.confirmBtn = function(){
        //    if($scope.enable){
        //        $('#confirmPrint').modal('show');
        //    }else{
        //        alert('请先包装完商品然后再打印面单！');
        //    }
        //}
        $scope.psPrint = function(){
            $window.open("/print/faceList.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+$stateParams['taskId']+'&printCount='+$scope.banner.hasBoxCount);
            $('#confirmPrint').modal('hide');
        }
        //$scope.printConfirmSuccess=function(){
        //    $state.go('main.packBusiness');
        //}
        //返回
        $scope.back= function () {
            $window.history.back();
        }
    }])
});