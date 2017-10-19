/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app', '../../../services/platform/monitor-manage/stockMonitorService'], function (app) {
     var app = angular.module('app');
    app.controller('stockMonitorCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window', 'stockMonitor', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window, stockMonitor) {

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
        //theadr
        $scope.thHeader = stockMonitor.getThead();
        // 日志grid头
        $scope.openModelThHeader = stockMonitor.getOpenModelThHeader();
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
        var pmsSearch = stockMonitor.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.customerIdSelect = -1;
            $scope.searchModel.ckStateSelect = -1;
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
        $scope.logExParams = '';
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
            var promise = stockMonitor.getDataTable(
                HOST + '/inventoryMonitor/adminQuery_inventory',
                {
                    param: {
                        query: opts
                    }
                }
            );
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
                // console.log($scope.paging)

                // $scope.paging.totalPage = data.total;
            }, function (error) {
                console.log(error);
            });
        }

        // 获取日志table数据
        $scope.getOpenModelData = function (index) {
            var currCkId = $scope.result[index].ckId,
                currUpdateTime = $scope.result[index].updateTime,
                currSku = $scope.result[index].sku;
            var opts = {
                query: {
                    ckId: currCkId,
                    updateTime: currUpdateTime,
                    sku: currSku
                }
            }
            var promise = stockMonitor.getDetailTable(
                HOST + '/inventoryMonitor/query_inventoryDetail',
                {
                    param: opts
                }
            );

            promise.then(function (data) {
                $scope.openModelResult = data.grid;
                $scope.logModalBanner = data.banner;
                $scope.orderLogPaging = {
                    totalPage: data.total,
                    currentPage: $scope.orderLogPaging.currentPage,
                    showRows: $scope.orderLogPaging.showRows,
                };
            })
            delete opts.query.updateTime;
            $scope.logExParams = $filter('json')(opts);
        }

        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
    }])
});