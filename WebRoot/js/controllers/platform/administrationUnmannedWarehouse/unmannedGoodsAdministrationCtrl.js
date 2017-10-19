/**
 * Created by xiaojiu on 2017/5/27.
 */
define(['../../../app','../../../services/platform/administrationUnmannedWarehouse/unmannedGoodsAdministrationService'], function (app) {
    var app = angular.module('app');
    app.controller('unmannedGoodsAdministrationCtrl', ['$rootScope', '$scope','$timeout', '$state', '$sce', '$filter', 'HOST', '$window','unmannedGoodsAdministration',
        function ($rootScope, $scope,$timeout, $state, $sce, $filter, HOST, $window,unmannedGoodsAdministration) {

            // 配置查询
            $scope.querySeting = {
                items: [  {
                    type: 'text',
                    model: 'fsCode',
                    title: '查找无人仓',
                    autocomplete: 'fsCode',
                    autoCallback: 'ckCodeAutocomplete',
                    automodel: 'fsCode'
                },{
                    type: 'text',
                    model: 'goodsStyle',
                    title: '规格型号'
                }, {
                    type: 'text',
                    model: 'serialNumber',
                    title: '出厂编码'
                }, {
                    type: 'text',
                    model: 'brand',
                    title: '商品品牌'
                }, {
                    type: 'text',
                    model: 'product',
                    title: '商品品类'
                }, {
                    type: 'text',
                    model: 'supplier',
                    title: '供应商'
                }, {
                    type: 'text',
                    model: 'goodsCode',
                    title: '商品编码'
                }],
                btns: [{
                    text: $sce.trustAsHtml('查询'),
                    click: 'searchClick'
                }]
            };
            //table头
            $scope.thHeader = unmannedGoodsAdministration.getThead();
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
            var pmsSearch = unmannedGoodsAdministration.getSearch();
            pmsSearch.then(function (data) {
                $scope.searchModel = data.query;
            }, function (error) {
                console.log(error)
            });
            //自动补全无人仓
            $scope.dropDownList = [];
            $scope.ckCodeAutocomplete= function (newValue) {
                var opts = angular.extend({}, $scope.searchModel, {});
                opts.fsCode=newValue;
                //opts.cooperationState = $scope.searchModel.cooperationStateSelect;
                return unmannedGoodsAdministration.autoCompletion({
                    param: {
                        query: opts
                    }
                });
            };

            //跳转添加商品页面
            $scope.hrefAddGoods=function(){
                if(!!$scope.searchModel.fsCode){
                    $state.go('main.unmannedGoodsAdd',{fsCode:$scope.searchModel.fsCode});
                }else {
                    alert("请先选择无人仓！")
                }
            }

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
                opts.giftType=$scope.searchModel.giftTypeSelect;//设置下拉框数据
                opts.pageNo = $scope.paging.currentPage;
                opts.pageSize = $scope.paging.showRows;
                var promise = unmannedGoodsAdministration.getDataTable(
                    '/fsGoods/fsGoodsList',//请求表格的数据接口
                    {
                        param: {
                            query: opts
                        }
                    }
                );
                promise.then(function (data) {
                    // $scope.query =data.query;
                    //如果返回code==-1表示服务器出错
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
                    //设置表格指令数据
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

        }])
});