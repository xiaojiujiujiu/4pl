/**
 * Created by xuwusheng on 15/12/12.
 */
'use strict';
define(['../../../app', '../../../services/logistics/registeredCarrier/newRegisterService'], function(app) {
     var app = angular.module('app');
    app.controller('newRegisterCtrl', ['$scope', '$state', '$sce', 'newRegister', function($scope, $state, $sce, newRegister) {

        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'commodityCode',
                title: '配送形式'
            }, {
                type: 'select',
                model: 'client',
                title: '配送人员'
            }, {
                type: 'text',
                model: 'phone',
                title: '配送电话'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };

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

        //table头
        $scope.thHeader = newRegister.getThead();

        //业务单号查询
        $scope.orderSearchClick= function () {
            $scope.isOrderSearchClick=true;
            get();
        }
        //查询
        $scope.searchClick = function() {

            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows,
            };
            get();
        }

        function get() {
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            /*opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.customerId = $scope.searchModel.customerIdSelect;
            opts.distributype = $scope.searchModel.distributypeSelect;
            opts.distributName = $scope.searchModel.distributNameSelect;
            opts.payState = $scope.searchModel.payStateSelect;*/

            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = newRegister.getDataTable({
                param: {
                    query: {
                        taskId: 5,
                        recordId: -1,
                        payState: -1,
                        rdcId: -1,
                        cdcId: -1
                    }
                }
            });
            promise.then(function (data) {
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
            }, function (error) {
                console.log(error);
            });
        }
    }])
});