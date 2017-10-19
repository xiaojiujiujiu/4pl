/**
 * Created by xiaojiu on 2017/3/28.
 */
define(['../../../app','../../../services/platform/confirmStockTransfer/confirmStockTransferService'], function (app) {
    var app = angular.module('app');
    app.controller('confirmStockTransferCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','confirmStockTransfer', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window,confirmStockTransfer) {

        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '申请单号'
                //autocomplete: 'goodsName',
                //autoCallback: 'goodsNameAutocomplete',
                //automodel: 'goodsId'
            }, {
                type: 'select',
                model: 'transferType',
                selectedModel: 'transferTypeSelect',
                title: '转移类型'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '创建日期'
            },{
                type: 'select',
                model: 'orderStatus',
                selectedModel: 'orderStatusSelect',
                title: '审核状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        $scope.thHeader=confirmStockTransfer.getThead();

        function getData(){
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.transferType = $scope.searchModel.transferTypeSelect;
            opts.orderStatus = $scope.searchModel.orderStatusSelect;
                opts.pageNo = $scope.paging.currentPage;
                opts.pageSize = $scope.paging.showRows;
                $scope.exParams = $filter('json')({query: opts});
                var promise = confirmStockTransfer.getDataTable('/stockTransfer/stockTransferList',{
                        param: {
                            query: opts
                        }
                    }
                );
                promise.then(function (data) {

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
        //移动加权平均价分页下拉框
        $scope.pagingSelect = [
            {value: 5, text: 5},
            {value: 10, text: 10, selected: true},
            {value: 20, text: 20},
            {value: 30, text: 30},
            {value: 50, text: 50}
        ];
        //移动加权平均价分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };

        var pmsSearch = confirmStockTransfer.getQuery();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.transferTypeSelect = "-1";
            $scope.searchModel.orderStatusSelect = "-1";
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            $scope.storageSelectedRDC = '-1';
            // $scope.storageSelectedCDC = '-1';
            //获取table数据
            getData(true);
        }, function (error) {
            console.log(error)
        });
        //查询
        $scope.searchClick= function () {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
           getData();
        }
        $scope.goToPage = function(){
            getData();
        }
        $scope.isShow=true;
        $scope.openModelThHeader=confirmStockTransfer.getOpenModelThHeader();
        $scope.getOpenModel = function(index,item){
            var promise = confirmStockTransfer.getBatchDataTable('/stockTransfer/detailStockTransfer',{
                param: {
                    query: {
                        taskId: item.taskId,
                    }
                }
            });
            promise.then(function (data) {
                if(!!data.banner.refuseRemark){
                    $scope.isShow=true;
                }else {
                    $scope.isShow=false;
                }
                $scope.modalBanner = data.banner;
                $scope.openModelResult = data.grid;
            })
            $('#lookModal').modal('show');
        }

    }]);
});