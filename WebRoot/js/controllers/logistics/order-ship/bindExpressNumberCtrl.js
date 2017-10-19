/**
 * 
 * @authors Hui Sun 
 * @date    2015-12-11 
 * @version $Id$
 */
'use strict';
define(['../../../app', '../../../services/logistics/order-ship/bindExpressNumberService'], function(app) {
     var app = angular.module('app');
    app.controller('bindExpressNumberCtrl', ['$scope', '$state', '$sce', 'bindExpressNumber', function($scope, $state, $sce, bindExpressNumber) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'select',
                model: 'shipMode',
                title: '配送方式'
            }, {
                type: 'select',
                model: 'commonCarrier',
                title: '承运商'
            }],
            btns: [{
                text: $sce.trustAsHtml('确定'),
                click: 'searchClick'
            }]
        };

        //table头
        $scope.thHeader = bindExpressNumber.getThead();
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
        var pmsSearch = bindExpressNumber.getSearch();
        pmsSearch.then(function(data) {
            $scope.searchModel = data.result; //设置当前作用域的查询对象

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
            //任务类型 下拉框change
        $scope.orderTypeIdChange = function() {
            //  console.log($scope.searchModel.orderTypeIdSelect)
        }

        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            // opts.orderTypeId = $scope.searchModel.clientIdSelect;
            // opts.taskState = $scope.searchModel.putGoodStateSelect;

            // opts.customerId = $scope.searchModel.customerIdSelect;
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = bindExpressNumber.getDataTable({
                parm: opts
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
                $scope.result = data.result;
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
        //实收数量blur事件
        $scope.actualQuantityBlur = function(item) {
            alert('实际数量: ' + item)
        }
        $scope.remarksBlur = function(cont) {
            alert(cont)
        }

        //分页跳转回调
        $scope.goToPage = function() {

        }
    }])
});