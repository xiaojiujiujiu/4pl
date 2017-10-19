/**
 * Created by xiaojiu on 2016/11/7.
 */
define(['../../../app','../../../services/storage/inventory-manage/inventoryDetailsService'], function (app) {
     var app = angular.module('app');
    app.controller('inventoryDetailsCtrl', ['$rootScope','$scope', '$sce', '$timeout', 'inventoryDetails','$window','$stateParams', function ($rootScope,$scope, $sce, $timeout, inventoryDetails,$window,$stateParams) {

        //theadr
        $scope.thHeader = inventoryDetails.getThead();

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
            opts.taskId = $stateParams['taskId'];
            $scope.exGoodsAlloParam={query:opts};
            var promise = inventoryDetails.getDataTable({param: {query:opts}});
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
               // var differents=[];
               // var negative="-";
               // angular.forEach($scope.result,function(item){
               //     differents+=item.differentCount+',';
               // });
               // console.log(differents);
               //for(var i=0;i<differents.length;i++){
               //    if(differents[i] == negative){
               //        $scope.isActive=true;
               //    }
               //}
                $scope.banner = data.banner;
                if(!!data.banner.refuseRemark){
                    $scope.ifShow=true;
                }else {
                    $scope.ifShow=false;
                }
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

        //查看明细
        //$scope.checkDetail= function (i,item) {
        //    inventoryDetails.getDataTable({param: {query: {
        //            customerId:item.customerId,
        //            suppliers:item.supliers,
        //            sku:item.sku
        //        }}},'/ckGoodsLocation/queryDetailList')
        //        .then(function (data) {
        //            if(data.status.code=="0000") {
        //                $scope.alloResult = data.grid;
        //                $('#alloModal').modal();
        //            }else {
        //                alert(data.status.msg);
        //            }
        //        },function (error) {
        //            console.log(error);
        //        });
        //}
        $scope.goToPage= function () {
            get();
        }
        //打印
        $scope.print= function (i,item) {
            $window.open("../print/gridInventorySheet.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+$stateParams['taskId']);
            //$window.open("../print/inventorySheet.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+'&taskId='+item.taskId);

        }
        get();
        //返回
        $scope.update= function () {
            $window.history.back();
        }
    }]);
});