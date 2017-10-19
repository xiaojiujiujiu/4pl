/**
 * Created by xuwusheng on 15/12/12.
 */
'use strict';
define(['../../../app', '../../../services/storage/inventory-manage/differenceConfirmationService'], function(app) {
     var app = angular.module('app');     app.controller('differenceConfirmationCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window', 'differenceConfirmation', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window, differenceConfirmation) {
        $rootScope.previousStateName='main.differenceConfirmation';
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            },{
                type: 'text',
                model: 'custTaskId',
                title: '客户单号'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '订单日期'
            }, {
                type: 'select',
                model: 'taskType',
                selectedModel:'taskTypeSelected',
                title: '业务类型'
            }, {
                type: 'select',
                model: 'status',
                selectedModel:'statusSelected',
                title: '差异确认状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = differenceConfirmation.getThead();
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
        $scope.ifShowSelect=true;
        var pmsSearch = differenceConfirmation.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.taskTypeSelected=-1;
            $scope.searchModel.statusSelected=-1;
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            if(data.query.flag==1){
                $scope.ifShowSelect=false;
            }else {
                $scope.ifShowSelect=true;
            }
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
//            $scope.searchModel.taskId = '';
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
            opts.taskType = $scope.searchModel.taskTypeSelected;
            opts.status = $scope.searchModel.statusSelected;

            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = differenceConfirmation.getDataTable({param: {query: opts}});
            promise.then(function (data) {
                // console.log(data)
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
        //导出
        $scope.impToExcel = function () {
        	 //获取选中 设置对象参数
        	 var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
             opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
             opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
             opts.taskType = $scope.searchModel.taskTypeSelected;
             opts.status = $scope.searchModel.statusSelected;

             opts.pageNo = $scope.paging.currentPage;
             opts.pageSize = $scope.paging.showRows;
             
             var params=$filter('json')({query:opts});
        	$window.open('../differentMonitor/impToXls?param='+params)
        	
        }
        $scope.goToPage= function () {
            get();
        }
    }])
})
