/**
 * Created by xiaojiu on 2017/3/24.
 */
'use strict';
define(['../../../app', '../../../services/storage/storage-permissionManage/registrationFeeService'], function (app) {
    var app = angular.module('app');
    app.controller('registrationFeeCtrl', ['$rootScope', '$scope', '$state', '$sce', '$window', 'registrationFee', function ($rootScope, $scope, $state, $sce, $window, registrationFee) {
        $scope.navShow = true;
        $scope.pageModel = {
            receiptId:'',
            waybill:'',
            taskId:'',
        }
        $scope.examinestatu={
            examinestatuSelect:[],
            id:"-1"
        }

        //table头
        $scope.thHeader = registrationFee.getThead();
        //分页下拉框
        $scope.pagingSelect = [
            { value: 5, text: 5 },
            { value: 10, text: 10, selected: true },
            { value: 20, text: 20 },
            { value: 30, text: 30 },
            { value: 50, text: 50 }
        ];
        //日志分页下拉框
        $scope.pagingSelect = [
            { value: 5, text: 5 },
            { value: 10, text: 10, selected: true },
            { value: 20, text: 20 },
            { value: 30, text: 30 },
            { value: 50, text: 50 }
        ];
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        var pmsSearch = registrationFee.getSearch();
        pmsSearch.then(function (data) {
            $scope.pageModel = data.query;//设置当前作用域的查询对象
            $scope.examinestatu.examinestatuSelect = data.query.examinestatu;
            //获取table数据
            get(inGoodsState);
        }, function (error) {
            console.log(error)
        });

        //查询
        $scope.searchClick = function (inGoodsState) {
            //设置默认第一页
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            get(inGoodsState);
            //            $scope.searchModel.taskId = '';
        }
        //任务类型 下拉框change
        $scope.orderTypeIdChange = function () {
            //console.log($scope.searchModel.orderTypeIdSelect)
        }
        var inGoodsState = 2;
        function get(inGoodsState) {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.pageModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.examinestatu = $scope.examinestatu.id;
            opts.inGoodsState = inGoodsState;
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            if(inGoodsState===2){
                var promise = registrationFee.getDataTable('/operatingexpense/queryCkExpenseList',{ param: { query: opts } });
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
            }else if(inGoodsState===1){
                var promise = registrationFee.getDataTable('/operatingexpense/queryCkDeliverCostsList',{ param: { query: opts } });
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
        }
        $scope.navClick = function (i) {
            $scope.examinestatu.id="-1"
            if (i == 2) {
                $scope.navShow = true;
                $scope.thHeader = registrationFee.getThead();
            } else if (i == 1) {
                $scope.thHeader = registrationFee.getThead2();
                $scope.navShow = false;
            }
            inGoodsState = i;
            get(inGoodsState);

            //$("#dt_0").datepicker.defaults.onRender(new Date())
            var date = new Date();
            $('#dt_0').datepicker('setValue', new Date(date.getFullYear(), date.getMonth(), 1));
        }
        //费用登记model
        $scope.moneyRegisterModel={
            'feeCost':'',
            "money":'',
            "receiptId":'',
            "description":'',
            "description2":'',
            "deliveryName":'',
            "transportFee":'',
            "taskId":'',
            "waybill":'',
        };
        $scope.moneyRegisterTitle="费用登记";
        $scope.moneyRegisterClick=function(){
            $scope.moneyRegisterTitle="费用登记";
            $scope.moneyRegisterModel={
                'feeCost':'',
                "money":'',
                "receiptId":'',
                "description":'',
                "description2":'',
                "deliveryName":'',
                "transportFee":'',
                "taskId":'',
                "waybill":'',
                "id":''
            };
        }
        //确定登记
        $scope.moneyRegisterAdd=function(){
            if($scope.moneyRegisterModel.money<=0){
                alert("金额必须大于0");
                return false;
            }
            if($scope.moneyRegisterModel.money==''){
                alert("请输入正确的金额！");
                return false;
            }
            var reg = new RegExp("^[0-9]+(.[0-9]+)?");
            if(!reg.test($scope.moneyRegisterModel.money)){
                alert("请输入正确的金额！");
               // $("#moneyRegister").modal("hide");
                return false;
            }
            var opt={
                'feeCost':$scope.moneyRegisterModel.feeCost,
                "money":$scope.moneyRegisterModel.money,
                "receiptId":$scope.moneyRegisterModel.receiptId,
                "description":$scope.moneyRegisterModel.description,
                "id":$rootScope.id
            };

            registrationFee.getDataTable($scope.moneyRegisterTitle=='费用登记'?'/operatingexpense/insertCkExpense':'/operatingexpense/updateCkExpense',{param:{query:opt}})
                .then(function (data) {
                    alert(data.status.msg);
//                    if(data.status.code=="0000"){
//                        get(inGoodsState);
//                        $('#moneyRegister').modal('hide');
//                    }
                    get(inGoodsState);
                    $('#moneyRegister').modal('hide');
                });
        }
        //修改
        $scope.moneyModify= function (i,item) {
        	$rootScope.id=item.id;
            $scope.moneyRegisterTitle='费用修改';
            //$scope.moneyRegisterModel.money=item.money;
            $scope.moneyRegisterModel={
                'feeCost':item.feeCost,
                "money":item.money,
                "receiptId":item.receiptId,
                "description":item.description,
                "description2":item.description,
                'id':item.id,
                "deliveryName":item.deliveryName,
                "transportFee":item.transportFee,
                "taskId":item.taskId,
                "waybill":item.waybill,
            };
        }
        //确定登记
        $scope.logisticsMoneyRegisterAdd=function(){
            if($scope.moneyRegisterModel.transportFee<=0){
                alert("运费必须大于0");
                return false;
            }
            var opt={
                "description":$scope.moneyRegisterModel.description2,
                "deliveryName":$scope.moneyRegisterModel.deliveryName,
                "transportFee":$scope.moneyRegisterModel.transportFee,
                "taskId":$scope.moneyRegisterModel.taskId,
                "waybill":$scope.moneyRegisterModel.waybill,
                "id":$rootScope.id
            };

            registrationFee.getDataTable($scope.moneyRegisterTitle=='费用登记'?'/operatingexpense/insertCkDeliveryCosts':'/operatingexpense/updateCkDeliveryCosts',{param:{query:opt}})
                .then(function (data) {
                    alert(data.status.msg);
//                    if(data.status.code=="0000"){
//                        get(inGoodsState);
//                        $('#logisticsMoneyRegister').modal('hide');
//                    }
                    get(inGoodsState);
                    $('#logisticsMoneyRegister').modal('hide');
                });
        }
        //删除
        $scope.platformDeleteCall= function (i,item) {
            if(confirm('确定删除吗?')){
                registrationFee.getDataTable('/operatingexpense/deleteCkExpense',{param:{query:{id:item.id}}})
                    .then(function (data) {
                        alert(data.status.msg);
//                        if(data.status.code=='0000'){
//                            get(inGoodsState);
//                        }
                        get(inGoodsState);
                    });
            }
        }
        //删除
        $scope.logisticsDeleteCall= function (i,item) {
            if(confirm('确定删除吗?')){
                registrationFee.getDataTable('/operatingexpense/deleteCkDeliveryCosts',{param:{query:{id:item.id}}})
                    .then(function (data) {
                        alert(data.status.msg);
//                        if(data.status.code=='0000'){
//                            get(inGoodsState);
//                        }
                        get(inGoodsState);
                    });
            }
        }
        //分页跳转回调
        $scope.goToPage = function () {
            get(inGoodsState);
        }


    }])
});