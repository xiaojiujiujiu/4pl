/**
 * Created by xiaojiu on 2017/7/6.
 */

'use strict';
define(['../../../app', '../../../services/logistics/createOrder/createVehiclePartsOrderService'], function(app) {
    var app = angular.module('app');
    app.controller('createVehiclePartsOrderCtrl', ['$rootScope','$scope','$window','$filter', '$state', '$sce', 'createVehiclePartsOrder', function($rootScope,$scope,$window,$filter, $state, $sce, createVehiclePartsOrder) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '创建时间'
            }, {
                type: 'text',
                model: 'chuHuoName',
                title: '发货方'
            },{
                type: 'text',
                model: 'waybillId',
                title: '运单号'
            },{
                type: 'text',
                model: 'thirdWlId',
                title: '第三方单号'
            }, {
                type: 'select',
                model: 'orderStates',
                selectedModel:'orderStatesSelect',
                title: '订单状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = createVehiclePartsOrder.getThead();


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
        var pmsSearch = createVehiclePartsOrder.getSearch();
        pmsSearch.then(function(data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.orderStatesSelect=-1;
            //获取table数据
            get();
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
        $scope.exParams = '';
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.orderStates = $scope.searchModel.orderStatesSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = createVehiclePartsOrder.getDataTable({
                param: {query:opts}
            });
            promise.then(function(data) {
                if (data.code == -1) {
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
                $scope.banner = data.banner;
                //重置paging 解决分页指令不能监听对象问题
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function(error) {
                console.log(error);
            });
        }

        //确认
        $scope.obtainId=function(i,item){
            $rootScope.id=item.id;
        }
        $scope.confirmInCk=function(){
            createVehiclePartsOrder.confirmInCk({
                    param: {
                        "query":{
                            "id":$rootScope.id,
                        }
                    }
                },'/vehicleParts/confirmGetGoods')
                .then(function (data) {
                	 alert(data.status.msg)
                	  if(data.status.code=="0000") {
                        $("#confirmInCk").modal("hide");
                       
                  
                	alert('收货成功！收货单号为：'+data.banner.taskId+'是否确认打印？',function(){
                        $window.open('../print/createVehiclePartsOrderPrint.html?tokenId=' + $rootScope.userInfo.token + '&sessionid=' + $rootScope.userInfo.sessionId + '&shipmentTaskId=' + data.banner.taskId);
                	
                	});
                	  
                	}
                   
                  get();
                }, function (error) {
                    console.log(error)
                });
        }
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
        //查看
        $scope.linkL=function(i,item){
            $state.go('main.createVehiclePartsOrderLook', {taskId:item.taskId,waybillId: item.waybillId});
        }
        //发货
        $scope.linkF=function(i,item){
            $state.go('main.createVehiclePartsOrderChu', {taskId:item.taskId,waybillId: item.waybillId});
        }

        //打印
        $scope.print = function (i, item) {
            $window.open('../print/createVehiclePartsOrderPrint.html?tokenId=' + $rootScope.userInfo.token + '&sessionid=' + $rootScope.userInfo.sessionId + '&taskId=' + item.taskId);
        }



    }])
});