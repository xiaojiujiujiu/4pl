/**
 * author wusheng.xu
 * date 16/4/19
 */
define(['../../../app','../../../services/storage/goods-allocation/goodsAlloQueryService'], function (app) {
     var app = angular.module('app');
    app.controller('goodsAlloQueryCtrl', ['$scope', '$sce', '$timeout', 'goodsAlloQuery', function ($scope, $sce, $timeout, goodsAlloQuery) {


        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'select',
                model: 'customerID',
                selectedModel: 'customerIDSelect',
                title: '客户'
            }, {
                type: 'text',
                model: 'brandName',
                title: '商品品类'
            }, {
                type: 'text',
                model: 'goodsName',
                title: '商品名称'
            }, {
                type: 'text',
                model: 'sku',
                title: '商品编码'
            }, {
                type: 'text',
                model: 'factoryCode',
                title: '出厂编码'
            }, {
                type: 'text',
                model: 'supliers',
                title: '供应商'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //theadr
        $scope.thHeader = goodsAlloQuery.getThead();
        $scope.allTHeader = goodsAlloQuery.getAllTHeader();
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
        var pmsQuery = goodsAlloQuery.getQuery();
        pmsQuery.then(function (data) {
            $scope.searchModel = data.query;//设置当前作用域的查询对象
            //下拉框model
            $scope.searchModel.customerIDSelect = -1;
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
        $scope.exGoodsAlloParam={};
        function get(){
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.customerID = $scope.searchModel.customerIDSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exGoodsAlloParam={query:opts};
            var promise = goodsAlloQuery.getDataTable({param: {query:opts}});
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
                //重置paging 解决分页指令不能监听对象问题
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function (error) {
                console.log(error);
            });
        }
        //查看明细
        $scope.checkDetail= function (i,item) {
            goodsAlloQuery.getDataTable({param: {query: {
                    customerId:item.customerId,
                    suppliers:item.supliers,
                    sku:item.sku
                }}},'/ckGoodsLocation/queryDetailList')
                .then(function (data) {
                    if(data.status.code=="0000") {
                        $scope.alloResult = data.grid;
                        $('#alloModal').modal();
                    }else {
                        alert(data.status.msg);
                    }
                },function (error) {
                    console.log(error);
                });
        }
        $scope.goToPage= function () {
            get();
        }
    }]);
});