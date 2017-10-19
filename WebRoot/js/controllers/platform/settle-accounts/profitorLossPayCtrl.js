/**
 * Created by xiaojiu on 2016/11/19.
 */

define(['../../../app','../../../services/platform/settle-accounts/profitorLossPayService'], function (app) {
     var app = angular.module('app');
    app.controller('profitorLossPayCtrl', ['$rootScope', '$scope', '$stateParams','$state', '$sce', '$filter', 'HOST', '$window','profitorLossPay', function ($rootScope, $scope,$stateParams, $state, $sce, $filter, HOST, $window,profitorLossPay) {

        // query moudle setting
        $scope.querySeting = {
            items: [ {
                type: 'text',
                model: 'taskId',
                title: '损溢单号'
            },{
                type: 'date',
                model: ['createTimeStart', 'createTimeEnd'],
                title: '结算时间'
            }, {
                type: 'select',
                model: 'balanceStatus',
                selectedModel: 'orderTypeIdSelect',
                title: '结算状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = profitorLossPay.getThead();

        $scope.lookModelThHeader = profitorLossPay.getLookModelThHeader();
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
        var pmsSearch = profitorLossPay.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.orderTypeIdSelect = -1;
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            $scope.storageSelectedRDC = '-1';
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
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.balanceStatus = $scope.searchModel.orderTypeIdSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            // $scope.exParams = $filter('json')({query: opts});
            $scope.exParams={query:opts};
            var promise = profitorLossPay.getDataTable(
                '/lossAndOverflowPay/queryBalanceList',
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
                $scope.result = data.grid;
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
                // $scope.paging.totalPage = data.total;
            }, function (error) {
                console.log(error);
            });
        }

        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
        //查看bannerModel
        $scope.lookBannerModel={
            "ckName": "",
            "optUserName": "",
            "remarks": "",
            "taskId": "",
            "goodsBrand": "",
            "examineUser": "",
            "optUser": "",
            "orderPrice": "",
        }
        //查看
        $scope.lookCus=function(index,item){
            var promise = profitorLossPay.getDataTable('/lossAndOverflowPay/queryBalanceDetailList', {
                    param: {
                        query: {
                            taskId: item.taskId
                        }
                    }
                }
            );
            promise.then(function(data){
                $rootScope.taskId= data.banner.taskId;
                $scope.lookBannerModel = data.banner;
                $scope.lookModelResult=data.grid;
                $scope.exParams.query.taskId=data.banner.taskId;
            })
        }

        //确认财务信息
        $scope.update= function () {
            var promise = profitorLossPay.getDataTable('/lossAndOverflowPay/updateBalanceStatus', {
                    param: {
                        query: {
                            taskId: $rootScope.taskId
                        }
                    }
                }
            );
            promise.then(function(data){
                $("#settleModal").modal("hide");
               alert(data.status.msg);
                get()
            })
        }
        //打印
        $scope.print= function (i,item) {
                $window.open("/print/profitorLossPayPrint.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+item.taskId);
                $('#lookModal').modal('hide');
        }
    }])
});