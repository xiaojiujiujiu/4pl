/**
 * 
 * @authors Hui Sun 
 * @date    2015-12-11 
 * @version $Id$
 */
'use strict';
define(['../../../app', '../../../services/logistics/orderReceipt/orderReceiptService'], function(app) {
     var app = angular.module('app');      var app = angular.module('app');     app.controller('orderReceiptCtrl', ['$rootScope','$scope', '$state', '$sce', '$window', 'orderReceipt', function($rootScope,$scope, $state, $sce, $window, orderReceipt) {

        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'sendBillId',
                title: '配送单号'
            }, {
                type: 'select',
                model: 'deliveryMode',
                selectedModel: 'deliveryModeSelect',
                changeCallBack: 'getCascadeData',
                title: '配送方式'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };

        //table头
        $scope.thHeader = orderReceipt.getThead();
        //
        $scope.alreadyThHeader = orderReceipt.getAlreadyThHeader();
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

        //分页下拉框
        $scope.alreadyPagingSelect = [{
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
        $scope.alreadyPaging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        getQueryData(-1);
        // request query data
        function getQueryData (deliveryModeVal){
            var pmsSearch = orderReceipt.getSearch({
                param: {
                    query: {
                        deliveryMode: deliveryModeVal
                    }
                }
            });
            pmsSearch.then(function(data) {
                $scope.searchModel = data.query; //设置当前作用域的查询对象
                // console.log(data)
                $scope.searchModel.deliveryModeSelect = deliveryModeVal;
                if(data.query.driverId != undefined){
                    queryObjRemove();
                    $scope.searchModel.driverIdSelect = -1;
                    $scope.querySeting.items.push({
                        type: 'select',
                        model: 'driverId',
                        selectedModel: 'driverIdSelect',
                        title: '配送员'
                    })
                } else if(data.query.carrierId != undefined){
                    queryObjRemove();
                    $scope.searchModel.carrierIdSelect = -1;
                    $scope.querySeting.items.push({
                        type: 'select',
                        model: 'carrierId',
                        selectedModel: 'carrierIdSelect',
                        title: '承运商'
                    })
                } else {
                    queryObjRemove();
                }
                //获取table数据
                // get();
            }, function(error) {
                console.log(error)
            });
        }
        function queryObjRemove(){
             if($scope.querySeting.items[2]){
                 return $scope.querySeting.items.splice(2 , 1)
            }
        }
        // 级联菜单
        $scope.getCascadeData = function(){
            getQueryData($scope.searchModel.deliveryModeSelect)
        }
        var getGridCount=0;
        //查询
        $scope.searchClick = function() {
            if($scope.searchModel.sendBillId==''&&$scope.searchModel.deliveryModeSelect==-1){
                alert('请填写单号或者选择配送方式!');
                return false;
            }
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows,
            };
            $scope.alreadyPaging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.alreadyPaging.showRows,
            };
            getGridCount=0;
            get();
//            get(true);
        }
        $scope.autoForm = {};
       
        /*
         * 请求gird数据
         * @param {Boolean} flag
         * @flag=true:  请求 '已回执列表' 数据
         * @flag=false: 请求 '待回执列表' 数据
         * */
        function get(flag) {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.deliveryMode = $scope.searchModel.deliveryModeSelect;
            var driverIdSelect = $scope.searchModel.driverIdSelect;
            var carrierIdSelect = $scope.searchModel.carrierIdSelect;
            if(driverIdSelect != undefined) {
            	opts.driverId = driverIdSelect;
            }
            if(carrierIdSelect != undefined) {
            	opts.carrier = carrierIdSelect;
            }
            if($scope.searchModel.deliveryModeSelect==1){
            	if(carrierIdSelect== -1){
            		alert('请选择承运商!');
            		return false;
            	}
            }
            if($scope.searchModel.deliveryModeSelect==2){
            	if(driverIdSelect== -1){
            		alert('请选择人员!');
            		return false;
            	}
            }
            opts.carrierId = opts.carrier;
            var url;
            if( flag == undefined){
            	opts.receipt = "receipt";
                opts.pageNo = $scope.paging.currentPage;
                opts.pageSize = $scope.paging.showRows;
            }else{
            	opts.receipt = "receipted";
                opts.pageNo = $scope.alreadyPaging.currentPage;
                opts.pageSize = $scope.alreadyPaging.showRows;
            }
            url = '/orderReceipt/queryOrderReceipt';
            var promise = orderReceipt.getDataTable(url,{
                param: {
                     query: opts
                }
            });
            promise.then(function(data) {
            	if(data.grid.length>0){
            		getGridCount++;
            	}
                if( flag == undefined){
                	get(true);
                    if (data.code == -1) {
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
                    // 选择操作
                    $scope.receiptType = data.query.receiptType;
                    // 支付类型
                    $scope.clearType = data.query.clearType;
                    if($scope.autoForm.receipt == undefined){
                        $scope.autoForm.receipt = -1;
                        $scope.autoForm.clear = -1;
                    }
                    // 默认显示回单
                    $scope.autoForm.receipt = -1;
                    /**/
                    $scope.paging = {
                        totalPage: data.total,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };
                }else{
                    if (data.code == -1) {
                        alert(data.message);
                        $scope.alreadyResult = [];
                        $scope.alreadyPaging = {
                            totalPage: 1,
                            currentPage: 1,
                            showRows: $scope.alreadyPaging.showRows,
                        };
                        return false;
                    }
                    $scope.alreadyResult = data.grid;
                    $scope.alreadyPaging = {
                        totalPage: data.total,
                        currentPage: $scope.alreadyPaging.currentPage,
                        showRows: $scope.alreadyPaging.showRows,
                    };
                }

                if(getGridCount>0)
                	$scope.isSearchClick = true;
                else
                	$scope.isSearchClick = false;
            }, function(error) {
                console.log(error);
            });
            
        };
        //实收数量blur事件
        $scope.actualQuantityBlur = function(item) {
            alert('实际数量: ' + item)
        }
        $scope.remarksBlur = function(cont) {
            alert(cont)
        }
        $scope.receiptConfirm = function(index, item, btn){
        	var currBoxCount = '';
        	var currRemarks = '';
        	var currSendBillId = '';
        	var currPay='';
        	angular.forEach($scope.result, function(val, key){
        		
        		if(val.taskId == $scope.autoForm.taskIdModel){
        			currBoxCount = val.boxCount;
        			currRemarks = val.hzRemarks;
        			currSendBillId = val.sendBillId;
        			currPay=val.wlPay;
        		}
        	})
            var url = '/orderReceipt/confirmOrderReceipt';
            if(btn == undefined){
            	var listTaskId = [];
            	angular.forEach($scope.result, function(item, index){
            		listTaskId.push(item.taskId)
            	})
            	// console.log(listTaskId)
            	if(listTaskId.indexOf($scope.autoForm.taskIdModel) == -1){
            		alert('没有找到业务单号！');
            		$scope.autoForm.taskIdModel='';
            		return false;
            	}
            	if($scope.autoForm.clear==-1){
            		alert('请选择回款类型！');
            		return false;
            	}
                getReceipt(url,{
                	"sendBillId":currSendBillId,
                	"wlPay":currPay,
                    "taskId":$scope.autoForm.taskIdModel,
                    "receiptType":$scope.autoForm.receipt,
                    "boxCount":currBoxCount,
                    "hzRemarks":currRemarks,
                    "clearType":$scope.autoForm.clear,
                    "deliveryMode":$scope.searchModel.deliveryModeSelect,
                    "carrierId":$scope.searchModel.carrierIdSelect
                })
            } else {
                if(btn.text == "滞留"){
                    getReceipt(url,{
                    	"sendBillId":item.sendBillId,
                    	"wlPay":currPay,
                        "taskId":item.taskId,
                        "receiptType":242,
	                    'recPrice': item.recPrice,
	                    "boxCount":item.boxCount,
	                    'hzRemarks': item.hzRemarks,
	                    "deliveryMode":$scope.searchModel.deliveryModeSelect,
	                    "carrierId":$scope.searchModel.carrierIdSelect
                    })
                }else{
                    getReceipt(url,{
                    	"sendBillId":item.sendBillId,
                    	"wlPay":currPay,
                        "taskId":item.taskId,
                        "receiptType":241,
	                    'recPrice': item.recPrice,
	                    "boxCount":item.boxCount,
	                    'hzRemarks': item.hzRemarks,
	                    "deliveryMode":$scope.searchModel.deliveryModeSelect,
	                    "carrierId":$scope.searchModel.carrierIdSelect
                    })
                }
            }
            $scope.autoForm.taskIdModel='';
        };
        function getReceipt(url, data){
        	
        	if(data.boxCount==''||parseInt(data.boxCount)==0){
        		alert('请输入箱数！');
        		return false;
        	}
            var promise = orderReceipt.getDataTable(url,{
                "param": {
                    "query":data
                }
            });
            promise.then(function(data){
            	if(data.code != 0){
                    alert(data.message)
            		return false;
            	}else{
            		get();
                    // console.log($scope.autoForm)
//                	get(true);
            	}
            })
        }
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
        //分页跳转回调
        $scope.alreadyGoToPage = function() {
            get(true);
        }
        $scope.receiptComplete = function(){
        	$scope.sendTaskIds = '';
        	$scope.returnTaskIds = '';
        	if($scope.result == ''){
        		angular.forEach($scope.alreadyResult, function(item, index){
        			$scope.sendTaskIds += item.taskId + ',';
        			if(item.receiptType=='拒收'){
        				$scope.returnTaskIds+= item.taskId + ',';
        				}
        		})
        		$scope.sendTaskIds = $scope.sendTaskIds.slice(0, $scope.sendTaskIds.length - 1);
        		var carrierIdSelect = $scope.searchModel.carrierIdSelect == undefined ? -1 : $scope.searchModel.carrierIdSelect;
        		var driverIdSelect = $scope.searchModel.driverIdSelect == undefined ? -1 : $scope.searchModel.driverIdSelect;
        		$window.open('/print/printOrderReceipt.html?tokenId='+$rootScope.userInfo.token+'&sessionid='+$rootScope.userInfo.sessionId+'&taskIds='+$scope.sendTaskIds+'&sendBillId='+$scope.searchModel.sendBillId+'&deliveryMode='+$scope.searchModel.deliveryModeSelect+'&carrierId='+carrierIdSelect+'&driverId='+driverIdSelect);
        		$('#enterPrint').modal('show');
        	}else{
        		alert('待回执列表为空时可操作该按钮');	
        	}
        }
        $scope.reset = function(index, item){
        	 //console.log(item)
        	var resetPromise = orderReceipt.getDataTable('/orderReceipt/resetOrderReceipt',{
                "param": {
                    "query":{
                    	"taskId": item.taskId,
                    	"sendBillId": item.sendBillId
                    }
                }
            })
        	resetPromise.then(function(data){
            	if(data.code == 0){
            		alert(data.message);
            		get();
                	get(true);
            	}
            })
        }
        $scope.printConfirm = function(){
        	var resetPromise = orderReceipt.getDataTable('/orderReceipt/updatePrintState',{
                "param": {
                    "query":{
                    	"taskIds": $scope.sendTaskIds,
                    	"returnTaskIds":$scope.returnTaskIds,
                    	"list":$scope.alreadyResult
                    }
                }
            })
        	resetPromise.then(function(data){
        		// console.log(data)
            	if(data.code == 0){
            		alert(data.message);
            		get();
                	get(true);
                	$('#enterPrint').modal('hide');
            	}
            })
        }
    }])
});