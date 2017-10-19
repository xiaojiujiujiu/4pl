/**
 * Created by xiaojiu on 2017/3/23.
 */
'use strict';
define(['../../../app','../../../services/storage/order-qutbound/cdcOrderOutboundConfirmService'], function (app) {
    var app = angular.module('app');
    app.controller('cdcOrderOutboundConfirmCtrl',['$scope','$state','$stateParams','$sce','$window','cdcOrderOutboundConfirm','$interval',function ($scope,$state,$stateParams,$sce,$window,cdcOrderOutboundConfirm,$interval) {
        $scope.querySeting = {
            items: [
                { type: 'text', model: 'goodsStyle', title: '规格型号',autofocus:true},
            ],
            btns: [
                { text: $sce.trustAsHtml('查询'), click: 'searchClick' }]
        };
        $scope.banner={};
        //table头
        $scope.thHeader = cdcOrderOutboundConfirm.getThead();
        //分页下拉框
        $scope.pagingSelect = [
            {value: 5, text: 5},
            {value: 10, text: 10, selected: true},
            {value: 20, text: 20},
            {value: 30, text: 30},
            {value: 50, text: 50}
        ];
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        var pmsSearch = cdcOrderOutboundConfirm.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query;//设置当前作用域的查询对象
            //get();
        }, function (error) {
            console.log(error)
        });

        //查询
        $scope.searchClick = function () {
//            //设置默认第一页
//            $scope.paging = {
//                totalPage: 1,
//                currentPage: 1,
//                showRows: $scope.paging.showRows,
//            };
        	getPosition();
            $scope.searchModel.goodsStyle='';
        }
        function getPosition() {
        	if($scope.searchModel.goodsStyle=='' || $scope.searchModel.goodsStyle==null){
        		return;
        	}
            var goodsStyle=$scope.searchModel.goodsStyle;
            var result=[];//点击查询时，返回的结果集
            var first=null;
            output= $scope.result;
            for(var i=0;i<output.length;i++){
            	if(goodsStyle == output[i]['goodsStyle']){
            		first=output[i];
            		output.splice(i,1)
            		break;
            	}
            }
            if(first != null){
	            output.splice(0,0,first)
	            for(var i=0;i<output.length;i++){
	            	//重新设置序号
	            	output[i]["pl4GridIndex"]=i;
	            }
            }
            var  inputDom;
            inputDom=document.getElementById('outGoodCount');
            if(!!inputDom){
                if(inputDom instanceof  Array){
                    inputDom=inputDom[0];
                }
                inputDom.focus();
            }
        }
        function  getBanner(){

            var opts = {};
            opts.taskId = $stateParams['taskId'];
            var promise = cdcOrderOutboundConfirm.getDataTable({param: {query: opts}}, '/outGoodsOrder/outGoodsOrderDetailBanner');
            promise.then(function (data){
                if(data.status.code==="0000") {
                    $scope.banner = data.banner;
                    $scope.orderLogModal=data.banner;
                    $scope.orderLogModal.deliveryTypeMap.id=2;
                    $scope.orderLogModal.deliveryName='';
                    $scope.orderLogModal.thirdOrder='';
                    $scope.orderLogModal.deliveryFee='';
                }
            })

        }
        getBanner();
        $scope.result=[];
        var output = [];
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.taskId = $stateParams['taskId'];
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = cdcOrderOutboundConfirm.getDataTable({param: {query: opts}},'/outGoodsOrder/outGoodsOrderDetailList');
            promise.then(function (data) {
                if(data.status.code==="0000"){
                    //$scope.banner.taskId=$stateParams['taskId'];
                	
//                    var isResult=false;
//                    angular.forEach($scope.result, function (item,i) {
//                        if(item.sku==data.grid[0].sku){
//                            $scope.result[i]=data.grid[0];
//                            isResult=true;
//                            return false;
//                        }
//                    });
//                    if(!isResult){
//                        $scope.result.push(data.grid[0]);
//                        //获取光标定位
//                        var  inputDom;
//                        $scope.intervalGetId= $interval(function(){
//                            inputDom=document.getElementById('outGoodCount');
//                            if(!!inputDom){
//                                if(inputDom instanceof  Array){
//                                    inputDom=inputDom[0];
//                                }
//                                inputDom.focus();
//                                $interval.cancel($scope.intervalGetId);
//                            }
//                        },500)
//
//                    }
                	
                	
                	$scope.result=data.grid;
                	output=data.grid;
                    //重置paging 解决分页指令不能监听对象问题
                    $scope.paging = {
                        totalPage: data.total,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };
                }



            }, function (error) {
                console.log(error);
            });

        }
        get();
        //编辑输入框显示隐藏
        $scope.isShow=false;
        $scope.toggleInput=function(){
            if($scope.orderLogModal.deliveryTypeMap.id===1){
                $scope.isShow=true;
            }else if($scope.orderLogModal.deliveryTypeMap.id===2){
                $scope.isShow=false;
            }else if($scope.orderLogModal.deliveryTypeMap.id===3){
                $scope.isShow=false;
            }
        }
        $scope.cancel=function(){
            $scope.orderLogModal.deliveryTypeMap.id=2;
            $scope.isShow=false;
        }


        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }


        $scope.parseInt = parseInt;
        //确认出库

        $scope.takeGoodsDown= function () {
            if($scope.result.length<=0){
                alert("有商品未扫描！")
            }else {
                var flag=true;
                angular.forEach($scope.result, function (item,i) {
                    if (parseInt(item.needCount) != parseInt(item.outGoodCount)) {
                        alert('出库数量错误，商品数量和出库数量要保持一致！')
                        flag=false;
                        return;
                    }
                });
                if(!flag){
                    return;
                }else {
                    $("#orderLogModal").modal("show");
                }
            }
        }
        $scope.chuKuConfirm=function(){
            if($scope.orderLogModal.deliveryTypeMap.id===1){
                if($scope.orderLogModal.deliveryName==''){
                    alert("请输入配送名称！");
                    return false;
                }else if($scope.orderLogModal.thirdOrder==''){
                    alert("请输入订单号！");
                    return false;
                }else if($scope.orderLogModal.deliveryFee==''){
                    alert("请输入运     费！");
                    return false;
                }
            }
            var takeGoodsDowns = [];
            angular.forEach($scope.result, function (item,i) {
                takeGoodsDowns.push(item);
            });
            var opts = {
                banner: {taskId: $scope.banner.taskId,deliveryType:$scope.orderLogModal.deliveryTypeMap.id,deliveryName:$scope.orderLogModal.deliveryName,thirdOrder:$scope.orderLogModal.thirdOrder,deliveryFee:$scope.orderLogModal.deliveryFee},
                grid: takeGoodsDowns
            }
            var promise = cdcOrderOutboundConfirm.getDataTable({param: opts}, '/outGoodsOrder/outGoodsOrderSuccess');
            promise.then(function (data) {
                $("#orderLogModal").modal("hide");
                alert(data.status.msg);
                if(data.status.code=="0000"){
                    $state.go('main.cdcOrderOutbound')
                }

            }, function (error) {
                console.log(error);
            });
        }
        //返回
        $scope.back= function () {
            $window.history.back();
        }
        
        $scope.clearNoNum= function (index, obj) {
        	var outGoodCount= obj.outGoodCount;
        	obj.outGoodCount=outGoodCount.replace(/\D/g,'');
        }
        
    }]);
});