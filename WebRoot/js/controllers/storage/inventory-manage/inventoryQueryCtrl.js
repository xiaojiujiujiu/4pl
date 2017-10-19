/**
 * Created by hui.sun on 15/12/13.
 */
'use strict';
define(['../../../app', '../../../services/storage/inventory-manage/inventoryQueryService'], function (app) {
     var app = angular.module('app');     app.controller('inventoryQueryCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window', 'inventoryQuery', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window, inventoryQuery) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'sku',
                title: '商品编码'
            }, {
                type: 'select',
                model: 'customerid',
                selectedModel: 'customerIdSelect',
                title: '客户'
            }, {
                type: 'text',
                model: 'goodsType',
                title: '品类'
            }, {
                type: 'text',
                model: 'goodsName',
                title: '商品名称'
            }, {
                type: 'text',
                model: 'model',
                title: '型号'
            },
            //     {
            //     type: 'select',
            //     model: 'ckState',
            //     selectedModel: 'ckStateSelect',
            //     title: '库存状态'
            // },
                {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '库存更新日期'
            }, {
                type: 'text',
                model: 'supliers',
                title: '供应商'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = inventoryQuery.getThead();
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
        var pmsSearch = inventoryQuery.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.customerIdSelect = -1;
            $scope.searchModel.ckStateSelect = -1;
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            $scope.storageSelectedRDC = '-1';
            $scope.storageSelectedCDC = '-1';
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
            opts.customerid = $scope.searchModel.customerIdSelect;
            opts.ckState = $scope.searchModel.ckStateSelect;

            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = inventoryQuery.getDataTable('/inventoryMonitor/query_inventory',{
            	param: {
            		query: opts
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
        //分页跳转回调
        $scope.goToPage = function () {
			get()
        }
        //测试导出
        $scope.excelTest = function () {
        	 var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
             opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
             opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
             opts.customerid = $scope.searchModel.customerIdSelect;
             opts.ckState = $scope.searchModel.ckStateSelect;
             opts.pageNo = $scope.paging.currentPage;
             opts.pageSize = $scope.paging.showRows;
             var params=$filter('json')({query:opts});
        	$window.open('../inventoryMonitor/impToExcel?token=&param='+params)
        	
        }
        // 日志操作
        $scope.logModalCall = function(inde, item){
        	$scope.sendParam = {
        		ckId: item.ckId,
        		updateTime: item.updateTime,
        		sku: item.sku
        	}
        	getLogData($scope.sendParam);
        	$('#logModal').modal('show');
            delete $scope.sendParam.updateTime;
            $scope.logExParams = $filter('json')({query:$scope.sendParam});
        	
        }
        // 日志table头
        $scope.logModalThHeader = inventoryQuery.getLogThead();
        
        function getLogData(opts) {
            //获取选中 设置对象参数
            var promise = inventoryQuery.getDataTable('/inventoryMonitor/query_inventoryDetail',{
            	param: {
            		query: opts
            	}
            });
            promise.then(function (data) {
                $scope.logModalResult = data.grid;
                $scope.logModalBanner = data.banner;
                //console.log(data)
            }, function (error) {
                console.log(error);
            });
        }
        /*$scope.LogDataPage = function(){
        	$scope.sendParam.pageNo = $scope.logPaging.currentPage;
            $scope.sendParam.pageSize = $scope.logPaging.showRows;
        	getLogData($scope.sendParam)
        }*/
       /*// 日志分页
        //分页下拉框
        $scope.logPagingSelect = [{
            value: 5,
            text: 5,
            selected: true
        }, {
            value: 10,
            text: 10
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
        $scope.logPaging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };*/
    }])
});