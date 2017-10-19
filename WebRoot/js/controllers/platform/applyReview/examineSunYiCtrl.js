/**
 * Created by xiaojiu on 2016/11/9.
 */
define(['../../../app','../../../services/platform/applyReview/examineSunYiService'], function (app) {
     var app = angular.module('app');
    app.controller('examineSunYiCtrl', ['$rootScope', '$scope', '$stateParams','$state', '$sce', '$filter', 'HOST', '$window','examineSunYi', function ($rootScope, $scope,$stateParams, $state, $sce, $filter, HOST, $window,examineSunYi) {

        // query moudle setting
        $scope.querySeting = {
            items: [ {
                type: 'text',
                model: 'taskId',
                title: '损溢单号'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '申请时间'
            }, {
                type: 'select',
                model: 'status',
                selectedModel: 'orderTypeIdSelect',
                title: '审批状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = examineSunYi.getThead();

        $scope.lookModelThHeader = examineSunYi.getLookModelThHeader();
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
        var pmsSearch = examineSunYi.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.orderTypeIdSelect = "-1";
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
            opts.status = $scope.searchModel.orderTypeIdSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = examineSunYi.getDataTable(
                '/examine/getCkLossAndOverFlowOrderList',
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
            "taskId": ""
        }
        //查看
        $scope.lookCus=function(index,item){
            var promise = examineSunYi.getDataTable('/examine/getCkLossAndOverFlowOrderDetailList', {
                    param: {
                        query: {
                            taskId: item.taskId
                        }
                    }
                }
            );
            promise.then(function(data){
                $scope.lookBannerModel = data.banner;
                $scope.lookModelResult=data.grid;
            })
        }
        var taskId=$stateParams['taskId']
    }])
});