/**
 * Created by xiaojiu on 2017/8/10.
 */
'use strict';
define(['../../../app','../../../services/logistics/deliverPutStorageDispatchManage/orderDeliverBatchService'], function (app) {
    var app = angular.module('app');
    app.controller('orderDeliverBatchCtrl',['$rootScope','$scope','$state','$sce','$stateParams','orderDeliverBatch', '$window', function ($rootScope,$scope,$state,$sce,$stateParams,orderDeliverBatch,$window) {
        $scope.querySeting = {
            items: [
                { type: 'text', model: 'taskId', title: '条码' ,autofocus:true},
            ],
            btns: [
                { text: $sce.trustAsHtml('查询'), click: 'searchClick' }]
        };
        //table头
        $scope.thHeader = orderDeliverBatch.getThead();
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
        var pmsSearch = orderDeliverBatch.getSearch();
        pmsSearch.then(function (data) {
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
            $scope.searchModel.taskId='';
        }
        $scope.result=[];
        var output = [], keys = [];
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = orderDeliverBatch.getDataTable(
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
               // $scope.result = data.grid;
                $scope.newIndentModel.wlDeptNameSelect=data.query.wlDeptName;
                $scope.newIndentModel.deliveryWaySelect=data.query.deliveryWay;
                $scope.carrierNameList=data.query.carrierName;
                $scope.newIndentModel.wlDeptName=data.query.state;
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };;
            }, function (error) {
                console.log(error);
            });
        }
        //get();

        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }

        //发货model
        $scope.newIndentModel={
            carrierName:'',
            wlDeptName:'',
            wlDeptNameSelect:'',
            deliveryWay:1,
            deliveryWaySelect:'',
            mobilePhone:'',
            carrierMan:'',
            thirdWlId:'',
            pay:''
        }
        $scope.operationTitle="发货信息";
        var ids='';
        $scope.sendGoods=function(){
            //获取选中
            angular.forEach($scope.result, function (item) {
                    ids+=item.id+',';
            });
            if(ids!='') {
                ids = ids.slice(0, ids.length - 1);
                $("#sendGoods").modal("show");
            }else {
                alert('没有需要发货的业务单!');
            }


        }
        //输入框显示隐藏
        $scope.isisWlDeptShow=function(){
            $scope.newIndentModel.deliveryWay===1?$scope.isWlDeptShow=false:$scope.isWlDeptShow=true;
        }
        //模拟下拉自动补全
        $scope.isShow =false;
        $scope.showListFun =function(){
            $scope.isShow =!$scope.isShow;
        }
        $scope.listSelect = function(item){
            $scope.isShow =!$scope.isShow;
            $scope.newIndentModel.carrierName=item.name;
            orderDeliverBatch.confirmInCk({
                    param: {
                        query:{
                            carrierName:item.name
                        }
                    }
                },'/vehicleParts/getCompInformation')
                .then(function(data){
                    if (data.status.code == "0000") {
                        $scope.newIndentModel.carrierMan = data.query.carrierMan;
                        $scope.newIndentModel.mobilePhone = data.query.mobilePhone;
                    }
                })
        }
        //确认发货
        $scope.operationEnterAdd=function(){
            var opts = angular.extend({}, $scope.newIndentModel, {});
            delete opts.wlDeptNameSelect;
            delete opts.deliveryWaySelect;
            opts.ids = ids;
            orderDeliverBatch.confirmInCk({
                    param: {
                        query: opts
                    }
                },$scope.newIndentModel.deliveryWay===1 ? '/vehicleParts/confirmDelivery' : '/vehicleParts/confirmTransit')

                .then(function (data) {
                    if (data.status.code == "0000") {
                        alert(data.status.msg);
                        $('#sendGoods').modal('hide');
                        get();
                    } else{
                        alert(data.status.msg);
                        $('#sendGoods').modal('hide');

                    }
                    $window.history.back();
                   
                })

        }
        //取消
        $scope.deleteData=function(){
            $scope.newIndentModel.carrierName='';
            $scope.newIndentModel.mobilePhone='';
            $scope.newIndentModel.carrierMan='';
            $scope.newIndentModel.thirdWlId='';
        }
        // 返回
        $scope.goBack = function(){
            $window.history.back();
        }
    }]);
});