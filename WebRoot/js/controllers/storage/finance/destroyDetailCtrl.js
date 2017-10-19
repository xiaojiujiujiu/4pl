/**
 * Created by xuwusheng on 15/12/12.
 */
define(['../../../app','../../../services/storage/finance/destroyDetailService'], function (app) {
     var app = angular.module('app');
    app.controller('destroyDetailCtrl', ['$scope','$sce','destroyDetail', function ($scope,$sce,destroyDetail) {
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
                title: '损毁单号'
            }, {
                type: 'select',
                model: '',
                title: '查询条件'
            }, {
                type: 'select',
                model: '',
                title: '客户'
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
        //theadr
        $scope.thHeader=destroyDetail.getThead();
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