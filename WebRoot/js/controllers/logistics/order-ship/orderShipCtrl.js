/**
 *
 * @authors Hui Sun
 * @date    2015-12-11
 * @version $Id$
 */
'use strict';
define(['../../../app', '../../../services/logistics/order-ship/orderShipService'], function (app) {
     var app = angular.module('app');      var app = angular.module('app');     app.controller('orderShipCtrl', ['$rootScope','$scope', '$state', '$sce','$window', 'orderShip', function ($rootScope,$scope, $state, $sce,$window, orderShip) {
        $scope.taskId = '';
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'select',
                model: 'deliveryMode',
                selectedModel: 'deliveryModeSelect',
                changeCallBack: 'deliveryModeCall',
                title: '配送方式'
            }/*, {
             type: 'select',
             model: 'driverId',
             selectedModel: 'driverIdSelect',
             title: '配送员'
             }, {
             type: 'select',
             model: 'vehicleId',
             selectedModel: 'vehicleIdSelect',
             title: '车辆'
             }*/]
        };

        //table头
        $scope.thHeader = orderShip.getThead();
        //绑定快递单号表头
        $scope.thirdDeliverGridHeader=orderShip.thirdDeliverHeader();
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
        function getSearch(data, call) {
            var pmsSearch = orderShip.getSearch(data);
            pmsSearch.then(function (data) {
                $scope.searchModel = data.query; //设置当前作用域的查询对象
                if (!call) {
                    $scope.searchModel.deliveryModeSelect = -1;
                    $scope.searchModel.driverIdSelect = -1;
                    $scope.searchModel.vehicleIdSelect = -1;
                    //获取table数据
                    //get();
                } else
                    call();
            }, function (error) {
                console.log(error)
            });
        }
        getSearch({param: {query: {"deliveryMode": -1}}}, null);
        //配送方式下拉框change
        $scope.deliveryModeCall = function () {
            $scope.querySeting.items.splice(1);
            switch ($scope.searchModel.deliveryModeSelect) {
                //第三方配送
                case '1':
                    $scope.querySeting.items.push(
                        {
                            type: 'select',
                            model: 'carrierId',
                            selectedModel: 'carrierIdSelect',
                            title: '承运商'
                        }
                    );
                    getSearch({param: {query: {"deliveryMode": 1}}}, function () {
                        $scope.searchModel.deliveryModeSelect = '1';
                        $scope.searchModel.carrierIdSelect = -1;
                    });
                    break;
                //自助配置
                case '2':
                    $scope.querySeting.items.push(
                        {
                            type: 'select',
                            model: 'driverId',
                            selectedModel: 'driverIdSelect',
                            title: '配送员'
                        }, {
                            type: 'select',
                            model: 'vehicleId',
                            selectedModel: 'vehicleIdSelect',
                            title: '配送车辆'
                        }
                    );
                    getSearch({param: {query: {"deliveryMode": 2}}}, function () {
                        $scope.searchModel.deliveryModeSelect = '2';
                        $scope.searchModel.driverIdSelect = -1;
                        $scope.searchModel.vehicleIdSelect = -1;
                    });
                    break;
                //客户自提
                case '3':
                    $scope.querySeting.items.push(
                        {
                            type: 'select',
                            model: 'driverId',
                            selectedModel: 'driverIdSelect',
                            title: '配送员'
                        }
                    );
                    getSearch({param: {query: {"deliveryMode": 3}}}, function () {
                        $scope.searchModel.deliveryModeSelect = '3';
                        $scope.searchModel.driverIdSelect = -1;
                    });
                	/*$scope.searchModel.driverIdSelect = null;
                    $scope.searchModel.vehicleIdSelect = null;*/
                    break;
                default :
                    break
            }
        }
        //查询
        $scope.searchClick = function () {
        	 var reg = new RegExp("^[0-9+\-\a-zA-Z]*$");
         	if(!reg.test($scope.taskId)){
         		  alert("请输入正确的业务单号！")
           		return false;
         	}
        	if( $scope.taskId == ''){
        		alert("请输入业务单号！");
        		 return false;
        	}else{
        		get();
        	}
            
        }
        //任务类型 下拉框change
        $scope.orderTypeIdChange = function () {
            //  console.log($scope.searchModel.orderTypeIdSelect)
        }
        $scope.result=[];
        function get() {
            //获取选中 设置对象参数
            //var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            /*opts.deliveryMode = $scope.searchModel.deliveryModeSelect;
             opts.driverId = $scope.searchModel.driverIdSelect;
             opts.carrierId = $scope.searchModel.carrierIdSelect||-1;
             opts.vehicleId = $scope.searchModel.vehicleIdSelect;*/
            //opts.page = $scope.paging.currentPage;
            //opts.pageSize = $scope.paging.showRows;
            var promise = orderShip.getDataTable({
                param: {
                    query: {
                        taskId: $scope.taskId,
                        flag:1
                    }
                }
            });
            promise.then(function (data) {
                if(data.code==-1){
                    alert(data.message);
                    return false;
                }
                var isResult=false;
                angular.forEach($scope.result, function (item,i) {
                    if(item.id==data.grid[0].id){
                    	$scope.result[i]=data.grid[0];
                        isResult=true;
                        return false;
                    }
                });
                if(!isResult)
                    $scope.result.push(data.grid[0]);
                /*$scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };*/
            }, function (error) {
                console.log(error);
            });
        }
        var enterDeliverOpts={},//确认发货参数
            carrier={};//选中承运商对象
        $scope.enterDeliver= function () {
            if($scope.searchModel.deliveryModeSelect==-1) {
                alert('请选择配送方式');
                return;
            };
            if($scope.result.length==0) {
                alert('没有任何数据!');
                return false;
            }
            enterDeliverOpts={
                banner:{
                    "deliveryMode": $scope.searchModel.deliveryModeSelect,
                    "carrierId": $scope.searchModel.carrierIdSelect,
                    "driverId": $scope.searchModel.driverIdSelect,
                    "vehicleId": $scope.searchModel.vehicleIdSelect
                },
                grid:$scope.result,
                otherList:undefined
            };
            //选择第三方配送
            if($scope.searchModel.deliveryModeSelect==1){
                if($scope.searchModel.carrierIdSelect==-1){
                    alert('请选择承运商!');
                    return;
                }
                //获取承运商对象
                angular.forEach($scope.searchModel.carrierId, function (item) {
                  if(item.id==$scope.searchModel.carrierIdSelect){
                      carrier=item;
                      return false;
                  }
                })
                $scope.thirdDeliverGrid=orderShip.setThirdDeliverGrid($scope.searchModel,$scope.result,new Array(carrier));
                $('#thirdDeliver').modal('show');
            }else{
                //自主配送
                if($scope.searchModel.deliveryModeSelect==2){
                    if($scope.searchModel.driverIdSelect == -1){
                        alert('请选择配送员!');
                        return;
                    }
                    if($scope.searchModel.vehicleIdSelect == -1){
                        alert('请选择车辆!');
                        return;
                    }

                }
                enterSendGoods(enterDeliverOpts);
            }
        }
        $scope.bindDeliver= function () {
            
            enterDeliverOpts.otherList=[];
            var flag=true;
            angular.forEach($scope.thirdDeliverGrid, function (item) {
            	if(item.orderID==''){
            		alert('请填写第三方单号！');
            		flag=boolean;
            		return false;
            	}
            	if(item.recAddressSelected=='-1'){
            		alert('请选择计费方式！');
            		flag=boolean;
            		return false;
            	}
            	
            	if(item.packBoxCount==''){
            		alert('请填写运费！');
            		flag=boolean;
            		return false;
            	}
            	if(item.boxCountSelected=='-1'){
            		alert('请选择结算方式！');
            		flag=boolean;
            		return false;
            	}
                enterDeliverOpts.otherList.push({
                    "id": item.id,
                    "taskId": item.taskId,
                    "thirdWlId": item.orderID,
                    "carrierId": item.recPhoneSelected,
                    "billingType": item.recAddressSelected,
                    "pay": item.packBoxCount,
                    "clearType": item.boxCountSelected
                });
            })
            if(flag){
            	enterSendGoods(enterDeliverOpts);
            }
        }
        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
        //删除行
        $scope.deleteCall = function (index,item) {
            if(confirm('确定删除吗?')){
                $scope.result.splice(index,1);
            }
        }
        function enterSendGoods(opt){
            orderShip.getDataTable({param:opt},'/orderDelivery/confirmDelivery')
                .then(function (data) {
//                    alert(data.message);
//                    console.log(data);
//                    return false;
                    if(data.code==0){
                        var taskIds='';
                        angular.forEach($scope.result, function (item) {
                            taskIds+=item.taskId+',';
                        });
                        if(taskIds!=='')
                            taskIds=taskIds.substr(0,taskIds.length-1);

                        $('#thirdDeliver').modal('hide');
                        if(data.code==0){
                        	 alert('已配送！', function () {
                                 $window.open('/print/distributionJoin.html?tokenId='+$rootScope.userInfo.token+'&sessionid='+$rootScope.userInfo.sessionId+'&taskIds='+taskIds+'&deliveryMode='+$scope.searchModel.deliveryModeSelect+'&carrierId='+($scope.searchModel.carrierIdSelect||'')+'&driverId='+($scope.searchModel.driverIdSelect||'')+'&vehicleId='+($scope.searchModel.vehicleIdSelect||''));

                             })
                        }
                       

                        $scope.taskId = '';
                        $scope.result=[];
                        //get();
                    }else {
                        alert(data.message);
                    }
                }, function (error) {
                    console.log(error)
                })
        }
        //绑定快递单号 行删除
        $scope.thirdDeliverDeleteCall= function (index,item) {
            //alert(index)
            $scope.thirdDeliverGrid.splice(index,1);
        }
        //确定发货
        $scope.enterSend= function () {

        }
        //打印
        $scope.print= function () {
            if($scope.searchModel.deliveryModeSelect==-1) {
                alert('请选择配送方式');
                return;
            }
            if($scope.searchModel.deliveryModeSelect==1){
                if($scope.searchModel.carrierIdSelect==-1){
                    alert('请选择承运商!');
                    return;
                }
            }else{
                //自主配送
                if($scope.searchModel.deliveryModeSelect==2){
                    if($scope.searchModel.driverIdSelect == -1){
                        alert('请选择配送员!');
                        return;
                    }
                    if($scope.searchModel.vehicleIdSelect == -1){
                        alert('请选择车辆!');
                        return;
                    }

                }
                //enterSendGoods(enterDeliverOpts);
            }

            $window.open('/print/distributionJoin.html?tokenId='+$rootScope.userInfo.token+'&sessionid='+$rootScope.userInfo.sessionId+'&deliveryMode='+$scope.searchModel.deliveryModeSelect+'&carrierId='+($scope.searchModel.carrierIdSelect||'')+'&driverId='+($scope.searchModel.driverIdSelect||'')+'&vehicleId='+($scope.searchModel.vehicleIdSelect||''));
        }
    }])
});