/**
 * Created by xiaojiu on 2017/3/30.
 */
define(['../../../app','../../../services/platform/confirmInventOrder/confirmInventOrderService'], function (app) {
    var app = angular.module('app');
    app.controller('confirmInventOrderCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','confirmInventOrder', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window,confirmInventOrder) {

        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '盘点单号'
                //autocomplete: 'goodsName',
                //autoCallback: 'goodsNameAutocomplete',
                //automodel: 'goodsId'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '盘点日期'
            },{
                type: 'select',
                model: 'confirmStatus',
                selectedModel: 'confirmStatusSelect',
                title: '审核状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        $scope.thHeader=confirmInventOrder.getThead();

        function getData(){
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.confirmStatus = $scope.searchModel.confirmStatusSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = confirmInventOrder.getDataTable('/ckInventory/ckInventoryConfirmList',{
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
        //移动加权平均价分页下拉框
        $scope.pagingSelect = [
            {value: 5, text: 5},
            {value: 10, text: 10, selected: true},
            {value: 20, text: 20},
            {value: 30, text: 30},
            {value: 50, text: 50}
        ];
        //移动加权平均价分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };

        var pmsSearch = confirmInventOrder.getQuery();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.confirmStatusSelect = "-1";
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            $scope.storageSelectedRDC = '-1';
            // $scope.storageSelectedCDC = '-1';
            //获取table数据
            getData(true);
        }, function (error) {
            console.log(error)
        });
        //查询
        $scope.searchClick= function () {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            getData();
        }
        $scope.goToPage = function(){
            getData();
        }
        //查看
        $scope.isHide=false;
        $scope.openModelThHeader=confirmInventOrder.getOpenModelThHeader();
        $scope.getOpenModel = function(index,item){
            var promise = confirmInventOrder.getBatchDataTable('/ckInventory/detailInventory',{
                param: {
                    query: {
                        taskId: item.taskId,
                    }
                }
            });
            promise.then(function (data) {
                if(!!data.banner.refuseRemark){
                    $scope.isreFuseRemarkHide=false;
                }else {
                    $scope.isreFuseRemarkHide=true;
                }
                $scope.modalBanner = data.banner;
                $scope.openModelResult = data.grid;
            })
            $('#lookModal').modal('show');
        }

    }]);
});