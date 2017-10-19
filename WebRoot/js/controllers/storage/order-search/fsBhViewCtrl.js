/**
 * Created by xiaojiu on 2017/5/27.
 */
'use strict';
define(['../../../app', '../../../services/storage/order-search/fsBhViewService'], function(app) {
    var app = angular.module('app');
    app.controller('fsBhViewCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window', 'fsBhView',function ($rootScope, $scope, $state, $sce, $filter, HOST, $window, fsBhView) {

        // query moudle setting
        $scope.querySeting = {
            items: [ {
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            }, {
                type: 'text',
                model: 'orderId',
                title: '客户单号'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '补货日期'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = fsBhView.getThead();
        // 日志grid头
        $scope.openModelThHeader = fsBhView.getOpenModelThHeader();
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
        $scope.ifShowSelect=true;
        var pmsSearch = fsBhView.getSearch();
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
//            $scope.searchModel.taskId = '';
        }

        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = fsBhView.getDataTable(
                HOST + '/fsMonitor/bhList',
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
                console.log(data)
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
                // console.log($scope.paging)

                // $scope.paging.totalPage = data.total;
            }, function (error) {
                console.log(error);
            });
        }

        // 获取补货明细table数据
        $scope.getOpenModelData = function (index){
            var currTaskId = $scope.result[index].taskId
            var promise = fsBhView.getDataTable(
                HOST + '/fsMonitor/bhDetailList',
                {
                    param: {
                        query: {
                            taskId: currTaskId
                        }
                    }
                }
            );
            promise.then(function(data){
                $scope.openModelResult = data.grid;
               $scope.logModalBanner=data.banner;
            })
        }

        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
        //日志分页跳转回调
        /*$scope.logGoToPage = function () {
         getOpenModelData();
         }*/
        // 日志分页下拉框
        /*$scope.logPagingSelect = [
         {value: 5, text: 5, selected: true},
         {value: 10, text: 10},
         {value: 20, text: 20},
         {value: 30, text: 30},
         {value: 50, text: 50}
         ];
         //分页对象
         $scope.orderLogPaging = {
         totalPage: 1,
         currentPage: 1,
         showRows: 30,
         };*/
    }])
});