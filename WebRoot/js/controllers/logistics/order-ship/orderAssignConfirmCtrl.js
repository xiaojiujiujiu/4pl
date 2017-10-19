/**
 * Created by xiaojiu on 2017/3/16.
 */

'use strict';
define(['../../../app', '../../../services/logistics/order-ship/orderAssignConfirmService'], function (app) {
    var app = angular.module('app');
    app.controller('orderAssignConfirmCtrl', ['$rootScope','$scope', '$state', '$sce','$window', 'orderAssignConfirm', function ($rootScope,$scope, $state, $sce,$window, orderAssignConfirm) {
        $scope.taskId = '';
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
        $scope.pageModel = {
            distributionSelect: {
                select1: {
                    data: [{id:-1,name:'全部'}],
                    id: -1,
                    change: function () {}
                }
            }
        };

        //table头
        $scope.thHeader = orderAssignConfirm.getThead();

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
        var pmsSearch = orderAssignConfirm.getSearch();
        pmsSearch.then(function(data) {

            $scope.searchModel = data.query; //设置当前作用域的查询对象
           // $scope.pageModel.distributionSelect.select1.data = data.query.opUser;
            $scope.orderLogModal=data.query;
            $scope.orderLogModal.distributionWay.id="4";
            $scope.orderLogModal.opUser.id=-1;
            $scope.orderLogModal.opLicenseNumber.id=-1;
            $scope.orderLogModal.thirdpartyWl='';
            $scope.orderLogModal.thirdpartyTaskId='';
            $scope.orderLogModal.thirdpartyPay='';

        }, function(error) {
            console.log(error)
        });
        //查询
        $scope.searchClick = function () {
            //var reg = new RegExp("^[0-9+\-\a-zA-Z]*$");
            //if(!reg.test($scope.taskId)){
            //    alert("请输入正确的业务单号！")
            //    return false;
            //}
            get();
            $scope.searchModel.taskId="";

        }
        $scope.result=[];
        $scope.list =[];
        function get() {
            //获取选中 设置对象参数
            var opts ={};
            opts.boxNo=$scope.searchModel.taskId;
            var promise = orderAssignConfirm.getDataTable({
                param: {query:opts}
            });
            promise.then(function(data) {
                var isResult=false;
                $scope.banner=data.banner;
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
            }, function(error) {
                console.log(error);
            });
        }
        //编辑输入框显示隐藏
        $scope.isShow=false;
        $scope.toggleInput=function(){
            if($scope.orderLogModal.distributionWay.id==="4"){
                $scope.isShow=!$scope.isShow;
            }else if($scope.orderLogModal.distributionWay.id==="1"){
                $scope.isShow=!$scope.isShow;
            }
        }
        $scope.cancel=function(){
            $scope.orderLogModal.distributionWay.id="4";
            $scope.isShow=false;
        }
        //订单分派
        $scope.confirmInCk= function () {
            if($scope.result.length>0){
                angular.forEach($scope.result, function (item) {
                    if(item.acceGoodCount===item.realcount){
                        $("#confirmModal").modal("show");
                    }else {
                        alert("【业务单号】实出件数与应出件数不符，是否确认分派？",function(){
                            $("#confirmModal").modal("show");
                        })
                    }

                });
            }else {
                alert("没有数据！");
            }
        }
        //确认分派
        $scope.enterAddCarrier=function(){
            if($scope.orderLogModal.distributionWay.id==="1"){
                if($scope.orderLogModal.thirdpartyWl==''){
                    alert("请输入第三方物流！");
                    return false;
                }else if($scope.orderLogModal.thirdpartyTaskId==''){
                    alert("请输入第三方单号! ");
                    return false;
                }else if($scope.orderLogModal.thirdpartyPay==''){
                    alert("请输入第三方运费! ");
                    return false;
                }
            }else if($scope.orderLogModal.distributionWay.id==="4"){
                if( $scope.orderLogModal.opUser.id===-1){
                    alert("请选择配送员！");
                    return false;
                }else if( $scope.orderLogModal.opLicenseNumber.id===-1){
                    alert("请选择车牌号！");
                    return false;
                }
            }
            var opts=$scope.list;
            var promise = orderAssignConfirm.deliverOrderConfrim('/personalOrder/OrderconfirmAssign', {
                    param: {
                        query: {
                            list:opts,
                            wlDeptId: $scope.pageModel.distributionSelect.select1.id,
                            distributionWay:$scope.orderLogModal.distributionWay.id,
                            opUser:$scope.orderLogModal.opUser.id,
                            opLicenseNumber:$scope.orderLogModal.opLicenseNumber.id,
                            thirdpartyWl:$scope.orderLogModal.thirdpartyWl,
                            thirdpartyTaskId:$scope.orderLogModal.thirdpartyTaskId,
                            thirdpartyPay:$scope.orderLogModal.thirdpartyPay,
                            receiver:$scope.orderLogModal.receiver,
                            logisticsMode:1
                        }
                    }
                }
            );
            promise.then(function(data){
                if(data.status.code==="0000"){
                    alert('分派成功！分派单号为：'+data.banner.assignTaskId+'是否确认打印？',function(){
                        $window.open('../print/orderAssignConfirmPrint.html?tokenId=' + $rootScope.userInfo.token + '&sessionid=' + $rootScope.userInfo.sessionId + '&assignTaskId=' + data.banner.assignTaskId);
                    });
                    $("#confirmModal").modal("hide");
                    $scope.result=[];
                }
            })
        }


        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
        //返回
        $scope.back= function () {
            $window.history.back();
        }
        //删除行
        $scope.deleteCall = function (index,item) {
            orderAssignConfirm.deliverOrderConfrim('/personalOrder/deletePrintByTaskId',{
                param: {
                    query: {
                        taskId:item.taskId
                    }
                }
            }).then(function(data){
                if(data.status.code=="0000"){
                    alert(data.status.msg);
                    $scope.result.splice(index,1);
                }
            })
        }
    }])
});