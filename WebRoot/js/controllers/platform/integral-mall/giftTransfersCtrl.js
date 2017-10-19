/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/platform/integral-mall/giftTransfersService'], function (app) {
     var app = angular.module('app');
    app.controller('giftTransfersCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','giftTransfers', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window,giftTransfers) {

        // query moudle setting
        $scope.querySeting = {
            items: [  {
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '创建日期'
            },{
                type: 'select',
                model: 'sendRdcList',
                selectedModel: 'deliverySelect',
                title: '发货仓库'
            }, {
                type: 'select',
                model: 'rejectedRdcList',
                selectedModel: 'warehouseSelect',
                title: '收货仓库'
            }, {
                type: 'select',
                model: 'stateList',
                selectedModel: 'stateSelect',
                title: '订单状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = giftTransfers.getThead();
        //日志头
        $scope.openModelThHeader = giftTransfers.getOpenModelThHeader();
        //查看头
        $scope.lookModelThHeader = giftTransfers.getLookModelThHeader();
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
        //查看bannerModel
        $scope.lookBannerModel={
            "taskId": "",
            "createTime": "",
            "state": "",
            "supplier": "",
            "chuHuoName":"",
            "receiverName": "",
            "wlDeptName": "",
            "thirdWlId": "",
        }
        var pmsSearch = giftTransfers.getSearch();
        pmsSearch.then(function (data) {
            if(data.code==-1){
                alert(data.message);
                return;
            }
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.warehouseSelect='-1';
            $scope.searchModel.stateSelect=-1;
            $scope.searchModel.deliverySelect='-1';
            //获取table数据
            get();
        }, function (error) {
            console.log(error)
        });
        //查询
        $scope.searchClick = function () {
            //重新设置分页从第一页开始
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
            delete opts.rejectedRdcList;
            delete opts.stateList;
            delete opts.sendRdcList;
            opts.sendRdcId=$scope.searchModel.deliverySelect;
            opts.rejectedRdcId=$scope.searchModel.warehouseSelect;
            opts.stateId=$scope.searchModel.stateSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = giftTransfers.getDataTable(
                '/giftAllotted/getGiftAllottedList1',
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
                if(data.code==-1){
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
                //设置分页
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
        // 获取日志table数据
        $scope.getOpenModelData = function (index,item){
            var promise = giftTransfers.getDataTable('/giftAllotted/getBgTaskLogList', {
                    param: {
                        query: {
                            id: item.id
                        }
                    }
                }
            );
            promise.then(function(data){
                $scope.openModelResult = data.grid;

            })
        }
        //查看
        $scope.lookCus=function(index,item){
            var promise = giftTransfers.getDataTable('/giftAllotted/getGiftAllottedList2', {
                    param: {
                        query: {
                            id: item.id
                        }
                    }
                }
            );
            promise.then(function(data){
                $scope.lookBannerModel = data.banner;
                $scope.lookModelResult=data.grid;
            })
        }
    }])
});