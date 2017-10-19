/**
 * Created by xiaojiu on 2016/11/19.
 */

define(['../../../app','../../../services/platform/applyReview/examineOutInService'], function (app) {
     var app = angular.module('app');
    app.controller('examineOutInCtrl', ['$rootScope', '$scope', '$stateParams','$state', '$sce', '$filter', 'HOST', '$window','examineOutIn', function ($rootScope, $scope,$stateParams, $state, $sce, $filter, HOST, $window,examineOutIn) {

        // query moudle setting
        $scope.querySeting = {
            items: [ {
                type: 'text',
                model: 'taskId',
                title: '申请编号'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '申请时间'
            },{
                type: 'select',
                model: 'chruType',
                selectedModel: 'chruTypeSelect',
                title: '特殊出入库类型'
            },{
                type: 'select',
                model: 'status',
                selectedModel: 'statusSelect',
                title: '审批状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = examineOutIn.getThead();

        $scope.lookModelThHeader = examineOutIn.getLookModelThHeader();
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
        var pmsSearch = examineOutIn.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.chruTypeSelect = "-1";
            $scope.searchModel.statusSelect = "-1";
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
            opts.type = $scope.searchModel.chruTypeSelect;
            opts.status = $scope.searchModel.statusSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = examineOutIn.getDataTable(
                '/examine/getOutInCkOrderOrderList',
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
            "taskId": "",
            "type": "",
            "rejectRemarks": "",
            "userRemarks": "",
            "totalMoney": "",
        }
        //查看
        $scope.lookCus=function(index,item){
            var promise = examineOutIn.getDataTable('/examine/getOutInCkOrderDetailList', {
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
            })
        }
        //通过申请
        $scope.countersign= function () {
            $('#passModal').modal('show');
        }
        //通过申请确认
        $scope.passCountersign=function(){
            var opts={};
            opts.taskId=$rootScope.taskId;
            opts.examineStatus=1;
            var promise = examineOutIn.getDataTable(
                '/examine/updateOutInCkOrder',
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
                if(data.status.code=="0000"){
                    alert(data.status.msg);
                    $('#passModal,#settleModal').modal('hide');
                    get();
                }
            }, function (error) {
                console.log(error);
            });
        }
        //驳回申请
        $scope.reject= function () {
            $('#rejectModal').modal('show');
        }
        $scope.remarksModel={
            remarks:'',
        }
        //驳回申请
        $scope.rejectCountersign=function(){
            var opts={};
            opts.taskId=$rootScope.taskId;
            opts.examineStatus=2;
            opts.remarks=$scope.remarksModel.remarks;
            var promise = examineOutIn.getDataTable(
                '/examine/updateOutInCkOrder',
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
                if(data.status.code=="0000"){
                    $('#settleModal,#rejectModal').modal('hide');
                    get();
                }
            }, function (error) {
                console.log(error);
            });
        }
    }])
});