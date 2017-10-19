/**
 * Created by hui.sun on 15/12/13.
 */
'use strict';
define(['../../../app', '../../../services/storage/inventory-manage/cdcInventoryQueryService'], function (app) {
     var app = angular.module('app');
    app.controller('cdcInventoryQueryCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window', 'cdcInventoryQuery', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window, cdcInventoryQuery) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'serialNumber',
                title: '出厂编码'
            }, {
                type: 'text',
                model: 'name',
                title: '商品名称'
            }, {
                type: 'text',
                model: 'brand',
                title: '品牌'
            }, {
                type: 'text',
                model: 'product',
                title: '品类'
            }, {
                type: 'text',
                model: 'goodsStyle',
                title: '规格型号'
            }, {
                type: 'text',
                model: 'supplier',
                title: '供应商'
            }, {
                type: 'text',
                model: 'goodsCode',
                title: '商品编码'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '库存更新日期'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = cdcInventoryQuery.getThead();
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
        var pmsSearch = cdcInventoryQuery.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
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
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = cdcInventoryQuery.getDataTable('/cdcStockMonitor/queryStock',{
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
                if(data.grid.length<=0){
                    $scope.isData=false;
                }else {
                    $scope.isData=true;
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
             var params=$filter('json')({query:opts});
        	$window.open('../cdcStockMonitor/exportToExcel?token=&param='+params)
        	
        }
        // 日志操作
        $scope.logModalCall = function(inde, item){
        	$scope.sendParam = {
                goodsCode: item.goodsCode,
        	}
        	getLogData($scope.sendParam);
        	$('#logModal').modal('show');
            delete $scope.sendParam.updateTime;
            $scope.logExParams = $filter('json')({query:$scope.sendParam});
        	
        }
        // 日志table头
        $scope.logModalThHeader = cdcInventoryQuery.getLogThead();
        
        function getLogData(opts) {
            //获取选中 设置对象参数
            var promise = cdcInventoryQuery.getDataTable('/cdcStockMonitor/queryStockEntry',{
            	param: {
            		query: opts
            	}
            });
            promise.then(function (data) {
                    $scope.logModalBanner = data.banner;
                $scope.logModalResult = data.grid;
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