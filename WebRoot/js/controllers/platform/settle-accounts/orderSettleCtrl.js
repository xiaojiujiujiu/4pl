/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/platform/settle-accounts/orderSettleService'], function (app) {
     var app = angular.module('app');
    app.controller('orderSettleCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','orderSettle', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window,orderSettle) {
    	
        // query moudle setting
        $scope.querySeting = {
            items: [ {
                type: 'select',
                model: 'customerId',
                selectedModel: 'customerIdSelect',
                title: '客户'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '操作日期'
            }, {
                type: 'select',
                model: 'orderTypeId',
                selectedModel: 'orderTypeIdSelect',
                title: '业务类型'
            },
            //     {
            //     type: 'select',
            //     model: 'orderStatus',
            //     selectedModel: 'orderStatusSelect',
            //     title: '订单状态'
            // },
            //     {
            //     type: 'select',
            //     model: 'payWay',
            //     selectedModel: 'payWaySelect',
            //     title: '结算分类'
            // }
            ],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = orderSettle.getThead();
        //分页下拉框
        $scope.pagingSelect = [
            {value: 5, text: 5},
            {value: 10, text: 10, selected: true},
            {value: 20, text: 20},
            {value: 30, text: 30},
            {value: 50, text: 50}
        ];
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        var pmsSearch = orderSettle.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.customerIdSelect = -1;
            $scope.searchModel.orderTypeIdSelect = -1;
            $scope.searchModel.orderStatusSelect = -1;
            $scope.searchModel.payWaySelect = -1;
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            $scope.storageSelectedRDC = '-1';
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
        $scope.exParams = '';
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.customerId = $scope.searchModel.customerIdSelect;
            opts.orderTypeId = $scope.searchModel.orderTypeIdSelect;
            opts.orderStatus = $scope.searchModel.orderStatusSelect;
            opts.payWay = $scope.searchModel.payWaySelect;

            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = orderSettle.getDataTable(
            	'/shipBanlance/query_orderBanlanList',
                {
                    param: {
                        query: opts
                    }
                }
            );
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
                // $scope.paging.totalPage = data.total;
            }, function (error) {
                console.log(error);
            });
        }

        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
//        //导出
//        $scope.impToExcel = function () {
//        	 //获取选中 设置对象参数
//            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
//            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
//            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
//            opts.customerId = $scope.searchModel.customerIdSelect;
//            opts.orderTypeId = $scope.searchModel.orderTypeIdSelect;
//            opts.orderStatus = $scope.searchModel.orderStatusSelect;
//            opts.payWay = $scope.searchModel.payWaySelect;
//
//            opts.pageNo = $scope.paging.currentPage;
//            opts.pageSize = $scope.paging.showRows;
//             
//             var params=$filter('json')({query:opts});
//        	$window.open('/shipBanlance/impToExcels?param='+params)
//        	
//        }
    }])
});