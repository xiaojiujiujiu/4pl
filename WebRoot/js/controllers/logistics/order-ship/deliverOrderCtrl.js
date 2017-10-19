/**
 * Created by hui.sun on 15/12/13.
 */
'use strict';
define(['../../../app', '../../../services/logistics/order-ship/deliverOrderService'], function(app) {
     var app = angular.module('app');
    app.controller('deliverOrderCtrl', ['$rootScope','$scope', '$state', '$sce','$window', 'deliverOrder', function($rootScope,$scope, $state, $sce,$window, deliverOrder) {
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
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '订单时间'
            },  {
                type: 'select',
                model: 'orderTypeId',
                selectedModel:'orderTypeIdSelect',
                title: '业务类型'
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
                $scope.thHeader = deliverOrder.getThead();
            }else{
                $scope.thHeader = deliverOrder.getTheadChange();
            }
        }
        getTableHeader();
        $scope.openModelThHeader = deliverOrder.getOpenModelThHeader();
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
            var pmsSearch = deliverOrder.getSearch(sendParam);
            pmsSearch.then(function(data) {
                if(data.code==-1){
                    alert(data.message);
                    return false;
                }
                $scope.searchModel = data.query; //设置当前作用域的查询对象
                $scope.searchModel.orderTypeIdSelect=-1;
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
            opts.orderTypeId = $scope.searchModel.orderTypeIdSelect;
            opts.pageNo= $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            opts.packStatus = packStatus;
            var promise = deliverOrder.getDataTable({
                param: {
                    query: opts
                }
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
            var currTypeId = $scope.result[index].orderTypeId;
            var promise = deliverOrder.getDetailTable('/takeGoods/query_goodsDetail', {
                    param: {
                        query: {
                            taskId: currTaskId,
                            orderTypeId:currTypeId
                        }
                    }
                }
            );
            promise.then(function(data){
            	   $scope.modalBanner = data.banner;
                $scope.openModelResult = data.grid;

            })
        }
//        $scope.currTaskId='';
        // 点击分配弹出框需要的数据
        $scope.getOrderQuery = function (index){
            $scope.isShow=true;
            $scope.isShow1=true;
              $scope.isShow2=false;
        	$scope.currTaskId = $scope.result[index].taskId;
        	$scope.currTypeId = $scope.result[index].orderTypeId;
            var promise = deliverOrder.getOrderSearch();
            promise.then(function(data){
                $scope.orderLogModal=data.query;
                $scope.orderLogModal.deliveryType.id="2";
                $scope.orderLogModal.driverId.id=-1;
                $scope.orderLogModal.wlCompId.id=-1;
                $scope.orderLogModal.carId.id=-1;
                $scope.orderLogModal.clearType.id=-1;
                $scope.orderLogModal.billingType.id=-1;
                $scope.orderLogModal.thirdWild='';
                $scope.orderLogModal.freight='';
            	})
        }
        //编辑输入框显示隐藏
        $scope.isShow=false;
        $scope.isShow1=false;
        $scope.isShow2=false;
        $scope.toggleInput=function(){
           if($scope.orderLogModal.deliveryType.id==="2"){
               $scope.isShow=true;
               $scope.isShow1=true;
               $scope.isShow2=false;
           }else if($scope.orderLogModal.deliveryType.id==="3"){
        	   $scope.orderLogModal.carId.id=-1;
        	   $scope.orderLogModal.driverId.id=-1;
               $scope.isShow=false;
               $scope.isShow1=false;
               $scope.isShow2=false;
           }else if($scope.orderLogModal.deliveryType.id==="1"){
               $scope.isShow1=false;
               $scope.isShow2=true;
               $scope.isShow=false;
           }else if($scope.orderLogModal.deliveryType.id===-1){
               $scope.isShow1=false;
               $scope.isShow2=false;
               $scope.isShow=false;
           }
        }
        $scope.deliverConfirm=function(){
            if($scope.orderLogModal.deliveryType.id==-1){
                alert('请选择配送方式');
                return;
            }
            if($scope.orderLogModal.deliveryType.id==="2"){
                if($scope.orderLogModal.driverId.id==-1){
                    alert('请选择配送员');
                    return;
                }else if($scope.orderLogModal.carId.id==-1){
                    alert('请选择配送车辆');
                    return;
                }
            }else if($scope.orderLogModal.deliveryType.id==="3"){
//                if($scope.orderLogModal.driverId.id==-1){
//                    alert('请选择配送员');
//                    return;
//                }
            	$scope.orderLogModal.carId.id=-1;
         	   $scope.orderLogModal.driverId.id=-1;
            }else if($scope.orderLogModal.deliveryType.id==="1"){
                if($scope.orderLogModal.wlCompId.id==-1){
                    alert('请选择配送承运商');
                    return;
                }else if($scope.orderLogModal.thirdWild.length===0){
                    alert('请输入第三方单号');
                    return;
                }else if($scope.orderLogModal.clearType.id==-1){
                    alert('请选择结算方式');
                    return;
                }else if($scope.orderLogModal.billingType.id==-1){
                    alert('请选择计费方式');
                    return;
                }else if($scope.orderLogModal.freight.length===0){
                    alert('请输入运 费');
                    return;
                }
            }
        	var promise = deliverOrder.deliverOrderConfrim('/orderDeliver/deliverOrderConfrim', {
              param: {
                  query: {
//        		console.log()
                      taskId: $scope.currTaskId,
                      orderTypeId:$scope.currTypeId,
                      deliveryType:$scope.orderLogModal.deliveryType.id,
                      driverId:$scope.orderLogModal.driverId.id,
                      wlCompId:$scope.orderLogModal.wlCompId.id,
                      carId:$scope.orderLogModal.carId.id,
                      clearType:$scope.orderLogModal.clearType.id,
                      billingType:$scope.orderLogModal.billingType.id,
                      thirdWild:$scope.orderLogModal.thirdWild,
                      wlPay:$scope.orderLogModal.freight
                  }
              }
          }
      );
            if($scope.orderLogModal.deliveryType.id==-1){
                alert('请选择配送方式');
                return;
            }
            if($scope.orderLogModal.deliveryType.id==="2"){
                if($scope.orderLogModal.driverId.id==-1){
                    alert('请选择配送员');
                    return;
                }else if($scope.orderLogModal.carId.id==-1){
                    alert('请选择配送车辆');
                    return;
                }
            }else if($scope.orderLogModal.deliveryType.id==="3"){
//                if($scope.orderLogModal.driverId.id==-1){
//                    alert('请选择配送员');
//                    return;
//                }
            	$scope.orderLogModal.carId.id=-1;
         	   $scope.orderLogModal.driverId.id=-1;
            }else if($scope.orderLogModal.deliveryType.id==="1"){
                if($scope.orderLogModal.wlCompId.id==-1){
                    alert('请选择配送承运商');
                    return;
                }else if($scope.orderLogModal.thirdWild.length<0){
                    alert('请输入第三方单号');
                    return;
                }else if($scope.orderLogModal.clearType.id==-1){
                    alert('请选择结算方式');
                    return;
                }else if($scope.orderLogModal.billingType.id==-1){
                    alert('请选择计费方式');
                    return;
                }else if($scope.orderLogModal.freight.length<0){
                    alert('请输入运 费');
                    return;
                }
            }
        	promise.then(function(data){
        		if(data.status.code != "0000"){
        			alert(data.status.msg);
        			
        		}else{
        			get();
        			$("#orderLogModal").modal('hide');
      		       // $("#orderLogModal,.modal-backdrop.in").hide();
        		}
        		 $scope.isShow=false;
   		        $scope.isShow1=false;
   		        $scope.isShow2=false;
        	})
}
        $scope.singlePrint = function(index, item){
        	var orderTypeId=0;
        	if(item.orderTypeId=='VMI取货'){
        		orderTypeId=8;
        	}
        	if(item.orderTypeId=='拆车件取货'){
        		orderTypeId=18;
        	}
        	if(item.orderTypeId=='拆车件订单'){
        		orderTypeId=19;
        	}
        	if(item.orderTypeId=='分拨单'){
        		orderTypeId=14;
        	}
        	$window.open("/print/carrierNotePrint.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskIds="+item.taskId+"&orderTypeId="+orderTypeId);
        	$('#enterPrint').modal('show');
        	$scope.printFlag = item.taskId;
        }
        $scope.printConfirm = function(){
        	get();
			$('#enterPrint').modal('hide');
//        	var printConfirmPromise = deliverOrder.printConfrim('/returnPickQuery/updatePrintStatus',{
//        		param: {
//        			query:{
//        				taskIds: $scope.printFlag
//        			}
//        		}
//        	});
//        	printConfirmPromise.then(function(data){
//        		if(data.status.code != "0000"){
//        			alert(data.status.msg);
//        			$('#enterPrint').modal('hide');
//        		}else{
//        			get();
//        			$('#enterPrint').modal('hide');
//        		}
//        	})
        	
        }
        $scope.cancelTake = function(index, item){
//        	$window.open("/print/carrierNotePrint.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskIds="+item.taskId);
        	$('#cancelTake').modal('show');
        	$scope.printFlag = item.taskId;
        	$scope.currTypeId = item.orderTypeId;
        }
        $scope.cancelTakeConfirm = function(){
        	var cancelTakeConfirmPromise = deliverOrder.cancelConfrim('/orderDeliver/cancelTakeOrder',{
        		param: {
        			query:{
        				taskId: $scope.printFlag,
        				orderTypeId:$scope.currTypeId
        			}
        		}
        	});
        	cancelTakeConfirmPromise.then(function(data){
                if(data.status.code != "0000"){
                    alert(data.status.msg);
        			$('#cancelTake').modal('hide');
        		}else{
        			get();
        			$('#cancelTake').modal('hide');
        		}
        	})
        	
        }
        $scope.tabChange = function(index){

           //var date = new Date();
            //$('#dt_0').datepicker('setValue', new Date(date.getFullYear(), date.getMonth(), date.getDate()));
            //$('#dt_1').datepicker('setValue', new Date(date.getFullYear(), date.getMonth(), date.getDate()));
           // $('#dt_0,#dt_1').datepicker({defaultDate:'',reset:true});
            //$('#dt_0,#dt_1').val('');
            $scope.paging.currentPage= 1;
            $scope.searchModel.taskId='';
            $scope.searchModel.orderTypeIdSelect=-1;
            $scope.searchModel.startTime='';
            $scope.searchModel.endTime='';

            if(index == 1){
//            	$scope.querySeting.items[2].title="拣货日期";
                $scope.tabFlag = true;
            }else{
//            	$scope.querySeting.items[2].title="包装日期";
                $scope.tabFlag = false;
            }
            //getQuery(index);
            getTableHeader(index);
            get(index);

        }
    }])
});