/**
 * 
 * @authors Hui Sun 
 * @date    2016-1-11
 * @version $Id$
 */
'use strict';
define(['../../../app', '../../../services/logistics/orderReceipt/logistiReturnService'], function(app) {
     var app = angular.module('app');
    app.controller('logistiReturnCtrl', ['$rootScope','$scope', '$state', '$sce', '$window', 'logistiReturn', function($rootScope,$scope, $state, $sce, $window, logistiReturn) {
        $scope.creatHref = function(){
            $state.go('main.newRreturnStorage')
        }
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'rkTaskId',
                title: '业务单号'
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
        $scope.thHeader = logistiReturn.getThead();
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
        var pmsSearch = logistiReturn.getSearch();
        pmsSearch.then(function(data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.rkStatusSelect = -1;
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
            $scope.searchModel.rktaskId = '';
        }
            //任务类型 下拉框change
        $scope.orderTypeIdChange = function() {
            //  console.log($scope.searchModel.orderTypeIdSelect)
        }

        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.rkStatus = $scope.searchModel.rkStatusSelect;
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = logistiReturn.getDataTable({
                param:{
                    query: opts
                }
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
        
        // 打印回调
        $scope.printCallback = function(index, item){
        	$window.open('/print/logistiReturnPrint.html?tokenId='+$rootScope.userInfo.token+'&sessionid='+$rootScope.userInfo.sessionId+'&rkTaskId='+item.rkTaskId)
        }
    }])
});