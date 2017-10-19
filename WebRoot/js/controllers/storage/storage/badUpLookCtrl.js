/**
 * Created by xiaojiu on 2017/2/6.
 */
define(['../../../app', '../../../services/storage/storage/badUpLookService'], function (app) {
    var app = angular.module('app');
    app.controller('badUpLookCtrl', ['$scope', '$state', '$stateParams', '$sce', 'badUpLook','$window', function ($scope, $state, $stateParams, $sce, badUpLook,$window) {
        $scope.banner = {};
        $scope.sku = '';
        //table头
        $scope.thHeader = badUpLook.getThead();
        $scope.allTHeader = badUpLook.getAllTHeader();

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
        //查询
        $scope.searchClick = function () {
            //设置默认第一页
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows,
            };
            get();
        }

        get();


        function get() {
            //获取选中 设置对象参数
            var opts = {
                taskId: $stateParams['taskId'],
                outFlag: $stateParams['outFlag'],
                sku: $scope.sku
            }
            var promise = badUpLook.getDataTable({param: {query: opts}});
            promise.then(function (data) {
                if(data.code==-1){
                    alert(data.message);
                    $scope.result = [];
                    $scope.paging = {
                        totalPage: 1,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };
                    return false;
                }
                $scope.banner = data.banner;
                $scope.banner.taskId = opts.taskId;
                $scope.result = data.grid;
            }, function (error) {
                console.log(error);
            });
        }

        //查看货位
        $scope.alloModalCall= function (i,item) {
            badUpLook.getDataTable({param: {query: {
                    sku:item.sku,
                    taskId:item.taskId,
                    ckId:item.ckId
                }}},'/badUpshelf/viewHasDonePutGoodsList')
                .then(function (data) {
                    $scope.alloResult=data.grid;
                },function (error) {
                    console.log(error);
                });
        }


        //返回
        $scope.back= function () {
            $window.history.back();
        }
    }])
});