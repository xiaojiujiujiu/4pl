/**
 * author wusheng.xu
 * date 16/4/19
 */
define(['../../../app','../../../services/storage/inventory-manage/inventoryTaskService'], function (app) {
     var app = angular.module('app');
    app.controller('inventoryTaskCtrl', ['$rootScope','$scope', '$sce', '$timeout','$window', 'inventoryTask','$stateParams', function ($rootScope,$scope, $sce, $timeout,$window, inventoryTask,$stateParams) {


        // query moudle setting
        $scope.querySeting = {
            items: [ {
                type: 'text',
                model: 'taskId',
                title: '盘点单号'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '盘点日期'
            },{
                type: 'select',
                model: 'typeList',
                selectedModel: 'inventoryTypeSelect',
                title: '盘点方式'
            },{
                type: 'select',
                model: 'statusList',
                selectedModel: 'inventoryStatusSelect',
                title: '盘点状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //theadr
        $scope.thHeader = inventoryTask.getThead();

        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        var pmsQuery = inventoryTask.getQuery();
        pmsQuery.then(function (data) {
            $scope.searchModel = data.query;//设置当前作用域的查询对象
            //下拉框model
            $scope.searchModel.inventoryTypeSelect = "0";
            $scope.searchModel.personListSelect = data.query.personListSelect;
            $scope.searchModel.inventoryStatusSelect = -1;
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
        $scope.exGoodsAlloParam={};
        function get(){
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
           // opts.taskId = $stateParams['taskId'];
            opts.inventoryType = $scope.searchModel.inventoryTypeSelect;
            opts.inventoryStatus = $scope.searchModel.inventoryStatusSelect;
            opts.personListSelect = $scope.searchModel.personListSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exGoodsAlloParam={query:opts};
            var promise = inventoryTask.getDataTable({param: {query:opts}});
            promise.then(function (data) {
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
        }
        //打印
        $scope.print= function (i,item) {
            $window.open('../print/gridInventorySheet.html?tokenId='+$rootScope.userInfo.token+'&sessionid='+$rootScope.userInfo.sessionId+'&taskId='+item.taskId);

        }
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
    }]);
});