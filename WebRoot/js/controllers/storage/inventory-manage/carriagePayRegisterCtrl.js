/**
 * Created by xuwusheng on 15/12/12.
 */
'use strict';
define(['../../../app', '../../../services/storage/inventory-manage/carriagePayRegisterService'], function (app) {
     var app = angular.module('app');     app.controller('carriagePayRegisterCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window', 'carriagePayRegister', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window, carriagePayRegister) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'recordId',
                title: '登记单号'
            }, {
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            }, {
                type: 'text',
                model: 'custTaskId',
                title: '客户单号'
            }, {
                type: 'select',
                model: 'distributype',
                selectedModel: 'distributypeSelect',
                title: '配送方式'
            }, {
                type: 'select',
                model: 'distributName',
                selectedModel: 'distributNameSelect',
                title: '配送员'
            }, 
//            {
//                type: 'select',
//                model: 'wlComp',
//                selectedModel: 'wlCompSelect',
//                title: '承运商'
//            },
            {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '登记日期'
            }, {
                type: 'select',
                model: 'payState',
                selectedModel: 'payStateSelect',
                title: '支付状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = carriagePayRegister.getThead();
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
        var pmsSearch = carriagePayRegister.getSearch();
        pmsSearch.then(function (data) {
        	// console.log(data)
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.distributypeSelect = -1;
            $scope.searchModel.distributNameSelect = -1;
//            $scope.searchModel.wlCompSelect = -1;
            $scope.searchModel.payStateSelect = 0;
            
            $scope.storageRDC = $scope.searchModel.rdcId;
            $scope.storageCDC = $scope.searchModel.cdcId;
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
          //  $scope.searchModel.taskId = '';
        }
        //任务类型 下拉框change
        $scope.orderTypeIdChange = function () {
            //  console.log($scope.searchModel.orderTypeIdSelect)
        }
        $scope.exParams = '';
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.customerId = $scope.searchModel.customerIdSelect;
            opts.distributype = $scope.searchModel.distributypeSelect;
//            opts.wlComp = $scope.searchModel.wlCompSelect;
            opts.distributName = $scope.searchModel.distributNameSelect;
            opts.payState = $scope.searchModel.payStateSelect;

            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = carriagePayRegister.getDataTable({param: {query: opts}});
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
                $scope.result = data.grid;
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function (error) {
                console.log(error);
            });
        }
        
        $scope.goToPage = function () {
			get()
        }
        $scope.printCallback = function(index, item){
        	window.open("/print/registration-form.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&recordId="+ item.recordId +"&taskId="+ item.taskId);
        }
        //导出
        $scope.impToExcel = function () {
        	 //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.customerId = $scope.searchModel.customerIdSelect;
            opts.distributype = $scope.searchModel.distributypeSelect;
//            opts.wlComp = $scope.searchModel.wlCompSelect;
            opts.distributName = $scope.searchModel.distributNameSelect;
            opts.payState = $scope.searchModel.payStateSelect;

            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            opts.flag = '2';
             var params=$filter('json')({query:opts});
        	$window.open('../compensateMonitor/impToExcel?tokenId='+$rootScope.userInfo.token+'&sessionid='+$rootScope.userInfo.sessionId+'&param='+params)
        	
        }
    }])
});