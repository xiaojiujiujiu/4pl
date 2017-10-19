/**
 * Created by xuwusheng on 15/11/16.
 */
'use strict';
define(['../../../app', '../../../services/storage/storage/cdctakeGoodsTaskService'], function (app) {
    var app = angular.module('app');
    app.controller('cdcTakeGoodsCtrl', ['$rootScope', '$scope', '$state', '$sce', '$window', 'cdcTakeGoods', function ($rootScope, $scope, $state, $sce, $window, cdcTakeGoods) {
        //$state.go('checkstorage',{taskId:123});  跳转

        //查询配置 注意(查询返回对象必须设置为$scope.searchModel)
        $scope.querySeting = {
            items: [
                { type: 'text', model: 'taskId', title: '业务单号' },
                { type: 'text', model: 'orderId', title: '客户单号' },
                { type: 'date', model: ['startTime', 'endTime'], title: '订单日期' },
                {
                    type: 'select',
                    model: 'orderTypeId',
                    title: '业务类型',
                    selectedModel: 'orderTypeIdSelect',
                    changeCallBack: 'orderTypeIdChange'
                },
                /*{type: 'select', model: 'inGoodsState', title: '业务状态', selectedModel: 'inGoodsStateSelect'},*/

                //{ type: 'select', model: 'customerID', title: '客户', selectedModel: 'customerIdSelect' }
            ],
            btns: [
                { text: $sce.trustAsHtml('查询'), click: 'searchClick' }]
        };

        //table头
        $scope.thHeader = cdcTakeGoods.getThead();
        //分页下拉框
        $scope.pagingSelect = [
            { value: 5, text: 5 },
            { value: 10, text: 10, selected: true },
            { value: 20, text: 20 },
            { value: 30, text: 30 },
            { value: 50, text: 50 }
        ];
        //日志分页下拉框
        $scope.pagingSelect = [
            { value: 5, text: 5 },
            { value: 10, text: 10, selected: true },
            { value: 20, text: 20 },
            { value: 30, text: 30 },
            { value: 50, text: 50 }
        ];
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        var pmsSearch = cdcTakeGoods.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query;//设置当前作用域的查询对象
            //console.log(data.query);
            //下拉框model
            $scope.searchModel.orderTypeIdSelect = -1;
            //$scope.searchModel.inGoodsStateSelect = -1;
            $scope.searchModel.customerIdSelect = -1;
            //获取table数据
            get();
        }, function (error) {
            console.log(error)
        });

        //查询
        $scope.searchClick = function () {
            //设置默认第一页
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
            //console.log($scope.searchModel.orderTypeIdSelect)
        }
        var inGoodsState = 2;
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.orderTypeId = $scope.searchModel.orderTypeIdSelect;
            opts.inGoodsState = inGoodsState;
            opts.customerID = $scope.searchModel.customerIdSelect;
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = cdcTakeGoods.getDataTable({ param: { query: opts } });
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
                if(data.grid.length<=0){
                    $scope.isData=false;
                }else {
                    $scope.isData=true;
                }
                $scope.result = data.grid;
                //重置paging 解决分页指令不能监听对象问题
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function (error) {
                console.log(error);
            });
            $scope.tackGoods = function (obj) {
            }
        }

        $scope.navClick = function (i) {
            $scope.searchModel.taskId = '';
            $scope.searchModel.orderId = '';
            $scope.searchModel.orderTypeIdSelect = -1;
            $scope.searchModel.customerIdSelect = -1;
            $scope.searchModel.startTime = '';
            $scope.searchModel.endTime = '';

            $("#dt_0").val("");
            $("#dt_1").val("");
            if (i == 2) {
                $scope.thHeader = cdcTakeGoods.getThead();
                $scope.querySeting.items[2].title="订单日期";
            } else if (i == 1) {
                $scope.thHeader = cdcTakeGoods.getThead2();
                $scope.querySeting.items[2].title="收货日期";
            }
            inGoodsState = i;
            get();

            //$("#dt_0").datepicker.defaults.onRender(new Date())
            // var date = new Date();
            // $('#dt_0').datepicker('setValue', new Date(date.getFullYear(), date.getMonth(), 1));
        }
        //打印
        $scope.print = function (i, item) {
            $window.open('../print/cdcPutInStorage.html?tokenId=' + $rootScope.userInfo.token + '&sessionid=' + $rootScope.userInfo.sessionId + '&taskId=' + item.taskId);

        }
        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }


    }])
});