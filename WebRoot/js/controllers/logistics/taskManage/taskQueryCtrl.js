/**
 * Created by hui.sun on 15/12/13.
 */
'use strict';
define(['../../../app', '../../../services/logistics/taskManage/taskQueryService'], function(app) {
     var app = angular.module('app');
    app.controller('taskManageCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window', 'taskQuery', function($rootScope, $scope, $state, $sce, $filter, HOST, $window, taskQuery) {
        $scope.banner={};
        // 头部标签跳转
        $scope.orderPackHref = function(){
            $state.go('orderPack')
        }
        // 商品条码查询
        $scope.searchBarcode = function(barCode){
            alert(barCode)
        }
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'select',
                model: 'wlType',
                selectedModel:'wlTypeSelect',
                title: '配送方式'
            }, {
                type: 'select',
                model: 'sentUser',
                selectedModel:'sentUserSelect',
                title: '配送员'
            },  
//            {
//                type: 'select',
//                model: 'wlComp',
//                selectedModel: 'wlCompSelect',
//                title: '承运商'
//            }, 
            {
                type: 'select',
                model: 'wlCar',
                selectedModel:'wlCarSelect',
                title: '车辆'
            }, {
                type: 'select',
                model: 'customerId',
                selectedModel:'customerIdSelect',
                title: '客户'
            }, {
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            },  {
                type: 'select',
                model: 'orderTypeId',
                selectedModel:'orderTypeIdSelect',
                title: '业务类型'
            }, {
                type: 'text',
                model: 'custTaskId',
                title: '客户单号'
            }, {
                type: 'select',
                model: 'orderStatus',
                selectedModel:'orderStatusSelect',
                title: '订单状态'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '发货日期'
            }, {
                type: 'text',
                model: 'thirdWlId',
                title: '第三方单号'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = taskQuery.getThead();
        //日志头
        $scope.openModelThHeader = taskQuery.getOpenModelThHeader();
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
        // 日志分页下拉框
        $scope.logPagingSelect = [
            {value: 5, text: 5},
            {value: 10, text: 10, selected: true},
            {value: 20, text: 20},
            {value: 30, text: 30},
            {value: 50, text: 50}
        ];
        //分页对象
        $scope.orderLogPaging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        var pmsSearch = taskQuery.getSearch();
        pmsSearch.then(function(data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.wlTypeSelect=-1;
            $scope.searchModel.sentUserSelect=-1;
            $scope.searchModel.wlCarSelect=-1;
//            $scope.searchModel.wlCompSelect = -1;
            $scope.searchModel.customerIdSelect=-1;
            $scope.searchModel.orderTypeIdSelect=-1;
            $scope.searchModel.orderStatusSelect=-1;
            //获取table数据
            get();
        }, function(error) {
            console.log(error)
        });

        //查询
        $scope.searchClick = function() {

            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows,
            };
            get();
            //$scope.searchModel.taskId = '';
        }

        $scope.exParams = '';
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象

            opts.wlType = $scope.searchModel.wlTypeSelect;
            opts.sentUser = $scope.searchModel.sentUserSelect;
            opts.wlCar = $scope.searchModel.wlCarSelect;
            opts.customerId = $scope.searchModel.customerIdSelect;
//            opts.wlComp = $scope.searchModel.wlCompSelect;
            opts.orderStatus = $scope.searchModel.orderStatusSelect;
            opts.orderTypeId = $scope.searchModel.orderTypeIdSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = taskQuery.getDataTable({
                param: {query:opts}
            });
            promise.then(function(data) {
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
                $scope.banner=data.banner;
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
        //导出
        $scope.impToExcel = function () {
        	  //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象

            opts.wlType = $scope.searchModel.wlTypeSelect;
            opts.sentUser = $scope.searchModel.sentUserSelect;
            opts.wlCar = $scope.searchModel.wlCarSelect;
            opts.customerId = $scope.searchModel.customerIdSelect;
//            opts.wlComp = $scope.searchModel.wlCompSelect;
            opts.orderStatus = $scope.searchModel.orderStatusSelect;
            opts.orderTypeId = $scope.searchModel.orderTypeIdSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
             
             var params=$filter('json')({query:opts});
        	$window.open('../workMonitor/impToExcel?tokenId='+$rootScope.userInfo.token+'&sessionid='+$rootScope.userInfo.sessionId+'&param='+params)
        	
        }
        // 获取日志table数据
        $scope.getOpenModelData = function (index){
            var currTaskId = $scope.result[index].taskId,
                		currCustId = $scope.result[index].custTaskId;
            var promise = taskQuery.getDetailTable('/workMonitor/queryOrderDetail', {
                    param: {
                        query: {
                            taskId: currTaskId,
                            custTaskId: currCustId
                        }
                    }
                }
            );
            promise.then(function(data){
                $scope.openModelResult = data.grid;
                $scope.orderLogPaging = {
                    totalPage: data.total,
                    currentPage: $scope.orderLogPaging.currentPage,
                    showRows: $scope.orderLogPaging.showRows,
                };
            })
        }

        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
    }])
});