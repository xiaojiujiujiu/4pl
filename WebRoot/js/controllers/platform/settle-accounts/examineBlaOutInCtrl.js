/**
 * Created by xiaojiu on 2016/11/19.
 */

define(['../../../app','../../../services/platform/settle-accounts/examineBlaOutInService'], function (app) {
     var app = angular.module('app');
    app.controller('examineBlaOutInCtrl', ['$rootScope', '$scope', '$stateParams','$state', '$sce', '$filter', 'HOST', '$window','examineBlaOutIn', function ($rootScope, $scope,$stateParams, $state, $sce, $filter, HOST, $window,examineBlaOutIn) {

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
            }, {
                type: 'select',
                model: 'chruType',
                selectedModel: 'chruTypeSelect',
                title: '特殊出入库类型'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = examineBlaOutIn.getThead();

        $scope.lookModelThHeader = examineBlaOutIn.getLookModelThHeader();
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
        var pmsSearch = examineBlaOutIn.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.chruTypeSelect = "-1";
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
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.chruType = $scope.searchModel.chruTypeSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = examineBlaOutIn.getDataTable(
                '/examine/getBalOutInCkOrderOrderList',
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
            "examineUserName": "",
            "type": "",
            "createUserName": "",
            "totalMoney": "",
        }
        //查看
        $scope.lookCus=function(index,item){
            var promise = examineBlaOutIn.getDataTable('/examine/getBalOutInCkOrderDetailList', {
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

        //确认财务信息
        $scope.update= function () {
            var promise = examineBlaOutIn.getDataTable('/examine/updateBalOutInCkOrder', {
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
        $scope.print= function () {
            $window.open("/print/examineBlaOutInPrint.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+$rootScope.taskId);
            $('#lookModal').modal('hide');
        }
    }])
});