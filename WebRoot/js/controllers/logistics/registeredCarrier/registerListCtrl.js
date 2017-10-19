/**
 * Created by xuwusheng on 15/12/12.
 */
'use strict';
define(['../../../app', '../../../services/logistics/registeredCarrier/registerListService'], function(app) {
     var app = angular.module('app');
    app.controller('registerListCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window', 'registerList', function($rootScope, $scope, $state, $sce, $filter, HOST, $window, registerList) {
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
                model: 'recordId',
                title: '登记单号'
            }, {
                type: 'text',
                model: 'taskId',
                title: '订单单号'
            }, {
                type: 'text',
                model: 'customerId',
                selectedModel: 'customerIdSelect',
                title: '业务单号'
            }, {
                type: 'select',
                model: 'distributype',
                selectedModel: 'distributypeSelect',
                title: '配送类型'
            }, {
                type: 'select',
                model: 'distributName',
                selectedModel: 'distributNameSelect',
                title: '配送人员'
            }, {
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
        $scope.thHeader = registerList.getThead();
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
        var pmsSearch = registerList.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.customerIdSelect = -1;
            $scope.searchModel.distributypeSelect = -1;
            $scope.searchModel.distributNameSelect = -1;
            $scope.searchModel.payStateSelect = -1;
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
                showRows: $scope.paging.showRows,
            };
            get();
            $scope.searchModel.customerId = '';
            $scope.searchModel.taskId = '';
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
            opts.distributName = $scope.searchModel.distributNameSelect;
            opts.payState = $scope.searchModel.payStateSelect;

            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = registerList.getDataTable({param: {query: opts}});
            promise.then(function (data) {
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
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function (error) {
                console.log(error);
            });
        }
    }])
});