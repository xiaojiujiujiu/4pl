/**
 * Created by xiaojiu on 2017/5/27.
 */
define(['../../../app','../../../services/platform/administrationUnmannedWarehouse/goodsLocationAdministrationService'], function (app) {
    var app = angular.module('app');
    app.controller('goodsLocationAdministrationCtrl', ['$rootScope', '$scope','$timeout', '$state', '$sce', '$filter', 'HOST', '$window','goodsLocationAdministration',
        function ($rootScope, $scope,$timeout, $state, $sce, $filter, HOST, $window,goodsLocationAdministration) {

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
            $scope.thHeader = goodsLocationAdministration.getThead();
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
            //自动补全无人仓
            $scope.dropDownList = [];
            $scope.ckCodeAutocomplete= function (newValue) {
                var opts = angular.extend({}, $scope.searchModel, {});
                opts.fsCode=newValue;
                //opts.cooperationState = $scope.searchModel.cooperationStateSelect;
                return goodsLocationAdministration.autoCompletion({
                    param: {
                        query: opts
                    }
                });
            };
            //初始化查询
            var pmsSearch = goodsLocationAdministration.getSearch();
            pmsSearch.then(function (data) {
                $scope.searchModel = data.query;
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
                opts.pageNo = $scope.paging.currentPage;
                opts.pageSize = $scope.paging.showRows;
                var promise = goodsLocationAdministration.getDataTable(
                    '/huoWeiManager/queryGoodsManagerList',//请求表格的数据接口
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
            //货位model
            $scope.locationmodel={
                goodsName:'',
                model:'',
                huoWeiCodeList:[],
                select1: {
                    data: [{id:'-1',name:'选择柜号'}],
                }
                
            }
            //查看设置货位
            $scope.lookLocation=function(i,item){
                $scope.locationmodel.goodsName=item.name;
                $scope.locationmodel.model=item.goodsStyle;
                var o = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
                $rootScope.fsCode= o.fsCode;
                goodsLocationAdministration.getDataTable(
                    '/huoWeiManager/findGuiNo',
                    {
                        param: {
                            query: {
                                goodsCode:item.goodsCode,
                                name:item.name,
                                fsCode:$rootScope.fsCode
                            }
                        }
                    }
                ).then(function(data){
                   $scope.locationmodel.huoWeiCodeList=data.query.huoWeiCode;
                })
            }
            //添加货位
            $scope.submitData = {
                itemList: [
                    { 'containerNumber': '-1', 'line': '-1', 'column': '-1' }
                ]
            };
            $scope.addItem = function () {
                $scope.submitData.itemList.push({
                    'containerNumber': '-1',
                    'line': '-1',
                    'column': '-1'
                })
            }
            //删除数组
            $scope.deleteArr=function(i){
                $scope.submitData.itemList.splice(i,1);
            }
            $scope.getSelectData=[];
            $scope.setSelectDataFun = function(index,selectNum,data){
                if(!!$scope.getSelectData[index]){
                    $scope.getSelectData[index][selectNum]=data;
                }else{
                    $scope.getSelectData[index]={};
                    $scope.getSelectData[index][selectNum]=data;
                }
            }

            //设置货位
            $scope.setupLocation=function(i,item){
                $rootScope.id=item.id;
                $rootScope.cost=item.cost;
                $scope.locationmodel.goodsName=item.name;
                $scope.locationmodel.model=item.goodsStyle;
                var o = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
                $rootScope.fsCode= o.fsCode;
                goodsLocationAdministration.getDataTable(
                    '/huoWeiManager/setContainer',
                    {
                        param: {
                            query: {
                                goodsCode:item.goodsCode,
                                name:item.name,
                                fsCode:$rootScope.fsCode
                            }
                        }
                    }
                ).then(function(data){
                    $scope.locationmodel.huoWeiCodeList=data.query.huoWeiCode;
                    $scope.locationmodel.select1.data = data.query.containerNumber;//获取柜号下拉框
                })
            }
            //获取行号
            $scope.getLine=function(index,containerNumber){
                var o = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
                $rootScope.fsCode= o.fsCode;
                goodsLocationAdministration.getDataTable(
                    '/huoWeiManager/setLine',
                    {
                        param: {
                            query: {
                                containerNumber:containerNumber,
                                fsCode:$rootScope.fsCode
                            }
                        }
                    }
                ).then(function(data){
                    $scope.setSelectDataFun(index,'select2',data.query.line);
                })
            }
            //获取列号
            $scope.getColumn=function(index,containerNumber,line){
                var o = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
                $rootScope.fsCode= o.fsCode;
                goodsLocationAdministration.getDataTable(
                    '/huoWeiManager/setColumn',
                    {
                        param: {
                            query: {
                                containerNumber:containerNumber,
                                line:line,
                                fsCode:$rootScope.fsCode
                            }
                        }
                    }
                ).then(function(data){
                    $scope.setSelectDataFun(index,'select3',data.query.column);//
                })
            }
            $scope.changeSelectStatus=function(index,containerNumber,line,column){
                var o = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
                $rootScope.fsCode= o.fsCode;
                goodsLocationAdministration.getDataTable(
                    '/huoWeiManager/changeSelectStatus',
                    {
                        param: {
                            query: {
                                containerNumber:containerNumber,
                                line:line,
                                fsCode:$rootScope.fsCode,
                                column:column
                            }
                        }
                    }
                ).then(function(data){
//                    alert(data.status.msg);
//                    get();
                })
            }
            $scope.deleteHuoWeiNo=function(index,containerNumber,line,column){
                var o = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
                $rootScope.fsCode= o.fsCode;
                goodsLocationAdministration.getDataTable(
                    '/huoWeiManager/deleteSelectStatus',
                    {
                        param: {
                            query: {
                                containerNumber:containerNumber,
                                line:line,
                                fsCode:$rootScope.fsCode,
                                column:column
                            }
                        }
                    }
                ).then(function(data){
//                    alert(data.status.msg);
//                    get();
                })
            }
            //确定设置货位
            $scope.enterSetupLocation=function(){
                var opts = angular.extend({}, $scope.submitData, {}); //克隆出新的对象，防止影响scope中的对象
                var o = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
                opts.fsCode= o.fsCode;
                opts.cost=$rootScope.cost;
                opts.id=$rootScope.id;
                goodsLocationAdministration.getDataTable(
                    '/huoWeiManager/confirmSetHuoWei',
                    {
                        param: {
                            query: opts
                        }
                    }
                ).then(function(data){
                    alert(data.status.msg);
                    if(data.status.code=="0000"){
                       $("#setupLocation").modal("hide");
                       get();
                        $scope.locationmodel={
                            select1: {
                                data: [{id:'-1',name:'选择柜号'}],
                            }
                        }
                        $scope.submitData = {
                            itemList: [
                                { 'containerNumber': '-1', 'line': '-1', 'column': '-1' }
                            ]
                        };
                        $scope.getSelectData=[];
                   }
                   
                })
            }
            //取消清空数据
            $scope.resetting=function(){
                $scope.locationmodel={
                    select1: {
                        data: [{id:'-1',name:'选择柜号'}],
                    }
                }
                $scope.submitData = {
                    itemList: [
                        { 'containerNumber': '-1', 'line': '-1', 'column': '-1' }
                    ]
                };
                $scope.getSelectData=[];
            }
            //分页跳转回调
            $scope.goToPage = function () {
                get();
            }

        }])
});