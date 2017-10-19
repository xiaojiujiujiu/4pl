/**
 * Created by xiaojiu on 2017/3/13.
 */
/**
 * Created by hui.sun on 15/12/13.
 */
'use strict';
define(['../../../app', '../../../services/logistics/deliverPutStorageDispatchManage/refuseInCkConfirmService'], function(app) {
    var app = angular.module('app');
    app.controller('refuseInCkConfirmCtrl', ['$scope', '$state', '$sce', 'refuseInCkConfirm','$window', function($scope, $state, $sce, refuseInCkConfirm,$window) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '条码',
                maxlength:25,
            }],
            btns: [{
                text: $sce.trustAsHtml('确定'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = refuseInCkConfirm.getThead();
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
        var pmsSearch = refuseInCkConfirm.getSearch();

        pmsSearch.then(function(data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
        }, function(error) {
            console.log(error)
        });

        //查询
        $scope.searchClick = function() {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows,
            };
            get();
        }
        $scope.result=[];
        $scope.list =[];
        function get() {
            //获取选中 设置对象参数
            //var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            var opts ={};
            opts.boxNo=$scope.searchModel.taskId;
            var promise = refuseInCkConfirm.getDataTable({
                param: {query:opts}
            });
            promise.then(function(data) {

                var isResult=false;
                angular.forEach($scope.result, function (item,i) {
                    if(item.taskId==data.grid[0].taskId){
                        $scope.result[i]=data.grid[0];
                        isResult=true;
                        return false;
                    }
                });
                if(!isResult){
                    $scope.result.push(data.grid[0]);
                    $scope.list = $scope.result;
                }
                /*$scope.paging = {
                 totalPage: data.total,
                 currentPage: $scope.paging.currentPage,
                 showRows: $scope.paging.showRows,
                 };*/
            }, function (error) {
                console.log(error);
            });
        }
        //订单入库
        $scope.confirmInCk= function () {
            angular.forEach($scope.result, function (item,i){
                if($scope.result.length>0){
                    $("#equalModal").modal("show");
                    if(item.acceGoodCount===item.realcount){
                        $scope.confirmTitle="是否对订单进行退货入库操作？";
                    }else {
                        $scope.confirmTitle="【业务单号】实收件数与应收件数不符，是否确认退货入库？";
                    }
                }else {
                    alert("没有数据！");
                }
            });
        }
        //确认入库
        $scope.enterAddCarrier=function(){
            var opts=$scope.list
            var promise = refuseInCkConfirm.deliverOrderConfrim('/personalOrder/confirmRefuseInGoods',{
                param: {query:{
                    list:opts
                }}
            });
            promise.then(function(data){
                alert(data.status.msg);
                $("#equalModal").modal("hide");
                //get();
                $scope.result=[];
            })
        }
        //删除行
        $scope.deleteCall = function (index,item) {
            if(confirm('确定删除吗?')){
                $scope.result.splice(index,1);
            }
        }
        //返回
        $scope.back= function () {
            $window.history.back();
        }
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
    }])
});