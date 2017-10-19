/**
 * Created by hui.sun on 15/12/13.
 */
'use strict';
define(['../../../app', '../../../services/storage/picking-packaging/packBusinessService'], function(app) {
     var app = angular.module('app');     app.controller('packBusinessCtrl', ['$rootScope','$scope', '$state', '$sce','$window', 'packBusiness', function($rootScope,$scope, $state, $sce,$window, packBusiness) {
        // 头部标签跳转
        /*$scope.orderPackHref = function(){
            $state.go('orderPack')
        }*/
        // 商品条码查询
        /*$scope.searchBarcode = function(barCode){
            alert(barCode)
        }*/
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            }, {type: 'select', 
            	model: 'customerID', 
            	title: '客户', 
            	selectedModel: 'customerIdSelect'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '拣货日期'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        $scope.tabFlag = true;
        //table头
        function getTableHeader(){
            if($scope.tabFlag){
                $scope.thHeader = packBusiness.getThead();
            }else{
                $scope.thHeader = packBusiness.getTheadChange();
            }
        }
        getTableHeader();
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
        
        function getQuery(packStatus){
            if(!packStatus){
                if($scope.tabFlag){
                    packStatus = 1;
                }else{
                    packStatus = 2;
                }
            };
            var sendParam = {
                param: {
                    query: {
                        packStatus: packStatus
                    }
                }
            }
           // var sendParam = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            var pmsSearch = packBusiness.getSearch(sendParam);
            pmsSearch.then(function(data) {
                $scope.searchModel = data.query; //设置当前作用域的查询对象
                $scope.searchModel.packStatusSelect =data.query.selectedPackStatus;
                $scope.searchModel.customerIdSelect = -1;
               //get(packStatus);
            }, function(error) {
                console.log(error)
            });

        }
        function getQuery2(packStatus){
            if(!packStatus){
                if($scope.tabFlag){
                    packStatus = 1;
                }else{
                    packStatus = 2;
                }
            };
            var sendParam = {
                param: {
                    query: {
                        packStatus: packStatus
                    }
                }
            }
            // var sendParam = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            var pmsSearch = packBusiness.getSearch(sendParam);
            pmsSearch.then(function(data) {
                $scope.searchModel = data.query; //设置当前作用域的查询对象
                $scope.searchModel.packStatusSelect =data.query.selectedPackStatus;
                $scope.searchModel.customerIdSelect = -1;
                get(packStatus);
            }, function(error) {
                console.log(error)
            });

        }
        getQuery2();
        
        //查询
        $scope.searchClick = function() {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            var packStatus;
            if($scope.tabFlag){
                packStatus = 1;
            }else{
                packStatus = 2;
            }
            get(packStatus);
//            $scope.searchModel.taskId = '';
        }

        function get(packStatus) {
            if(!packStatus){
                if($scope.tabFlag){
                    packStatus = 1;
                }else{
                    packStatus = 2;
                }
            };
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.packStatus = $scope.searchModel.packStatusSelect;
            opts.customerID = $scope.searchModel.customerIdSelect;
            opts.pageNo= $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            opts.packStatus = packStatus;

            var promise = packBusiness.getDataTable({
                param: {
                    query: opts
                }
            });
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
                $scope.result = data.grid;
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
        //实收数量blur事件
        $scope.actualQuantityBlur = function(item) {
            alert('实际数量: ' + item)
        }
        $scope.remarksBlur = function(cont) {
            alert(cont)
        }

        //分页跳转回调
        $scope.goToPage = function() {
			get();
        }

        $scope.tabChange = function(index){
            $scope.searchModel.customerIdSelect = -1;
            //$('#dt_0,#dt_1').datepicker({defaultDate:'',reset:true});
            if(index == 1){
            	$scope.querySeting.items[2].title="拣货日期";
                $scope.tabFlag = true;
            }else{
            	$scope.querySeting.items[2].title="包装日期";

                $scope.tabFlag = false;
            }
            $scope.searchModel.startTime=null;
            $scope.searchModel.endTime=null;
            getQuery(index);
            getTableHeader(index);
            get(index);
        }
        //打印
        $scope.print= function (i,item) {
            $window.open("../print/pickingList.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+item.taskId);
        }
    }])
});