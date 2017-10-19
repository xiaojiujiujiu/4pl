/**
 * Created by xiaojiu on 2017/5/27.
 */
define(['../../../app','../../../services/platform/administrationUnmannedWarehouse/unmannedGoodsAddService'], function (app) {
    var app = angular.module('app');
    app.controller('unmannedGoodsAddCtrl', ['$rootScope', '$scope','$timeout','$stateParams', '$state', '$sce', '$filter', 'HOST', '$window','unmannedGoodsAdd',
        function ($rootScope, $scope,$timeout,$stateParams, $state, $sce, $filter, HOST, $window,unmannedGoodsAdd) {

            // 配置查询
            $scope.querySeting = {
                items: [
//                        {
//                    type: 'text',
//                    model: 'fsCode',
//                    title: '查找无人仓'
//                },
                        {
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
            $scope.thHeader = unmannedGoodsAdd.getThead();
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
            var opts ={
                fsCode:$stateParams['fsCode']
            }
            var pmsSearch = unmannedGoodsAdd.getDataTable('/fsGoods/initAddGoods',{param: {query: opts}});
            pmsSearch.then(function (data) {
                $scope.searchModel = data.query;
//                if(data.query.ckState==2){
//            		alert("此无人仓已经冻结不允许进行操作！");
//            	}
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
                opts.pageNo = $scope.paging.currentPage;
                opts.pageSize = $scope.paging.showRows;
                opts.fsCode=$stateParams['fsCode'];
                var promise = unmannedGoodsAdd.getDataTable(
                    '/fsGoods/goodsList',//请求表格的数据接口
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
//            get()
            //分页跳转回调
            $scope.goToPage = function () {
                get();
            }
            //确认添加
            $scope.confirmAdd=function(){
                var ids='';
                //获取选中
                angular.forEach($scope.result, function (item) {
                    if (item.pl4GridCheckbox.checked) {
                        ids+=item.id+',';
                    }
                });

                if(ids!=''){
                    ids = ids.slice(0,ids.length-1);
                    unmannedGoodsAdd.getDataTable('/fsGoods/saveFsGoods', {param:{query:{goodIds:ids,fsCode:$stateParams['fsCode']}}})
                        .then(function(data){
                            if(data.status.code=="0000"){
                                alert(data.status.msg);
                                $state.go('main.unmannedGoodsAdministration');
                            }
                        })
                }else {
                    alert('请选择添加的数据!');
                }
            }
        }])
});