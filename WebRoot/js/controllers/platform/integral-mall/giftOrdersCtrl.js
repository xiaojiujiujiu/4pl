/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/platform/integral-mall/giftOrdersService'], function (app) {
     var app = angular.module('app');
    app.controller('giftOrdersCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','giftOrders', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window,giftOrders) {

        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '创建日期'
            },  {
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            }, {
                type: 'text',
                model: 'exchangeNo',
                title: '礼品兑换单号'
            }, {
                type: 'text',
                model: 'sku',
                title: '礼品编码'
            }, {
                type: 'text',
                model: 'goodsName',
                title: '礼品名称'
            }, {
                type: 'text',
                model: 'exchangeName',
                title: '兑换人'
            },{
                type: 'text',
                model: 'garageName',
                title: '汽修厂名称'
            },{
                type: 'text',
                model: 'garageNo',
                title: '汽修厂编码'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = giftOrders.getThead();
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
        var pmsSearch = giftOrders.getSearch();
        pmsSearch.then(function (data) {
            if(data.code==-1){
                alert(data.message);
                return;
            }
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
        $scope.exParams = '';
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = giftOrders.getDataTable(
                '/giftOrder /searchData',
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

    }])
});