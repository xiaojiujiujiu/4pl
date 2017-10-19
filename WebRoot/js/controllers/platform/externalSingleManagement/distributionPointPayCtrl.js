/**
 * Created by xiaojiu on 2016/11/22.
 */
define(['../../../app','../../../services/platform/externalSingleManagement/distributionPointPayService'], function (app) {
     var app = angular.module('app');
    app.controller('distributionPointPayCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','distributionPointPay',
        function ($rootScope, $scope, $state, $sce, $filter, HOST, $window, distributionPointPay) {
            // query moudle setting
            $scope.querySeting = {
                items: [{
                    type: 'text',
                    model: 'receiptId',
                    title: '结算单号'
                },{
                    type: 'date',
                    model: ['startTime', 'endTime'],
                    title: '回执结算时间'
                }, {
                    type: 'select',
                    model: 'payStatu',
                    selectedModel: 'payStatuSelect',
                    title: '确认状态'
                }, {
                    type: 'select',
                    model: 'wlDeptId',
                    selectedModel: 'wlDeptIdSelect',
                    title: '配送中心'
                }],
                btns: [{
                    text: $sce.trustAsHtml('查询'),
                    click: 'searchClick'
                }]
            };
            //table头
            $scope.thHeader = distributionPointPay.getThead();
            $scope.lookHeader = distributionPointPay.lookHeader();
            //分页下拉框
            $scope.pagingSelect = [
                {value: 5, text: 5},
                {value: 10, text: 10, selected: true},
                {value: 20, text: 20},
                {value: 30, text: 30},
                {value: 50, text: 50}
            ];
            //分页对象
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: 30,
            };
            var pmsSearch = distributionPointPay.getSearch();
            
            pmsSearch.then(function (data) {
                $scope.searchModel = data.query; //设置当前作用域的查询对象
                $scope.searchModel.payStatuSelect = -1;
                $scope.searchModel.wlDeptIdSelect = -1;

                //获取table数据
                get();
            }, function (error) {
                console.log(error)
            });

            //查询
            $scope.searchClick = function () {
                $scope.paging = {
                    totalPage: 1,
                    currentPage: 1,
                    showRows: $scope.paging.showRows
                };
                get();
            }
            $scope.exParams = '';
            function get() {
                //获取选中 设置对象参数
                var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
                opts.payStatu = $scope.searchModel.payStatuSelect;
                opts.wlDeptId = $scope.searchModel.wlDeptIdSelect;
                opts.pageNo = $scope.paging.currentPage;
                opts.pageSize = $scope.paging.showRows;
                $scope.exParams = $filter('json')({query: opts});
                var promise = distributionPointPay.getDataTable(
                    '/distributionPointPay/queryDistributionPointPayList',
                    {
                        param: {
                            query: opts
                        }
                    }
                );
                promise.then(function (data) {
                    $scope.result = data.grid;

                    angular.forEach($scope.result,function(item){
                        $rootScope.receiptId=item.receiptId;
                    })
                    $scope.paging = {
                        totalPage: data.total,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };;
                }, function (error) {
                    console.log(error);
                });
            }
            $scope.addModel={
                money:'',
                clearType:{
                    id:1,
                    select:[]
                }
            }
            //distributionPointPay.getDataTable('/recePointPay/initConfirmPayStatus', {param:{}})
            //    .then(function (data) {
            //        $scope.addModel.clearType.select=data.query.clearType;
            //    })
            //付款
            $scope.updateGift= function (index,item) {
                distributionPointPay.getDataTable('/recePointPay/initConfirmPayStatus', {param:{}})
                    .then(function (data) {
                        $scope.addModel={
                            money:'',
                            clearType:{
                                id:9,
                                select:[]
                            }
                        }
                        $scope.addModel.clearType.select=data.query.clearType;
                        $scope.addModel.money=item.total;
                        $rootScope.receiptId=item.receiptId;
                    })
            }
            //确认支付方式
            $scope.enterAdd= function (i,item) {
                var opts = angular.extend({}, $scope.addModel, {}); //克隆出新的对象，防止影响scope中的对象
                opts.clearType= $scope.addModel.clearType.id;
                opts.receiptId=$rootScope.receiptId
                opts.remarks=$scope.addModel.remarks
                var sendParams = {
                    param: {
                        query:opts
                    }
                }
                distributionPointPay.getDataTable( '/distributionPointPay/confirmDistributionPointPayStatus', sendParams)
                    .then(function (data) {
                        alert(data.status.msg)
                        if (data.status.code == "0000") {
                            $('#workLogModal').modal('hide');
                            get();
                        }
                    })
            }
            //查看详情
            $scope.lookGift=function(index,item){
                distributionPointPay.getDataTable('/distributionPointPay/queryDistributionPointDetailList', {param:{query:{receiptId:item.receiptId}}})
                    .then(function (data) {
                        $scope.lookResult=data.grid;
                        $rootScope.receiptId=item.receiptId;
                    })
            }

            //分页跳转回调
            $scope.goToPage = function () {
                get();
            }

        }])
});