/**
 * Created by sunhui on 16/1/30.
 */
'use strict';
define(['../../../app', '../../../services/storage/inventory-manage/newPayRegisterService'], function(app) {
     var app = angular.module('app');     app.controller('newPayRegisterCtrl', ['$rootScope','$scope', '$state','$stateParams', '$sce', 'newPayRegister', function($rootScope,$scope, $state,$stateParams, $sce, newPayRegister) {
    	$scope.taskId=$stateParams['taskId'];
        $scope.pageModel={
            sku:'',
            remark:''
        }
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'Distributype',
                title: '配送形式'
            }, {
                type: 'select',
                model: 'distributName',
                selectedModel:'distributNameSelect',
                title: '配送人员'
            }, {
                type: 'text',
                model: 'phone',
                title: '配送电话'
            }],
            /*btns: [{
                text: $sce.trustAsHtml('<span class="glyphicon glyphicon-search"></span>查询'),
                click: 'searchClick'
            }]*/
        };
        //table头
        $scope.thHeader = newPayRegister.getThead();

        //业务单号查询
        $scope.orderSearchClick= function () {
            if($scope.taskId==''){
                alert('请输入单号');
                return false;
            }
            get($scope.taskId);
        }
        $scope.searchClick= function () {
            var isFind=false;
            angular.forEach($scope.result, function (item,i) {
                if(item.sku==$scope.pageModel.sku){
                    var find=item;
                    $scope.result.splice(i,1);
                    $scope.result.splice(0,0,find);
                    isFind=true;
                    return false;
                }
            });
            if(!isFind){
                alert('没有找到该商品!');
            }
        }
        $scope.skuKeyUp= function () {
            var reg=/[\u4E00-\u9FA5\uF900-\uFA2D]/g;
            $scope.pageModel.sku=$scope.pageModel.sku.replace(reg,'');
        }
        $scope.remark = '';
        function get(taskId){
        	 var pmsSearch = newPayRegister.getDataTable('/compensateMonitor/query_compenDetail', {
        	 	param: {query: {taskId:taskId}}}
        	 );
             pmsSearch.then(function(data) {
                 if(data.code==-1){
                     alert(data.message);
                     $scope.result = [];
                     $scope.searchModel=[];
                     return false;
                 }
                 $scope.isOrderSearchClick=true;
                 $scope.searchModel = data.banner; //设置当前作用域的查询对象
                 $scope.searchModel.distributNameSelect=$scope.searchModel.distributName[0].id;
                 try {
                     $scope.result = data.grid;
                     $scope.remark = data.banner.remark;
                 }catch (e){}
             }, function(error) {
                 console.log(error)
             });
        }
        if($scope.taskId!=''){
        	$scope.isOrderSearchClick=true;
        	get($scope.taskId);
        }
        
        //确认打印登记单
        $scope.enterPrintOrderClick= function () {
        	 var ids='';
        	 var breakCounts=0;
             var acceGoodCount;
             var breakCount;
             //获取选中
             angular.forEach($scope.result, function (item) {
                 acceGoodCount = item.acceGoodCount;
                 breakCount = item.breakCount;
            	 breakCounts+=item.breakCount;
                 if (item.pl4GridCheckbox.checked) {
                     ids+=item.taskId+',';
                     
                 }
             });

             if(ids=='') {
            	 alert('请选择需要打印的业务单!');
            	 return false;
             }
             if(acceGoodCount < breakCount){
                alert('损失/丢失数量应不大于实发数量!');
                return false;
             }
             if(breakCounts==0) {
                 alert('请填写损失/丢失数量!');
                 return false;
             }
            
           if($stateParams['taskId']){
           	    // 修改并确认打印
	            pmsPrintConfirm('/compensateMonitor/update_shipperDetail', 'update');
           }else{
           	    // 增加并确认打印
           	    pmsPrintConfirm('/compensateMonitor/add_shipperDetail', 'add');
           }
        }
        // 确认打印
        function pmsPrintConfirm(url, flag){
            var sendData;
        	if(flag == 'add'){
        		// 新增
        		sendData = {
        			query: {
        	 			//recordId: $stateParams['recordId'],
        	 			banner:{
                            taskId: $stateParams['taskId'],
                            Distributype:$scope.searchModel.Distributype,
                            typeId:$scope.searchModel.typeId,
                            distributName:$scope.searchModel.distributNameSelect,
                            phone:$scope.searchModel.phone,
                            remark:$scope.searchModel.remark
                        },
        	 			list: $scope.result
        	 		}
        		}
        	}else{
        		// 修改
        		sendData = {
        			query: {
        	 			recordId: $stateParams['recordId'],
        	 			taskId: $stateParams['taskId'],
        	 			list: $scope.result
        	 		}
        		}
        	}
        	var pmsPrintOrder = newPayRegister.getDataTable(url, {
        	 	param: sendData
        	});
            pmsPrintOrder.then(function(data) {
                if(data.code == 0){
                	if(flag == 'add'){
		        		// 新增
		        		window.open("/print/registration-form.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+ $scope.taskId);
		        	}else{
		        		// 修改
		        		window.open("/print/registration-form.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&recordId="+ $stateParams['recordId'] +"&taskId="+ $stateParams['taskId']);
		        	}
                	alert("新建赔偿登记成功！");
                	history.go(-1);
               	    
                }else{
                	alert(data.message);
                }
           }, function(error) {
                console.log(error)
           });
        }
        //任务类型 下拉框change
        $scope.orderTypeIdChange = function() {
            //  console.log($scope.searchModel.orderTypeIdSelect)
        }

    }])
});