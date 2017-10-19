/**
 * Created by xiaojiu on 2017/5/27.
 */

'use strict';
define(['../../../app', '../../../services/storage/order-qutbound/fsOutGoodsOrderManageService'], function (app) {
    var app = angular.module('app');
    app.controller('fsOutGoodsOrderManageCtrl', ['$rootScope','$scope', '$state', '$sce', '$window', 'fsOutGoodsOrderManage', function ($rootScope,$scope, $state, $sce, $window, fsOutGoodsOrderManage) {
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
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = fsOutGoodsOrderManage.getThead();
        var pmsSearch = fsOutGoodsOrderManage.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query;
            get();
        }, function (error) {
            console.log(error)
        });

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

        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = fsOutGoodsOrderManage.getDataTable({
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
        //查看
        $scope.lookGird=function(i,item){
            getLogData(item.taskId);
            $('#lookGird').modal('show');
        }
        // 查看头
        $scope.logModalThHeader = fsOutGoodsOrderManage.getLogThead();

//        function getLogData(opts) {
//            //获取选中 设置对象参数
//            var promise = fsOutGoodsOrderManage.getDataTable({
//                param: {
//                    query: opts
//                }
//            });
//            promise.then(function (data) {
//                $scope.logModalBanner = data.banner;
//                $scope.logModalResult = data.grid;
//                //console.log(data)
//            }, function (error) {
//                console.log(error);
//            });
//        }
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


        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
    }])
});