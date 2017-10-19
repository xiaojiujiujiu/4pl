/**
 * 
 * @authors Hui Sun 
 * @date    2015-12-11 
 * @version $Id$
 */
'use strict';
define(['../../../app', '../../../services/logistics/orderReceipt/newRreturnStorageService'], function(app) {
     var app = angular.module('app');
    app.controller('newRreturnStorageCtrl', ['$rootScope','$scope', '$state', '$sce', '$window', 'newRreturnStorage', function($rootScope,$scope, $state, $sce, $window, newRreturnStorage) {
        $scope.backHref = function(){
            $state.go('main.logistiReturn')
        }
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'select',
                model: 'orderTypeId',
                selectedModel: 'orderTypeIdSelect',
                title: '业务类型'
            }, {
                type: 'text',
                model: 'ckTaskId',
                title: '业务单号'
            }, {
                type: 'text',
                model: 'orderID',
                title: '客户单号'
            }, {
                type: 'date',
                 model: ['startTime', 'endTime'],
                title: '生成日期'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };

        //table头
        $scope.thHeader = newRreturnStorage.getThead();
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
        var pmsSearch = newRreturnStorage.getSearch();
        pmsSearch.then(function(data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.orderTypeIdSelect = -1;
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
        	$scope.searchModel.cktaskId = '';
            get();
        }
        $scope.goLogistiReturn = function(){
            $state.go('logistiReturn');
        }

        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.orderTypeId = $scope.searchModel.orderTypeIdSelect;
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;

            var promise = newRreturnStorage.getDataTable({
                param: {
                    query: opts
                }
            }, '/wlReturnGoodsDetail/queryWlReturnGoodsDetailList');
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
        }
        //分页跳转回调
        $scope.goToPage = function() {
			get()
        }
        // 生成退货入库单
        $scope.createWlReturnGoods = function(){
        	var sendTaskIds = '';
        	angular.forEach($scope.result, function(item, index){
        		if(item.pl4GridCheckbox.checked == true){
        			sendTaskIds += item.taskId + ',';
        		}
        	})
        	sendTaskIds = sendTaskIds.substr(0,sendTaskIds.length-1);
        	if(sendTaskIds == ''){
        		alert('请勾选需要生成退货入库单的选项！')
        		return false
        	}
        	var promise = newRreturnStorage.getDataTable({
                param: {
                    query: {
                    	taskIds: sendTaskIds
                    }
                }
            }, '/wlReturnGoodsDetail/createWlReturnGoods');
            promise.then(function(data) {
               alert(data.message)
               get();
               $window.open('/print/logistiReturnPrint.html?tokenId='+$rootScope.userInfo.token+'&sessionid='+$rootScope.userInfo.sessionId+'&rkTaskId='+data.banner.rkTaskId)
            }, function(error) {
                console.log(error);
            });
        }
    }])
});