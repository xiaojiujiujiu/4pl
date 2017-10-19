/**
 * Created by xuwusheng on 15/12/12.
 */
define(['../../../app','../../../services/platform/finance-reporting/insideInOutStockService'], function (app) {
     var app = angular.module('app');
    app.controller('platformInsideInOutStockCtrl', ['$scope','$sce','platformInsideInOutStock', function ($scope,$sce,insideInOutStock) {
        $scope.chinaCities = [
            {py: 'qb', province: '全部', cities: ['全部']},
            {py: 'rdc', province: 'RDC', cities: ['上海']},
            {py: 'cdc', province: 'CDC', cities: ['北京']}
        ];
        $scope.selectSetting = {
            firstName: '仓库选择'
        }
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'businessId',
                title: '供应商'
            }, {
                type: 'select',
                model: '',
                title: '查询条件'
            }, {
                type: 'select',
                model: '',
                title: '类型'
            }, {
                type: 'select',
                model: 'status',
                title: '业务模式'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '统计日期'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //选择类型
        $scope.radioInside='insideOut';
        $scope.radioInsideText='内部出库明细';
        $scope.radioInsideChange= function (item) {
            if($scope.radioInside=='insideOut')
                $scope.radioInsideText='内部出库明细';
            else
                $scope.radioInsideText='内部入库明细';
        }

        //theadr
        $scope.thHeader=insideInOutStock.getThead();
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        //查询
        $scope.searchClick= function () {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
        }
    }]);
});