/**
 * Created by hui.sun on 15/12/13.
 */
'use strict';
define(['../../../app', '../../../services/logistics/deliverPutStorageDispatchManage/deliverVmiOrderService'], function(app) {
     var app = angular.module('app');
    app.controller('deliverVmiOrderCtrl', ['$rootScope','$scope', '$state', '$sce','$window', 'deliverVmiOrder', function($rootScope,$scope, $state, $sce,$window, deliverVmiOrder) {
        // 头部标签跳转
        /*$scope.orderPackHref = function(){
            $state.go('orderPack')
        }*/
        // 商品条码查询
        /*$scope.searchBarcode = function(barCode){
            alert(barCode)
        }*/
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '取货单号'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        $scope.tabFlag = true;
        //table头
        function getTableHeader(){
            if($scope.tabFlag){
                $scope.thHeader = deliverVmiOrder.getThead();
            }else{
                $scope.thHeader = deliverVmiOrder.getTheadChange();
            }
        }
        getTableHeader();
        $scope.openModelThHeader = deliverVmiOrder.getOpenModelThHeader();
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
        
        function getQuery(packStatus){
            if(!packStatus){
                if($scope.tabFlag){
                    packStatus = 1;
                }else{
                    packStatus = 2;
                }
            };
            var sendParam = {
                param: {
                    query: {
                        packStatus: packStatus
                    }
                }
            }
            var pmsSearch = deliverVmiOrder.getSearch(sendParam);
            pmsSearch.then(function(data) {

                if(data.status.code=="1000"){
                    alert(data.status.msg);
                    return false;
                }
                $scope.searchModel = data.query; //设置当前作用域的查询对象
                get(packStatus);
            }, function(error) {
                console.log(error)
            });

        }
        getQuery();
        
        //查询
        $scope.searchClick = function() {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            get();
//            $scope.searchModel.taskId = '';
        }

        function get(packStatus) {
            if(!packStatus){
                if($scope.tabFlag){
                    packStatus = 1;
                }else{
                    packStatus = 2;
                }
            };
         
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.pageNo= $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            opts.packStatus = packStatus;
            var promise = deliverVmiOrder.getDataTable({
                param: {
                    query: opts
                }
            });
            promise.then(function(data) {
                if(data.status.code==-1){
                    alert(data.status.msg);
                    $scope.result = [];
                    $scope.paging = {
                        totalPage: 1,
                        currentPage: 1,
                        showRows: $scope.paging.showRows,
                    };
                    return false;
                }
                $scope.result = data.grid;
                //重置paging 解决分页指令不能监听对象问题
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function(error) {
                console.log(error);
            });
        }
        //实收数量blur事件
        $scope.actualQuantityBlur = function(item) {
            alert('实际数量: ' + item)
        }
        $scope.remarksBlur = function(cont) {
            alert(cont)
        }

        //分页跳转回调
        $scope.goToPage = function() {
			get();
        }
        // 获取日志table数据
        $scope.getOpenModelData = function (index){
            var currTaskId = $scope.result[index].taskId;
            var promise = deliverVmiOrder.getDetailTable('/returnPickQuery/queryRelationTask', {
                    param: {
                        query: {
                            taskId: currTaskId
                        }
                    }
                }
            );
            promise.then(function(data){
                $scope.openModelResult = data.grid;

            })
        }
        $scope.singlePrint = function(index, item){
        	$window.open("/print/vmiPutStroage.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskIds="+item.taskId);
        	$('#enterPrint').modal('show');
        	$scope.printFlag = item.taskId;
        }
        $scope.printConfirm = function(){
        	var printConfirmPromise = deliverVmiOrder.printConfrim('/returnPickQuery/updatePrintStatus',{
        		param: {
        			query:{
        				taskId: $scope.printFlag
        			}
        		}
        	});
        	printConfirmPromise.then(function(data){
        		if(data.status.code != "0000"){
        			alert(data.status.msg);
        			$('#enterPrint').modal('hide');
        		}else{
        			get();
        			$('#enterPrint').modal('hide');
        		}
        	})
        	
        }
        $scope.tabChange = function(index){
            if(index == 1){
//            	$scope.querySeting.items[2].title="拣货日期";
                $scope.tabFlag = true;
            }else{
//            	$scope.querySeting.items[2].title="包装日期";
                $scope.tabFlag = false;
            }
            getQuery(index);
            getTableHeader(index);
            get(index);
        }
    }])
});