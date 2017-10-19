/**
 * Created by xiaojiu on 2017/3/25.
 */
'use strict';
define(['../../../app','../../../services/storage/orderReceipt/cdcOrderReceiptConfirmService'], function (app) {
    var app = angular.module('app');
    app.controller('cdcOrderReceiptConfirmCtrl',['$scope','$state','$stateParams','$sce','$window','cdcOrderReceiptConfirm',function ($scope,$state,$stateParams,$sce,$window,cdcOrderReceiptConfirm) {
        $scope.querySeting = {
            items: [
                { type: 'text', model: 'goodsStyle', title: '规格型号' ,autofocus:true},
            ],
            btns: [
                { text: $sce.trustAsHtml('查询'), click: 'searchClick' }]
        };
        $scope.banner={};
        //table头
        $scope.thHeader = cdcOrderReceiptConfirm.getThead();


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
        
        var pmsSearch = cdcOrderReceiptConfirm.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query;//设置当前作用域的查询对象
//            get();
            
        }, function (error) {
            console.log(error)
        });

        //查询
        $scope.searchClick = function () {
//            if($scope.searchModel.barCode=='' || $scope.searchModel.barCode==null){
//            	alert("请扫码");
//            	return false;
//            }
//        	//设置默认第一页
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
            inputDom=document.getElementById('refuseCount');
            if(!!inputDom){
                if(inputDom instanceof  Array){
                    inputDom=inputDom[0];
                }
                inputDom.focus();
            }
        }
        function getBanner(){
            var opts = {};
            opts.taskId = $stateParams['taskId'];
            var promise = cdcOrderReceiptConfirm.getBanner({param: {query: opts}}, '/cdcReceiptOrder/getReceiptOrderBanner');
            promise.then(function (data){
                if(data.status.code==="0000") {
                    $scope.banner = data.banner;
                }
            })
        }
        getBanner();
        getReceiptOrder();
        var output=[];
        function getReceiptOrder() {
        	//获取选中 设置对象参数
//            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            
//            var takeGoodsDowns = [];
//            angular.forEach($scope.result, function (item,i) {
//                takeGoodsDowns.push(item);
//            });
            var opts = {
                query:{
//                	barCode:$scope.searchModel.barCode,
                	taskId:$stateParams['taskId']}
//            	,grid: takeGoodsDowns
            }
//            opts.barCode=$scope.searchModel.barCode;
//            opts.taskId=$scope.banner.taskId;
            
            var promise = cdcOrderReceiptConfirm.getDataTable( {param: opts},'/cdcReceiptOrder/getReceiptOrder');
            promise.then(function (data) {
                if(data.status.code==="0000"){
                    //$scope.banner.taskId=$stateParams['taskId'];
                    $scope.result = data.grid;
                    output=$scope.result;
//                    $scope.banner = data.banner;
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
        
        
        //这个还需要修改
        $scope.clearNoNum= function (index, obj) {
        	var refuseCount= obj.refuseCount;
        	obj.refuseCount=refuseCount.replace(/\D/g,'');
        }
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.taskId = $stateParams['taskId'];
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = cdcOrderReceiptConfirm.getDataTable({param: {query: opts}},'/cdcReceiptOrder/returnReceiptOrder');
            promise.then(function (data) {
                if(data.status.code==="0000"){
                    //$scope.banner.taskId=$stateParams['taskId'];
                    $scope.result = data.grid;
                    $scope.banner = data.banner;
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



        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }

        //回执
        $scope.receipt=function(){
            if(!!$scope.result){
                $("#confirmReceipt").modal("show");
            }else {
                alert("没有数据！")
            }
        }

        //确认回执
        $scope.confirmReceipt=function(){
            var takeGoodsDowns = [];
            angular.forEach($scope.result, function (item,i) {
                takeGoodsDowns.push(item);
            });
            var opts = {
                banner: {taskId: $scope.banner.taskId},
                grid: takeGoodsDowns
            }
            var promise = cdcOrderReceiptConfirm.getDataTable({param: opts}, '/cdcReceiptOrder/confirmReceiptOrder');
            promise.then(function (data) {
                $("#confirmReceipt").modal("hide");
                alert(data.status.msg);
                if(data.status.code=="0000"){
                    $state.go('main.cdcOrderReceipt')
                }

            }, function (error) {
                console.log(error);
            });
        }
        //返回
        $scope.back= function () {
            $window.history.back();
        }

    }]);
});