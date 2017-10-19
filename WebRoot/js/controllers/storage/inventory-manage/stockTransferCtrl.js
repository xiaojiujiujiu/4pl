/**
 * Created by xiaojiu on 2017/3/27.
 */
define(['../../../app','../../../services/storage/inventory-manage/stockTransferService'], function (app) {
    var app = angular.module('app');
    app.controller('stockTransferCtrl', ['$rootScope','$scope', '$sce', '$timeout','$window', 'stockTransfer','$stateParams', function ($rootScope,$scope, $sce, $timeout,$window, stockTransfer,$stateParams) {


        // query moudle setting
        $scope.querySeting = {
            items: [ {
                type: 'text',
                model: 'taskId',
                title: '申请单号'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '创建日期'
            },{
                type: 'select',
                model: 'transferType',
                selectedModel: 'transferTypeSelect',
                title: '转移类型'
            },{
                type: 'select',
                model: 'orderStatus',
                selectedModel: 'orderStatusSelect',
                title: '审核状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //theadr
        $scope.thHeader = stockTransfer.getThead();
        $scope.allTHeader = stockTransfer.getAllTHeader();
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        var pmsQuery = stockTransfer.getQuery();
        pmsQuery.then(function (data) {
            $scope.searchModel = data.query;//设置当前作用域的查询对象
            //下拉框model
            $scope.searchModel.transferTypeSelect = "-1";
            $scope.searchModel.orderStatusSelect = "-1";
            //获取table数据
            get();
        }, function (error) {
            console.log(error)
        });
        //查询
        $scope.searchClick = function () {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            get();
        }
        $scope.exGoodsAlloParam={};
        function get(){
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            // opts.taskId = $stateParams['taskId'];
            opts.transferType = $scope.searchModel.transferTypeSelect;
            opts.orderStatus = $scope.searchModel.orderStatusSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exGoodsAlloParam={query:opts};
            var promise = stockTransfer.getDataTable({param: {query:opts}});
            promise.then(function (data) {
                if(data.grid.length<=0){
                    $scope.isData=false;
                }else {
                    $scope.isData=true;
                }
                $scope.result = data.grid;
                //重置paging 解决分页指令不能监听对象问题
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function (error) {
                console.log(error);
            });
        }
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
        $scope.clearNoNum=function(){
        	var transferCount= $scope.alloResult[0].transferCount;
        	$scope.alloResult[0].transferCount=transferCount.replace(/\D/g,'');
//        	$scope.alloResult[0].transferCount="aaa";
        	return true;
        }
        
        //修改
        $scope.updateStation=function(i,item){
            $rootScope.taskId=item.taskId;
            stockTransfer.getDataTable({param:{query:{taskId:item.taskId}}}, '/stockTransfer/editTransferApply')
                .then(function (data) {
                	if(data.status.code=="0000"){
                		$("#modifyModal").modal("show");
                	}
                    $scope.alloResult = data.grid;
                });
        }
        $scope.confirmModify=function(){
            var opts={};
            opts.taskId=$rootScope.taskId;
            opts.transferCount=  $scope.alloResult[0].transferCount;
            var reg = new RegExp("^[0-9]{1,4}$");
            if(!reg.test(opts.transferCount)){
            	alert("转移数量必须为1-9999的数字！");
            	$("#confirmApplication").modal("hide");
            	return false;
            }
            if(opts.transferCount<=0){
            	alert("转移数量必须为1-9999的数字！");
            	$("#confirmApplication").modal("hide");
            	return false;
            }
            stockTransfer.getDataTable({param:{query:opts}}, '/stockTransfer/updateTransferApply')
                .then(function (data) {
                    if(data.status.code=="0000"){
                        get();
                        $("#modifyModal").modal("hide");
                    }
                    alert(data.status.msg);
                });
        }
        //删除
        $scope.delete= function (i,item) {
            if(confirm('确定删除吗?')) {
                stockTransfer.getDataTable({param:{query:{taskId:item.taskId}}}, '/stockTransfer/deleteStockTransferOrder')
                    .then(function (data) {
                        if(data.status.code=="0000"){
                            get();
                        }
                        alert(data.status.msg);
                    });
            }
        }
    }]);
});