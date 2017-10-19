/**
 * Created by xiaojiu on 2017/4/24.
 */
define(['../../../app','../../../services/platform/externalSingleManagement/thirdPartyFreightPayService'], function (app) {
    var app = angular.module('app');
    app.controller('thirdPartyFreightPayCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','thirdPartyFreightPay',
        function ($rootScope, $scope, $state, $sce, $filter, HOST, $window, thirdPartyFreightPay) {
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
                    type: 'select',
                    model: 'shippedFreightStatu',
                    selectedModel:'shippedFreightStatuSelect',
                    title: '是否结算'
                }, {
                    type: 'text',
                    model: 'thirdWlId',
                    title: '第三方单号'
                }, {
                    type: 'text',
                    model: 'thirdpartyWl',
                    title: '第三方物流'
                }],
                btns: [{
                    text: $sce.trustAsHtml('查询'),
                    click: 'searchClick'
                }]
            };
            //table头
            $scope.thHeader = thirdPartyFreightPay.getThead();
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
            var pmsSearch = thirdPartyFreightPay.getSearch();
            pmsSearch.then(function (data) {
                $scope.searchModel = data.query; //设置当前作用域的查询对象
                $scope.searchModel.shippedFreightStatuSelect='-1';
                $scope.addModel.clearType.select=data.query.thirdPartyPayType;
                $scope.addModel.clearType.id=-1;
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
                $scope.exParams = $filter('json')({query: opts});
                var promise = thirdPartyFreightPay.getDataTable(
                    '/deliveryPartyPay/getThirdPartyFreightPayList',
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
                payment:'',
                userName:'',
                clearType:{
                    id:1,
                    select:[]
                }
            }


            //付款
            $scope.updateGift= function (index,item) {
                        $scope.addModel.payment=item.thirdpartyPay;
                        $scope.addModel.userName=item.userName;
                        $rootScope.taskId=item.taskId;
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
                thirdPartyFreightPay.getDataTable( '/deliveryPartyPay/affirmPayment', sendParams)
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


        }])
});