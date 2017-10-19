/**
 * Created by xiaojiu on 2016/11/8.
 */
define(['../../../app','../../../services/storage/breakage-TheOverflow/newBreakageTheOverflowService'], function (app) {
     var app = angular.module('app');
    app.controller('newBreakageTheOverflowCtrl', ['$rootScope', '$scope','$timeout', '$state', '$sce', '$filter', 'HOST', '$window','newBreakageTheOverflow', function ($rootScope, $scope,$timeout, $state, $sce, $filter, HOST, $window,newBreakageTheOverflow) {
        //table头
        $scope.thHeader = newBreakageTheOverflow.getThead();
        $scope.newHeader = newBreakageTheOverflow.getThead1();

        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        //添加分页对象
        $scope.addPaging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };

        //查询
        $scope.searchClick = function () {
            //重新设置分页从第一页开始
            $scope.addPaging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            get();
        }


       $scope.searchModel={
           goodsName:'',
           modelName:'',
           goodsBrandName:'',
           factoryCode:'',
           sku:'',
       }
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;

            var promise = newBreakageTheOverflow.getDataTable(
                '/lossAndOverflowReport/queryGoodsList',//请求表格的数据接口
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
                //设置表格指令数据
                $scope.result = data.grid;
                //$scope.logModalResult = data.grid;
                //设置分页
                $scope.addPaging = {
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
        $scope.addGoToPage = function () {
            get();
        }


        // 添加商品
        $scope.addGift = function () {
            $('#createGift').modal('show');
            get();
        }
        var results=[];
        $scope.enterAdd = function () {
            angular.forEach($scope.result, function (item) {
                if (item.pl4GridCheckbox.checked) {
                    results.push(item);
                }
            });
           $scope.result2=results;
            $('#createGift').modal('hide');
        }
        //确认添加
        $scope.confirmImpor=function(){
            $scope.gridResult=[];
            angular.forEach($scope.result, function (item) {
                if (item.pl4GridCheckbox.checked) {
                    $scope.gridResult.push(item);

                }
            });
            if($scope.gridResult.length==0){
                    alert('请选择要导入的数据');
                return ;
            }
            var opts = {
                grid:  $scope.gridResult
            }
            newBreakageTheOverflow.getDataTable('/lossAndOverflowReport/confirmCkLossAndOverflowReport', {param: opts})
                .then(function (data) {
                    if(data.code==-1){
                        alert(data.message);
                    }else if(data.status.code=="0000") {
                        alert(data.status.msg, function () {
                            $state.go('main.breakageTheOverflow');
                        });
                    }else
                        alert(data.status.msg);
                });
        }


        //删除
        $scope.deleteCustom= function (i,item) {
            $scope.result2.splice(i,1);

        }
        //返回
        $scope.backHref = function(){
            $state.go('main.breakageTheOverflow')
        }
    }])
});
