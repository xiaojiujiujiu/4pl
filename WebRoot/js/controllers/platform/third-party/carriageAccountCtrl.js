/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app', '../../../services/platform/third-party/carriageAccountService'], function (app) {
     var app = angular.module('app');
    app.controller('carriageAccountCtrl', ['$scope', '$sce', 'carriageAccount', function ($scope, $sce, carriageAccount) {

        //theadr
        $scope.thHeader = carriageAccount.getThead();
        //查询
        $scope.searchClick = function () {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows,
            };
            get()
        }
        $scope.searchStorageName = '';
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.carrierName = $scope.searchStorageName;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = carriageAccount.getDataTable({
                "param": {
                    "query": opts
                }
            });
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
            $scope.tackGoods = function (obj) {
                $location.path('/checkstorage');
            }
        }

        $scope.goToPage = function () {
            get();
        }
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

        get();
    }]);
});