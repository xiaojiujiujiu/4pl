/**
 * Created by hui.sun on 15/12/13.
 */
'use strict';
define(['../../../app', '../../../services/logistics/orderReceipt/receiptOrderService'], function(app) {
     var app = angular.module('app');
    app.controller('receiptOrderCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window', 'receiptOrder', function($rootScope, $scope, $state, $sce, $filter, HOST, $window, receiptOrder) {
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
            items: [ {
                type: 'text',
                model: 'taskId',
                title: '取货单号'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '订单日期'
            }, {
                type: 'select',
                model: 'hzStatu',
                selectedModel:'hzStatuSelect',
                title: '回执状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = receiptOrder.getThead();
        //日志头
        $scope.openModelThHeader = receiptOrder.getOpenModelThHeader();
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
        var pmsSearch = receiptOrder.getSearch();
        pmsSearch.then(function(data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.hzStatuSelect=-1;
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
            opts.hzStatu = $scope.searchModel.hzStatuSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = receiptOrder.getDataTable({
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
        // 获取日志table数据
        $scope.getOpenModelData = function (index){
            var currTaskId = $scope.result[index].taskId;
            var currTypeId = $scope.result[index].orderTypeId;
            var promise = receiptOrder.getDetailTable('/takeGoods/query_goodsDetail', {
                    param: {
                        query: {
                            taskId: currTaskId,
                            orderTypeId:currTypeId
                        }
                    }
                }
            );
            promise.then(function(data){
            	   $scope.modalBanner = data.banner;
                $scope.openModelResult = data.grid;
                $scope.orderLogPaging = {
                    totalPage: data.total,
                    currentPage: $scope.orderLogPaging.currentPage,
                    showRows: $scope.orderLogPaging.showRows,
                };
            })
        }
        //确认回执
        $scope.receiptConfirm= function (i,item) {
            if(confirm('确定对该订单进行回执操作?')){
            	receiptOrder.Confirm({
                        param: {
                            query:{
                                taskId:item.taskId,
                                wlStatu:item.wlStatu,
                                orderTypeId:item.orderTypeId
                            }
                        }
                    },'/orderReceipt/updatePrintState')
                    .then(function (data) {
                        alert(data.status.msg)
                        if(data.status.code=="0000") {
                            get();
                        }
                    }, function (error) {
                        console.log(error)
                    });
            }
        }
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
    }])
});