/**
 * Created by xiaojiu on 2017/8/10.
 */
'use strict';
define(['../../../app','../../../services/logistics/deliverPutStorageDispatchManage/orderReceivingBatckService'], function (app) {
    var app = angular.module('app');
    app.controller('orderReceivingBatckCtrl',['$scope','$state','$stateParams','$sce','$window','orderReceivingBatck','$interval',function ($scope,$state,$stateParams,$sce,$window,orderReceivingBatck,$interval) {
        $scope.querySeting = {
            items: [
                { type: 'text', model: 'taskId', title: '条码' ,autofocus:true},
            ],
            btns: [
                { text: $sce.trustAsHtml('查询'), click: 'searchClick' }]
        };
        //table头
        $scope.thHeader = orderReceivingBatck.getThead();
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
        var pmsSearch = orderReceivingBatck.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
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
            $scope.searchModel.taskId='';
        }
        $scope.result=[];
        var output = [], keys = [];
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = orderReceivingBatck.getDataTable(
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {

                angular.forEach(data.grid, function (item) {
                        var key = item['taskId'];
                        if (keys.indexOf(key) === -1) {
                            keys.push(key);
                            output.push(item);
                        }
                    });
                    $scope.result=output;
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };;
            }, function (error) {
                console.log(error);
            });
        }
        //$scope.skuKeyUp= function () {
        //    var reg=/[\u4E00-\u9FA5\uF900-\uFA2D]/g;
        //    $scope.pageModel.SKU=$scope.pageModel.SKU.replace(reg,'');
        //}
        //get();

        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }

        //定义表单模型
        $scope.goodsDifferenceModel={
            packageDamage:'',
            damage:'',
            lost:'',
            id:'',
            i:'',
            item:'',
        }


        //收货完成
        $scope.takeGoodsDown= function () {
            var ids='';
            //获取选中
            angular.forEach($scope.result, function (item) {
                    ids+=item.id+',';
            });
            if(ids!='') {
                ids = ids.slice(0, ids.length - 1);
                var promise = orderReceivingBatck.getDataTable({param: {query:{ids:ids}}}, '/vehicleParts/confirmReceiveGoods');
                promise.then(function (data) {
                    alert(data.status.msg);
                    if(data.status.code=="0000"){
                        get();
                        $window.history.back();
                       
                    }

                }, function (error) {
                    console.log(error);
                });
            }else {
                alert('没有需要收货的业务单!');
            }





            // }
        }
        //返回
        $scope.back= function () {
            $window.history.back();
        }

        $scope.clearNoNum= function (index, obj) {
            var inCount= obj.inCount;
            obj.inCount=inCount.replace(/\D/g,'');
        }

    }]);
});