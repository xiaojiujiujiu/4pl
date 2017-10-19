/**
 *
 * @authors Hui Sun
 * @date    2015-12-11
 * @version $Id$
 */
'use strict';
define(['../../../app', '../../../services/logistics/order-ship/orderAssignService'], function (app) {
    var app = angular.module('app');
    app.controller('orderAssignCtrl', ['$rootScope','$scope', '$state', '$sce','$window', 'orderAssign', function ($rootScope,$scope, $state, $sce,$window, orderAssign) {
        $scope.taskId = '';
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '入库时间'
            }, {
                type: 'select',
                model: 'assignType',
                selectedModel: 'assignTypeSelect',
                title: '分派状态'
            }, {
                type: 'select',
                model: 'paySide',
                selectedModel: 'paySideSelect',
                title: '运费付费方'
            }, {
                type: 'select',
                model: 'clearType',
                selectedModel: 'clearTypeSelect',
                title: '结算方式'
            } ],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]

        };
        $scope.pageModel = {
            distributionSelect: {
                select1: {
                    data: [{id:-1,name:'全部'}],
                    id: -1,
                    change: function () {}
                }
            }
        };

        //table头
        $scope.thHeader = orderAssign.getThead();
        $scope.openModelThHeader = orderAssign.getOpenModelThHeader();
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
        var pmsSearch = orderAssign.getSearch();
        pmsSearch.then(function(data) {

            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.pageModel.distributionSelect.select1.data = data.query.opUser;
            $scope.searchModel.assignTypeSelect = -1;
            $scope.searchModel.paySideSelect = -1;
            $scope.searchModel.clearTypeSelect = -1;
            //获取table数据
            get();
        }, function(error) {
            console.log(error)
        });
        //查询
        $scope.searchClick = function () {

            get();


        }
        $scope.result=[];
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.assignType= $scope.searchModel.assignTypeSelect;
            opts.paySide= $scope.searchModel.paySideSelect;
            opts.clearType= $scope.searchModel.clearTypeSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = orderAssign.getDataTable({
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
                $scope.banner=data.banner;
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
        //查看
        $scope.isShow=true;
        $scope.lookCall=function(i,item){
            if(item.distributionWay=="百库配送"){
                $scope.isShow=true;
            }else {
                $scope.isShow=false;
            }
            var promise = orderAssign.getDataTable( {
                param: {
                    query: {
                        assignTaskId: item.assignTaskId
                    }
                }
            },'/personalOrder/printAssignTaskId');
            promise.then(function (data) {
                $scope.modalBanner = data.banner;
                $scope.openModelResult = data.grid;
            })
            $('#lookCall').modal('show');

        }
        //打印
        $scope.print=function(i,item){
            $window.open('../print/orderAssignConfirmPrint.html?tokenId=' + $rootScope.userInfo.token + '&sessionid=' + $rootScope.userInfo.sessionId + '&assignTaskId=' + item.assignTaskId);
        };
        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
    }])
});