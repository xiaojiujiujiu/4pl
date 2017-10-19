
'use strict';
define(['../../../app', '../../../services/storage/order-qutbound/cdcOrderQutboundService'], function (app) {
     var app = angular.module('app');
    app.controller('cdcOrderOutboundCtrl', ['$rootScope','$scope', '$state', '$sce', '$window', 'cdcOrderQutbound', function ($rootScope,$scope, $state, $sce, $window, cdcOrderQutbound) {
        // 头部标签跳转
        $scope.orderPackHref = function () {
            $state.go('orderPack')
        }
        // 商品条码查询
        $scope.searchBarcode = function (barCode) {
            alert(barCode)
        }
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            },{
                type: 'text',
                model: 'orderId',
                title: '客户单号'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '订单日期'
            }, {
                type: 'select',
                model: 'orderTypeId',
                selectedModel: 'orderTypeIdSelect',
                title: '业务类型'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        $scope.tabFlag = true;
        //table头
       // $scope.thHeader = cdcOrderQutbound.getThead();
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
                $scope.thHeader = cdcOrderQutbound.getThead();
                if($scope.tabFlag){
                    packStatus = 0;
                }else{
                    packStatus = 1;
                }
            }else {
                $scope.thHeader = cdcOrderQutbound.getThead2();
            }
            var sendParam = {
                param: {
                    query: {
            	chuHuoState: packStatus
                    }
                }
            }
            var pmsSearch = cdcOrderQutbound.getSearch(sendParam);
            pmsSearch.then(function (data) {
                // console.log(data)
                $scope.searchModel = data.query; //设置当前作用域的查询对象
                $scope.searchModel.orderTypeIdSelect = -1;
                get(packStatus);
            }, function (error) {
                console.log(error)
            });

        }
        getQuery();
        
       

        //查询
        $scope.searchClick = function () {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            get();
//            $scope.searchModel.taskId = '';
        }
       
        function get(qutboundFlag) {
        	if(!qutboundFlag){
        		if($scope.tabFlag){
        			qutboundFlag = 0;
        		}else{
        			qutboundFlag = 1;
        		}
        	};
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            opts.chuHuoState = qutboundFlag;
            opts.orderTypeId=$scope.searchModel.orderTypeIdSelect;
            var promise = cdcOrderQutbound.getDataTable({
                param: {
                    "query": opts
                }
            });
            promise.then(function (data) {
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
                if(data.grid.length<=0){
                    $scope.isData=false;
                }else {
                    $scope.isData=true;
                }
                $scope.result = data.grid;
                $scope.paging.totalPage = data.total;
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function (error) {
                console.log(error);
            });

        }

        var taskIds = '';
        //打印
        $scope.print = function (index, item) {
            //$('#confirmPrint').modal('show');
            taskIds = item.taskId;
            $window.open('../print/cdcStockOut.html?tokenId='+$rootScope.userInfo.token+'&sessionid='+$rootScope.userInfo.sessionId+'&taskId=' + taskIds);
        }
        //弹窗确定打印
        $scope.printConfirm = function () {
        	$('#confirmPrint').modal('hide');
        	get();
        }
        //打印出库单
        $scope.printSelected = function () {
            taskIds = '';
            angular.forEach($scope.result, function (item, index) {
                if (item.pl4GridCheckbox.checked) {
                    taskIds += item.taskId + ','
                }
            });
            if (taskIds == '') {
                alert('请勾选业务单号！');
                return;
            };
            if (confirm('确定打印吗？')) {
                taskIds = taskIds.slice(0, taskIds.length - 1);
                $('#confirmPrint').modal('show');
                $window.open('../print/stockOut.html?tokenId='+$rootScope.userInfo.token+'&sessionid='+$rootScope.userInfo.sessionId+'&taskIds=' + taskIds);
            }
        }
        // 出库跳转
//        $scope.goOrderOutbound = function () {
//            var taskIds = '',ischuhuo=false;
//            angular.forEach($scope.result, function (item, index) {
//                if (item.pl4GridCheckbox.checked) {
//                    taskIds += item.taskId + ',';
//                    if(item.chuHuoState=='已出库'){
//                        alert('不能选择已出库的订单');
//                        ischuhuo=true;
//                        return false;
//                    }
//                }
//            });
//            if(ischuhuo) return false;
//            if(taskIds==''){
//                alert('请勾选业务单号!');
//                return false;
//            }else
//                taskIds = taskIds.slice(0, taskIds.length - 1);
//            /*if (taskIds == '') {
//                alert('请勾选出库项');
//            } else {
//                $state.go('main.orderOutboundConfirm', {taskIds: taskIds})
//            };*/
//            $state.go('main.orderOutboundConfirm', {taskIds: taskIds})
//        }
        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
        $scope.tabChange = function(index){
            if(index == 0){
                $('.orderQutboundBtn').show();
                    $scope.tabFlag = true;
                $scope.querySeting.items[2].title='订单日期';
            }else{
                $('.orderQutboundBtn').hide();
                $scope.tabFlag = false;
                $scope.querySeting.items[2].title='出库日期';
            }
            //$('#dt_0,#dt_1').datepicker({
            //    "setDate": new Date(),
            //    "autoclose": true
            //});
            getQuery(index);
            //get(index);
        }
    }])
});