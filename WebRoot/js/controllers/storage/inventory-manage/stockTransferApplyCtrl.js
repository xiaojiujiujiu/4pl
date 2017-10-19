/**
 * Created by xiaojiu on 2017/3/27.
 */
define(['../../../app','../../../services/storage/inventory-manage/stockTransferApplyService'], function (app) {
    var app = angular.module('app');
    app.controller('stockTransferApplyCtrl', ['$rootScope','$scope', '$sce', '$timeout','$window', 'stockTransferApply','$stateParams', function ($rootScope,$scope, $sce, $timeout,$window, stockTransferApply,$stateParams) {


        // query moudle setting
        $scope.querySeting = {
            items: [ {
                type: 'text',
                model: 'goodsStyle',
                title: '规格型号'
            },{
                type: 'text',
                model: 'serialNumber',
                title: '出厂编码'
            },{
                type: 'text',
                model: 'goodsCode',
                title: '商品编码'
            },{
                type: 'text',
                model: 'supplier',
                title: '供应商'
            },{
                type: 'text',
                model: 'product',
                title: '品类'
            },{
                type: 'text',
                model: 'brand',
                title: '品牌'
            },{
                type: 'text',
                model: 'name',
                title: '商品名称'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //theadr
        $scope.thHeader = stockTransferApply.getThead();

        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        var pmsQuery = stockTransferApply.getQuery();
        pmsQuery.then(function (data) {
            $scope.searchModel = data.query;//设置当前作用域的查询对象
            //下拉框model
            $scope.searchModel.transferTypeSelect = -1;
            $scope.searchModel.orderStatusSelect = -1;
            //获取table数据
           // get();
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
        function get(){
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            // opts.taskId = $stateParams['taskId'];
            opts.transferType = $scope.searchModel.transferTypeSelect;
            opts.orderStatus = $scope.searchModel.orderStatusSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = stockTransferApply.getDataTable({param: {query:opts}});
            promise.then(function (data) {
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
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
        //确认申请
        $scope.updateStation=function(i,item){
            $rootScope.transferCount=item.transferCount;
            $rootScope.transferType=item.transferType;
            $rootScope.sku=item.goodsCode;
            $rootScope.damageStock=item.damageStock;
            $rootScope.availableStock=item.availableStock;
        }
        //这个还需要修改
        $scope.clearNoNum2= function (index, obj) {
        	var transferCount= obj.transferCount;
        	obj.transferCount=transferCount.replace(/\D/g,'');
        }
        $scope.confirmApplication=function(){
            console.log($rootScope.transferCount);
            console.log($rootScope.availableStock);
            if($rootScope.transferCount<0 || $rootScope.transferCount==''){
                alert("转移数量不能为空或小于0");
                $("#confirmApplication").modal("hide");
                return false;
            }
 //           var reg = new RegExp("^[0-9]+(.[0-9]+)?");
            var reg = new RegExp("^[0-9]{1,4}$");
            if(!reg.test($rootScope.transferCount)){
            	alert("转移数量必须为1-9999的数字！");
            	$("#confirmApplication").modal("hide");
            	return false;
            }
            if($rootScope.transferType==1){
            	if($rootScope.transferCount > $rootScope.availableStock){
                    alert("转移数量不能大于可用库存！");
                    $("#confirmApplication").modal("hide");
                    return false;
                }
            }else if($rootScope.transferType==2){
            	if($rootScope.transferCount > $rootScope.damageStock){
            		alert("转移数量不能大于残损品库存！");
            		$("#confirmApplication").modal("hide");
            		return false;
            	}
            }
            
            var opts={};
            opts.sku=$rootScope.sku;
            opts.transferType=$rootScope.transferType;
            opts.transferCount=$rootScope.transferCount;
                stockTransferApply.getDataTable({
                        param: {
                            "query":opts
                        }
                    },'/stockTransfer/checkTransferApply')
                    .then(function (data) {
                        alert(data.status.msg)
                        if(data.status.code=="0000") {
                            $("#confirmApplication").modal("hide");
                            get();
                        }
                    }, function (error) {
                        console.log(error)
                    });
        }
        //返回
        $scope.update= function () {
            $window.history.back();
        }

    }]);
});