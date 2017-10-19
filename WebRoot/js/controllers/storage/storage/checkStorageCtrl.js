/**
 * Created by xuwusheng on 15/11/23.
 */
'use strict';
define(['../../../app','../../../services/storage/storage/checkStorageService'], function (app) {
    var app = angular.module('app');
    app.controller('CheckStorageCtrl',['$scope','$state','$stateParams','$sce','$window','checkStorage',function ($scope,$state,$stateParams,$sce,$window,checkStorage) {
        $scope.querySeting = {
            items: [
                { type: 'text', model: 'sku', title: '条码' },
            ],
            btns: [
                { text: $sce.trustAsHtml('查询'), click: 'searchClick' }]
        };
        $scope.banner={};
        //table头
        $scope.thHeader = checkStorage.getThead();


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
        var pmsSearch = checkStorage.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query;//设置当前作用域的查询对象
            get();
        }, function (error) {
            console.log(error)
        });

        //查询
        $scope.searchClick = function () {
            //设置默认第一页
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows,
            };
            get();
            $scope.searchModel.sku='';
        }
        function get() {
            //获取选中 设置对象参数
           var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.taskId = $stateParams['taskId'];
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
           //  var opts ={
           //     taskId:$stateParams['taskId'],
           //     sku:$scope.querySeting.sku,
           //     page: $scope.paging.currentPage,
           //     pageSize:$scope.paging.showRows
           // }
            var promise = checkStorage.getDataTable({param: {query: opts}});
            promise.then(function (data) {
                if(data.status.code==="0000"){
                    $scope.result = data.grid;
                    $scope.banner=data.banner;
                    $scope.banner.taskId=$stateParams['taskId'];
                    //重置paging 解决分页指令不能监听对象问题
                    $scope.paging = {
                        totalPage: data.total,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };
                }



            }, function (error) {
                console.log(error);
            });

        }
        $scope.skuKeyUp= function () {
            var reg=/[\u4E00-\u9FA5\uF900-\uFA2D]/g;
            $scope.pageModel.SKU=$scope.pageModel.SKU.replace(reg,'');
        }
        //get();

        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
        //导航
        $scope.navClick= function (i) {
            switch (i){
                case 0:
                    $state.go('main.takegoods');
                    break;
                case 1:
                    $state.go('main.checkstorage',{taskId:$stateParams['taskId']});
                    break;
                case 2:
                    $state.go('main.takegoodsconfirm',{taskId:$stateParams['taskId']});
                    break;
            }
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
            $scope.goodsDifferenceModel.id=item.id;
            var opts={};
                 opts.id=item.id;
            var sendParams = {
                param: {
                    query:opts
                }
            }
            checkStorage.getDataTable(sendParams, '/ckTaskIn/getInGoodsDiffCountDetail')
                .then(function (data) {

                        $scope.goodsDifferenceModel.packageDamage = data.banner.packageDamage;
                        $scope.goodsDifferenceModel.damage = data.banner.damage;
                        $scope.goodsDifferenceModel.lost = data.banner.lost;

                })
        }
        //确认编辑
        $scope.enterAdd=function(){

            var opts = angular.extend({},  $scope.goodsDifferenceModel, {});//克隆出新的对象，防止影响scope中的对象

            var sendParams = {
                param: {
                    query:opts
                }
            }
            checkStorage.getDataTable(sendParams, '/ckTaskIn/editInGoodsCount')
                .then(function (data) {
                    alert(data.status.msg)
                    if (data.status.code == "0000") {
                        $scope.goodsDifferenceModel={
                            packageDamage:'',
                            damage:'',
                            lost:'',
                        }
                        $('#editDate').modal('hide');
                        get();
                    }
                })
        }
        //收货按钮
        $scope.goodsAlloCall= function (index,item) {
            alert(item)
        }
        $scope.parseInt = parseInt;
        //收货完成
        $scope.takeGoodsDown= function () {
        	
            if(confirm('确定收货？')) {
                var takeGoodsDowns = [];
                var flag=true;
                angular.forEach($scope.result, function (item,i) {
                    if (parseInt(item.inCount) + parseInt(item.inDiffCount) != parseInt(item.count)) {
                        alert('收货数量错误，无法进行收货操作！')
                        flag=false;
                        return;
                    }
                        takeGoodsDowns.push(item);
                });
                if(!flag){
                    return;
                }
                var opts = {
                    banner: {taskId: $scope.banner.taskId},
                    grid: takeGoodsDowns
                }
                var promise = checkStorage.getDataTable({param: opts}, '/ckTaskIn/ckTaskInDetailSuccess');
                promise.then(function (data) {
                    alert(data.status.msg);
                    if(data.status.code=="0000"){
                       // get();
                        $state.go('main.takegoods')
                        //$scope.pageModel.SKU="";
                    }

                }, function (error) {
                    console.log(error);
                });
            }
        }
        //返回
        $scope.back= function () {
            $window.history.back();
        }

    }]);
});