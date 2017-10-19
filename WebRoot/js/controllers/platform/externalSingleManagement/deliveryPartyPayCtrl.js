/**
 * Created by xiaojiu on 2016/11/22.
 */
define(['../../../app','../../../services/platform/externalSingleManagement/deliveryPartyPayService'], function (app) {
     var app = angular.module('app');
    app.controller('deliveryPartyPayCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','deliveryPartyPay',
        function ($rootScope, $scope, $state, $sce, $filter, HOST, $window, deliveryPartyPay) {
            // query moudle setting
            $scope.querySeting = {
                items: [{
                    type: 'text',
                    model: 'taskId',
                    title: '业务单号'
                },{
                    type: 'date',
                    model: ['startTime', 'endTime'],
                    title: '订单时间'
                }, {
                    type: 'text',
                    model: 'shipper',
                    title: '发件方',
                    autocomplete: 'shipper',
                    autoCallback: 'shipperAutocomplete',
                    automodel: 'goodsId'
                }, {
                    type: 'select',
                    model: 'shippedFreightStatu',
                    selectedModel:'shippedFreightStatuSelect',
                    title: '结算状态'
                },{
                    type: 'date',
                    model: ['hzStartTime', 'hzEndTime'],
                    title: '回执时间'
                }, {
                    type: 'select',
                    model: 'collectTimeliness',
                    selectedModel:'collectTimelinessSelect',
                    title: '代收款回款时效'
                }],
                btns: [{
                    text: $sce.trustAsHtml('查询'),
                    click: 'searchClick'
                }]
            };
            //table头
            $scope.thHeader = deliveryPartyPay.getThead();
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
            var pmsSearch = deliveryPartyPay.getSearch();
            pmsSearch.then(function (data) {
                $scope.searchModel = data.query; //设置当前作用域的查询对象
                $scope.searchModel.shippedFreightStatuSelect='-1';
                $scope.searchModel.collectTimelinessSelect=-1;
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
                opts.pageNo = $scope.paging.currentPage;
                opts.pageSize = $scope.paging.showRows;
                opts.shippedFreightStatu=$scope.searchModel.shippedFreightStatuSelect;
                opts.collectTimeliness=$scope.searchModel.collectTimelinessSelect;
                $scope.exParams = $filter('json')({query: opts});
                var promise = deliveryPartyPay.getDataTable(
                    '/deliveryPartyPay/queryShipperPayList',
                    {
                        param: {
                            query: opts
                        }
                    }
                );
                promise.then(function (data) {
                    $scope.result = data.grid;

                    //angular.forEach($scope.result,function(item){
                    //    $rootScope.taskId=item.taskId;
                    //})
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


           //付款
            $scope.updateGift= function (index,item) {
                deliveryPartyPay.getDataTable('/recePointPay/initConfirmPayStatus', {param:{}})
                    .then(function (data) {
                        $scope.addModel={
                            money:'',
                            clearType:{
                                id:9,
                                select:[]
                            }
                        }
                        $scope.addModel.clearType.select=data.query.clearType;
                        $scope.addModel.money=item.payMoney;
                        $rootScope.taskId=item.taskId;
                    })
            }
            //确认支付方式
            $scope.enterAdd= function () {
                //获取选中 设置对象参数
                var opts = angular.extend({}, $scope.addModel, {}); //克隆出新的对象，防止影响scope中的对象
                opts.clearType= $scope.addModel.clearType.id;
                opts.taskId=$rootScope.taskId
                var sendParams = {
                    param: {
                        query:opts
                    }
                }
                deliveryPartyPay.getDataTable( '/deliveryPartyPay/confirmDeliveryPartyPayStatus', sendParams)
                    .then(function (data) {
                        alert(data.status.msg)
                        if (data.status.code == "0000") {
                            $('#workLogModal').modal('hide');
                            get();

                        }
                    })
            }
            //分页跳转回调
            $scope.goToPage = function () {
                get();
            }
            $scope.dropDownList = [];
            $scope.shipperAutocomplete= function (newValue) {
                var opts = angular.extend({}, $scope.searchModel, {});
                opts.userName=newValue;
                return deliveryPartyPay.autoCompletion({
                    param: {
                        query: opts
                    }
                });
            };

        }])
});