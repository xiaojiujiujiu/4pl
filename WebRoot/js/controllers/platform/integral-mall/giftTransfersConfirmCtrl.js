/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/platform/integral-mall/giftTransfersConfirmService'], function (app) {
     var app = angular.module('app');
    app.controller('giftTransfersConfirmCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','giftTransfersConfirm','uploadFileService', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window,giftTransfersConfirm,uploadFileService) {
        // 配置查询
        $scope.querySeting = {
            items: [  {
                type: 'text',
                model: 'goodsName',
                title: '礼品名称'
            }, {
                type: 'text',
                model: 'sku',
                title: '礼品编码'
            }, {
                type: 'select',
                model: 'giftTypeList',//下拉框数组
                selectedModel: 'giftTypeSelect',//设置下拉框选中状态id
                title: '礼品分类'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //tableͷ
        $scope.thHeader = giftTransfersConfirm.getThead0();
        $scope.addThHeader = giftTransfersConfirm.getThead1();
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
        //初始化查询
        var pmsSearch = giftTransfersConfirm.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query;
            $scope.searchModel.giftTypeSelect=-1;//设置下拉框默认选中
            //获取table数据
            //get();
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
        $scope.giftTransfersConfirmModel={
            rdcId:{
                id:'-1',
                select:[],
            },
            wlCompId:{
                id:'-1',
                select:[]
            },
        }

        //初始化添加调拨礼品下拉框的数据
        giftTransfersConfirm.getDataTable('/giftAllotted/getCkBaseInfoList', {param:{}})
            .then(function (data) {
                $scope.giftTransfersConfirmModel.rdcId.select=data.grid;
                $scope.giftTransfersConfirmModel.wlCompId.select=data.grid;
            })
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.giftType=$scope.searchModel.giftTypeSelect;//设置下拉框数据
            delete opts.giftTypeList;
            opts.id=$scope.giftTransfersConfirmModel.rdcId.id;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;

            var promise = giftTransfersConfirm.getDataTable(
                '/giftAllotted/getGiftStockList',
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
                if(data.code==-1){
                    alert(data.message);
                    $scope.result2 = [];
                    $scope.paging = {
                        totalPage: 1,
                        currentPage: 1,
                        showRows: $scope.paging.showRows,
                    };
                    return false;
                }
                $scope.result2 = data.grid;
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
        //确认调拨

        $scope.confirmTransfers= function () {
            $scope.skuDisabled=true;
            if($scope.giftTransfersConfirmModel.wlCompId.id=='-1'){
                alert('请选择收货仓库！');
                return;
            }
            if($scope.giftTransfersConfirmModel.wlCompId.id==$scope.giftTransfersConfirmModel.rdcId.id){
                alert('收货仓库不能与发货仓库相同！');
                return;
            }
            var isChecked=true;
            angular.forEach($scope.result1, function (item) {
                if(!item.count){
                    alert('调拨数量不能为空!');
                    isChecked=false;
                    return false;
                }
            });

            if(!isChecked) return;
            //确认调拨的时候传给后台的数据
            var opts = {
                query:{ giftList:$scope.result1,
                    sendId:$scope.giftTransfersConfirmModel.rdcId.id,
                    rejectedId:$scope.giftTransfersConfirmModel.wlCompId.id,
                },
            }
            giftTransfersConfirm.getDataTable('/giftAllotted/confirmAllotted', {param:opts})
                .then(function (data) {
                    if(data.status.code=="0000") {
                        alert(data.status.msg, function () {
                            $state.go('main.giftTransfers');
                        });
                    }else
                        alert(data.status.msg);
                });
        }
        //添加调拨礼品
        $scope.addTransfersGift = function () {
            if($scope.giftTransfersConfirmModel.rdcId.id=='-1'){
                alert('请选择发货仓库！');
                return;
            }
            $scope.giftTtle = "添加调拨礼品";

            $('#createTransfersGift').modal('show');
            get();
        }

        //删除
        $scope.deleteGift= function (i,item) {
            $scope.result1.splice(i,1);
        }
        //添加选择
        $scope.skuDisabled=false;
        $scope.isDisabled=true;
        $scope.addTransfers= function () {
            $scope.skuDisabled=true;
            $scope.isDisabled=false;
            var results = [];
            angular.forEach($scope.result2, function (item) {
                if (item.pl4GridCheckbox.checked) {
                    results.push(item);
                }
            });
            if(results.length==0){
                alert('请选择！');
                return;
            }
            $scope.result1=results;
            $("#createTransfersGift").modal('hide');
        }

    }])
});