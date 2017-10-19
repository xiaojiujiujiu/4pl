/**
 * Created by xiaojiu on 2016/11/23.
 */

define(['../../../app','../../../services/storage/specialStorage/newInSideChuOrderService'], function (app) {
     var app = angular.module('app');
    app.controller('newInSideChuOrderCtrl', ['$rootScope', '$scope','$timeout', '$state', '$sce', '$filter', 'HOST', '$window','newInSideChuOrder',
        function ($rootScope, $scope,$timeout, $state, $sce, $filter, HOST, $window,newInSideChuOrder) {
            $scope.querySeting = {
                items: [ {
                    type: 'select',
                    model: 'typeList',
                    selectedModel: 'typeListSelect',
                    title: '出库类型'
                },{
                    type: 'select',
                    model: 'personList',
                    selectedModel: 'statusListSelect',
                    title: '申请人'
                },{
                    type: 'text',
                    model: 'userRemarks',
                    title: '用途描述'
                }]
            };
        //table头
        $scope.thHeader = newInSideChuOrder.getThead();
        $scope.newHeader = newInSideChuOrder.getThead1();

        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        //添加分页对象
        $scope.addPaging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
            var pmsQuery = newInSideChuOrder.getSearch();
            pmsQuery.then(function (data) {
                $scope.searchModel = data.query;//设置当前作用域的查询对象
                $scope.searchModel.typeListSelect = -1;
                $scope.searchModel.statusListSelect = -1;
                $scope.searchModel.userRemarks='';
                //获取table数据
               // get();
            }, function (error) {
                console.log(error)
            });

        //查询
        $scope.searchClick = function () {
            //重新设置分页从第一页开始
            $scope.addPaging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            get();
        }


        $scope.addModel={
            goodsName:'',
            modelName:'',
            goodsBrandName:'',
            factoryCode:'',
            sku:'',
        }
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.addModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;

            var promise = newInSideChuOrder.getDataTable(
                '/ckInsideChuOrder/getCkGoodsList',//请求表格的数据接口
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
                //设置表格指令数据
                $scope.result = data.grid;
                //$scope.logModalResult = data.grid;
                //设置分页
                $scope.addPaging = {
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
        $scope.addGoToPage = function () {
            get();
        }


        // 添加商品
        $scope.addGift = function () {
            $('#createGift').modal('show');
            get();
        }
        var results=[];
        $scope.enterAdd = function () {
            angular.forEach($scope.result, function (item) {
                if (item.pl4GridCheckbox.checked) {
                    results.push(item);
                }
            });
            $scope.result2=results;
            $('#createGift').modal('hide');
        }
        //确认添加
        $scope.confirmImpor=function(){
            $scope.gridResult=[];
            angular.forEach($scope.result2, function (item) {
                if (item.pl4GridCheckbox.checked) {
                    $scope.gridResult.push(item);
                }
            });
            var flag=true;
            angular.forEach($scope.result2, function (item) {
                if (item.pl4GridCheckbox.checked && (item.count === "" || item.count === undefined)) {
                    alert('请填写申请数量');
                    flag=false;
                    return ;
                }
            });
            if(!flag){
                return ;
            }
            if($scope.gridResult.length==0){
                alert('请选择要导入的数据');
                return ;
            }
            if($scope.searchModel.typeListSelect == -1){
                alert('请选择出库类型');
                return ;
            }
            if($scope.searchModel.statusListSelect == -1){
                alert('请选择申请人');
                return ;
            }
            if($scope.searchModel.userRemarks == ''){
                alert('请填写用途描述');
                return ;
            }
            var opts = {
                query:{}
            }
            opts.query.user=$scope.searchModel.statusListSelect;
            opts.query.type=$scope.searchModel.typeListSelect;
            opts.query.userRemarks=$scope.searchModel.userRemarks;
            opts.query.list=$scope.gridResult;
            newInSideChuOrder.getDataTable('/ckInsideChuOrder/createOrEditCkInsideChuOrder', {param: opts})
                .then(function (data) {
                    if(data.status.code=="0000") {
                        alert(data.status.msg, function () {
                            $state.go('main.inSideChuOrder');
                        });
                    }else
                        alert(data.status.msg);
                });
        }


        //删除
        $scope.deleteCustom= function (i,item) {
            $scope.result2.splice(i,1);

        }
        //返回
        $scope.backHref = function(){
            $state.go('main.inSideChuOrder')
        }
    }])
});
