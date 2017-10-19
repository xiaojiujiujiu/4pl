/**
 * Created by xiaojiu on 2017/3/22.
 */

'use strict';
define(['../../../app', '../../../services/platform/information/platformCarManageService'], function(app) {
    var app = angular.module('app');
    app.controller('platformCarManageCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window', 'platformCarManage', function($rootScope, $scope, $state, $sce, $filter, HOST, $window, platformCarManage) {
        // query moudle setting
        $scope.querySeting = {
            items: [ {
            	 type: 'text',
                 model: 'licenseNumber',
                 title: '车牌号'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = platformCarManage.getThead();
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
            showRows: 10
        };
        $scope.ifShowSelect=true;
        var pmsSearch = platformCarManage.getSearch();
        pmsSearch.then(function(data) {

            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.labelName = '所属仓库';
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            if(data.query.flag==1){
                $scope.ifShowSelect=false;
            }else {
                $scope.ifShowSelect=true;
            }
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
                showRows: $scope.paging.showRows
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

            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = platformCarManage.getDataTable({
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
      
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }

    }])
});