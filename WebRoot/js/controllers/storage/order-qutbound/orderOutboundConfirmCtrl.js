/**
 * Created by hui.sun on 15/12/13.
 */
'use strict';
define(['../../../app', '../../../services/storage/order-qutbound/orderOutboundConfirmService'], function(app) {
     var app = angular.module('app');
    app.controller('orderOutboundConfirmCtrl', ['$scope', '$state', '$stateParams','$window', '$sce', 'orderOutboundConfirm', function($scope, $state, $stateParams,$window, $sce, orderOutboundConfirm) {
        // 头部标签跳转
        $scope.orderPackHref = function(){
            $state.go('orderPack')
        }
        // 商品条码查询
        //$scope.searchBarcode = function(barCode){
        //    alert(barCode)
        //}
        $scope.querySeting = {
            items: [
                { type: 'text', model: 'sku', title: '条码' },
            ],
            btns: [
                { text: $sce.trustAsHtml('查询'), click: 'searchClick' }]
        };
        $scope.banner={};
        //table头
        $scope.thHeader = orderOutboundConfirm.getThead();
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

        //查询
        $scope.searchClick = function () {
            get($stateParams['taskId']);
            $scope.searchModel.sku='';
        }
        var pmsSearch = orderOutboundConfirm.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query;//设置当前作用域的查询对象
            get($stateParams['taskId']);
        }, function (error) {
            console.log(error)
        });

        //查询
//        $scope.confirmBtn = function(commodityCode) {
//            get(commodityCode);
//        };
        //任务类型 下拉框change
        $scope.orderTypeIdChange = function() {
            //  console.log($scope.searchModel.orderTypeIdSelect)
        };
//        $scope.result=[];
        function get(taskId) {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.taskId = $stateParams['taskId'];
            var promise = orderOutboundConfirm.getDataTable({
                param:{
                  "query": opts
                }
            },'/orderOutbound/queryConfirmOutbound');
            promise.then(function(data) {
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
              
               $scope.banner=data.banner;
               $scope.result = [];
                var isfindItem=false;
                angular.forEach($scope.result, function (item,i) {
                    if(item.taskId==data.grid[0].taskId){
                        $scope.result.splice(i,1,data.grid[0]);
                        isfindItem=true;
                    }
                });
                if(!isfindItem&&data.grid&&data.grid.length==1)
                    $scope.result.push(data.grid[0]);
                else if(data.grid&&data.grid.length>1){
                	$scope.result = data.grid;
                }
                $scope.paging.totalPage = data.total;
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function(error) {
                console.log(error);
            });
            $scope.tackGoods = function(obj) {
                $location.path('/checkstorage');
            }
        };
        // 获取确认出库结果
        $scope.confirmOutbound = function(){


                var promise = orderOutboundConfirm.getConfirmOutbound({
                    param:{
                      "query":{
                            "taskId": $scope.banner.taskId
                        }
                    }
                })
                promise.then(function(data){
                    alert(data.status.msg);
                    if(data.status.code=="0000"){
                        $('#confirmOutbound').modal('hide');
                        $state.go('main.orderOutbound');
                        //get();
                    }
                })

            }
        //定义表单模型
        $scope.goodsDifferenceModel={
            packageDamage:'',
            damage:'',
            lost:'',
            id:''
        }
        //编辑差异
        $scope.editDate=function(i,item){
            if(item.couponType==1){
                alert("有优惠的商品不允许进行编辑差异的操作！");
                return
            }else {
                $("#editDate").modal("show");
                $scope.goodsDifferenceModel.id = item.id;
                var opts = {};
                opts.id = item.id;
                var sendParams = {
                    param: {
                        query: opts
                    }
                }
                orderOutboundConfirm.getDataTable(sendParams, '/orderOutbound/getOutGoodsDiffCountDetail ')
                    .then(function (data) {
                        if (data.status.code == "0000") {
                            $scope.goodsDifferenceModel.packageDamage = data.banner.packageDamage;
                            $scope.goodsDifferenceModel.damage = data.banner.damage;
                            $scope.goodsDifferenceModel.lost = data.banner.lost;
                        }
                    })
            }
        }
        //确认编辑
        $scope.enterAdd=function(){
            var opts = angular.extend({},  $scope.goodsDifferenceModel, {});//克隆出新的对象，防止影响scope中的对象
            var sendParams = {
                param: {
                    query:opts
                }
            }
            orderOutboundConfirm.getDataTable(sendParams, '/orderOutbound/editOutGoodsCount')
                .then(function (data) {
                    alert(data.status.msg)
                    if (data.status.code == "0000") {
                        $('#editDate').modal('hide');
                        get($stateParams['taskId']);
                    }
                })
        }
        // 删除当前行
        $scope.deleteConfirmOutbound = function(index, item){
            $scope.result.splice(index, 1);
        }
        //返回
        $scope.back= function () {
            $window.history.back();
        }
    }])
});