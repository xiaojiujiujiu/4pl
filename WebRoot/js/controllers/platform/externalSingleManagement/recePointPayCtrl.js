/**
 * Created by xiaojiu on 2016/11/22.
 */
define(['../../../app','../../../services/platform/externalSingleManagement/recePointPayService'], function (app) {
     var app = angular.module('app');
    app.controller('recePointPayCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','recePointPay',
        function ($rootScope, $scope, $state, $sce, $filter, HOST, $window, recePointPay) {
            // query moudle setting
            $scope.querySeting = {
                items: [{
                    type: 'text',
                    model: 'taskId',
                    title: '业务单号'
                }, {
                    type: 'date',
                    model: ['startTime', 'endTime'],
                    title: '创建时间'
                }, {
                    type: 'select',
                    model: 'recePointId',
                    selectedModel: 'recePointIdSelect',
                    title: '收货点'
                }],
                btns: [{
                    text: $sce.trustAsHtml('查询'),
                    click: 'searchClick'
                }]
            };
            //table头
            $scope.tabFlag = true;
            function getTableHeader(){
                if($scope.tabFlag){
                    $scope.thHeader = recePointPay.getThead();
                }else{
                    $scope.thHeader = recePointPay.getTheadChange();
                }
            }
            getTableHeader();
            $scope.openModelThHeader = recePointPay.getOpenModelThHeader();
            $scope.isShow=true;
            $scope.tabChange = function(index){
                if(index == 1){
                    $scope.tabFlag = true;
                    $scope.isShow=true;
                }else{
                    $scope.tabFlag = false;
                    $scope.isShow=false;
                }
                getTableHeader(index);
                get(index);

            }
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
            var pmsSearch = recePointPay.getSearch();
            pmsSearch.then(function (data) {
                $scope.searchModel = data.query; //设置当前作用域的查询对象
                $scope.searchModel.payStatuSelect = -1;
                $scope.searchModel.recePointIdSelect = -1;

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
                if($scope.tabFlag){
                    var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
                    opts.payStatu = $scope.searchModel.payStatuSelect;
                    opts.recePointId = $scope.searchModel.recePointIdSelect;
                    opts.pageNo = $scope.paging.currentPage;
                    opts.pageSize = $scope.paging.showRows;
                    $scope.exParams = $filter('json')({query: opts});
                    var promise = recePointPay.getDataTable(
                        '/recePointPay/queryRecePointList',
                        {
                            param: {
                                query: opts
                            }
                        }
                    );
                    promise.then(function (data) {
                        $scope.result = data.grid;

                        angular.forEach($scope.result,function(item){
                                $rootScope.taskId=item.taskId;
                        })
                        $scope.paging = {
                            totalPage: data.total,
                            currentPage: $scope.paging.currentPage,
                            showRows: $scope.paging.showRows,
                        };;
                    }, function (error) {
                        console.log(error);
                    });
                }else {
                    var opts = {};
                    opts.pageNo = $scope.paging.currentPage;
                    opts.pageSize = $scope.paging.showRows;
                    var promise = recePointPay.getDataTable(
                        '/settlePersonal/querySettlePersonal',
                        {
                            param: {
                                query: opts
                            }
                        }
                    );
                    promise.then(function (data){
                        $scope.result = data.grid;
                    })
                }
            }
            $scope.addModel={
                payOpUser:'',
                receivableMoney:'',
                actualMoney:'',
                remark:'',
                clearType:{
                    id:1,
                    select:[]
                }
            }
            //recePointPay.getDataTable('/recePointPay/initConfirmPayStatus', {param:{}})
            //    .then(function (data) {
            //        $scope.addModel.clearType.select=data.query.clearType;
            //    })
            //付款

            $scope.updateGift= function (index,item) {
                var taskIds='';
                angular.forEach($scope.result,function(item){
                    if (item.pl4GridCheckbox.checked) {
                        taskIds+=item.taskId+',';
                    }
                })
                taskIds = taskIds.slice(0, taskIds.length - 1);
                $rootScope.taskId=taskIds;
                if(taskIds!=''){
                    $('#workLogModal').modal("show");
                    recePointPay.getDataTable('/recePointPay/initConfirmPayStatus', {param:{query:{
                        taskId:taskIds
                    }}})
                        .then(function (data) {
                            $scope.addModel={
                                clearType:{
                                id:9,
                                select:data.query.clearType
                            }
                            }
                            $scope.addModel.clearType.select=data.query.clearType;
                            $scope.addModel.payOpUser=data.query.payOpUser;
                            $scope.addModel.receivableMoney=data.query.receivableMoney;
                            $scope.addModel.actualMoney=data.query.actualMoney;
                        })
                }else {
                    alert('请选择需要收款的业务单!');
                }

            }
            //确认支付方式
            $scope.enterAdd= function (i,item) {
                var opts = angular.extend({}, $scope.addModel, {}); //克隆出新的对象，防止影响scope中的对象
                opts.clearType= $scope.addModel.clearType.id;
                opts.taskId=$rootScope.taskId
                var sendParams = {
                    param: {
                        query:opts
                    }
                }
                recePointPay.getDataTable( '/recePointPay/confirmRecePointPayStatus', sendParams)
                    .then(function (data) {
                        alert(data.status.msg)
                        if (data.status.code == "0000") {
                            $('#workLogModal').modal('hide');
                            get();
                        }
                    })
            }
            //查看
            $scope.getOpenModelData=function(i,item){
                console.log(item);
                var opts = {};
                opts.settleId = item.settleId;
                var promise = recePointPay.getDataTable(
                    '/settlePersonal/settlePersonalDetail',
                    {
                        param: {
                            query: opts
                        }
                    }
                );
                promise.then(function (data){
                    $scope.openModelResult = data.grid;
                })
            }
            //分页跳转回调
            $scope.goToPage = function () {
                get();
            }

        }])
});