/**
 * Created by xiaojiu on 2017/2/5.
 */
define(['../../../app','../../../services/platform/information/goodsManageService'], function (app) {
    var app = angular.module('app');
    app.controller('goodsManageCtrl', ['$rootScope', '$scope','$timeout', '$state', '$sce', '$filter', 'HOST', '$window','goodsManage',
        function ($rootScope, $scope,$timeout, $state, $sce, $filter, HOST, $window,goodsManage) {

            // 配置查询
            $scope.querySeting = {
                items: [ {
                    type: 'select',
                    model: 'customerId',//下拉框数组
                    selectedModel: 'customerListSelect',//设置下拉框选中状态id
                    title: '客户'
                }, {
                    type: 'text',
                    model: 'product',
                    title: '商品品类'
                }, {
                    type: 'text',
                    model: 'name',
                    title: '商品名称'
                }, {
                    type: 'text',
                    model: 'goodsCode',
                    title: '商品编码'
                }, {
                    type: 'text',
                    model: 'serialNumber',
                    title: '出厂编码'
                }, {
                    type: 'text',
                    model: 'supplier',
                    title: '供应商'
                }],
                btns: [{
                    text: $sce.trustAsHtml('查询'),
                    click: 'searchClick'
                }]
            };
            //table头
            $scope.thHeader = goodsManage.getThead();
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
            var pmsSearch = goodsManage.getSearch();
            pmsSearch.then(function (data) {
                $scope.searchModel = data.query;
                $scope.searchModel.customerListSelect='-1';//设置下拉框默认选中
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

            $scope.exParams = '';
            function get() {
                //获取选中 设置对象参数
                var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
                opts.customerId=$scope.searchModel.customerListSelect;//设置下拉框数据
                opts.pageNo = $scope.paging.currentPage;
                opts.pageSize = $scope.paging.showRows;
                $scope.exParams = $filter('json')({query: opts});
                //$scope.exParams ={query: opts};
                var promise = goodsManage.getDataTable(
                    '/goods/queryGoodsList',//请求表格的数据接口
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
                    $scope.result.total=data.total;

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

            //定义表单模型
            $scope.ruleModel={
                barCodeType:'',
                id:'',
                length :'',
                width :'',
                high :'',
                volume :'',
                kg:'',
                maxQuantity:'',
                batchStatus:'',
                manufactureDateStatus:'',
                expirationDateStatus:'',
                goodsBarSerialNumber:''
            }
            //切换显示内容
            $scope.isHide=false;
            $scope.isHide2=true;
            $scope.isChecked=function(){
                if($scope.ruleModel.barCodeType=="2"){
                    $scope.isHide=true;
                    $scope.isHide2=false;
                }else{
                    $scope.isHide=false;
                    $scope.isHide2=true;
                }
            }
            //切换Disabled状态
            $scope.disabled=true;
            $scope.isDisabled=function(){
                if($scope.ruleModel.batchStatus==="1"){
                    $scope.disabled=false;
                }else {
                    $scope.disabled=true;
                    $scope.ruleModel.goodsBarSerialNumber='';
                }
            }
            // 确认新增
            $scope.enterAdd = function () {
                if(parseFloat($scope.ruleModel.length)>100 || parseFloat($scope.ruleModel.width)>100 || parseFloat($scope.ruleModel.high)>100){
                    alert("请输入正确范围的长宽高");
                    return false;
                }
                if($scope.ruleModel.barCodeType==1 &&$scope.ruleModel.batchStatus==1){
                   if($scope.ruleModel.manufactureDateStatus==false && $scope.ruleModel.expirationDateStatus==false){
                       alert('请选择维护批次属性的生产日期或失效日期');
                       return;
                   }
                }
                if($scope.ruleModel.barCodeType==2 && $scope.ruleModel.batchStatus==1){
                    if($scope.ruleModel.goodsBarSerialNumber==""){
                        alert('请选择维护批次属性的序列号');
                        return;
                    }
                    var reg=/[\u4e00-\u9fa5]/g;
                    if(reg.test($scope.ruleModel.goodsBarSerialNumber)){
                        alert("商品条码不能为汉字");
                        return false;
                    }
                }
                var opts = angular.extend({},  $scope.ruleModel, {});//克隆出新的对象，防止影响scope中的对象
                opts.customerList='';
                var sendParams = {
                    param: {
                        query:opts
                    }
                }
                goodsManage.getDataTable( '/goods/updateGoods', sendParams)
                    .then(function (data) {
                        alert(data.status.msg)
                        if (data.status.code == "0000") {
                            get();
                            $('#createGift').modal('hide');
                        }
                    })
            }
            //修改
            $scope.updateGift= function (i,item) {
                $scope.giftTtle = "编辑商品属性";
                //配置的是初始化接口从服务器获取数据
                goodsManage.getDataTable('/goods/initUpdateGoods', {param: {query: {id: item.ID}}})
                    .then(function (data) {
                        //服务器通过id返回数据并绑定到修改的表单中
                        $scope.ruleModel.id= data.query.ID;
                        $scope.ruleModel.length= data.query.length;
                        $scope.ruleModel.width= data.query.width;
                        $scope.ruleModel.high= data.query.high;
                        $scope.ruleModel.volume= data.query.volume;
                        $scope.ruleModel.kg= data.query.kg;
                        $scope.ruleModel.maxQuantity= data.query.maxQuantity;
                        $scope.ruleModel.batchStatus= data.query.batchStatus;
                        $scope.ruleModel.barCodeType= data.query.barCodeType;
                        $scope.ruleModel.manufactureDateStatus= data.query.manufactureDateStatus;
                        $scope.ruleModel.expirationDateStatus= data.query.expirationDateStatus;
                        $scope.ruleModel.goodsBarSerialNumber= data.query.goodsBarSerialNumber;
                        if($scope.ruleModel.barCodeType=="2"){
                            $scope.isHide=true;
                            $scope.isHide2=false;
                        }else if($scope.ruleModel.barCodeType=="1"){
                            $scope.isHide=false;
                            $scope.isHide2=true;
                        }
                        if($scope.ruleModel.batchStatus===1){
                            $scope.disabled=false;
                        }else {
                            $scope.disabled=true;
                            $scope.ruleModel.goodsBarSerialNumber='';
                        }
                    })

            }
            // 计算体积
            $scope.getVolume = function() {
                var length=parseFloat($scope.ruleModel.length);
                var width=parseFloat($scope.ruleModel.width);
                var high=parseFloat($scope.ruleModel.high);
                if(length>100){
                    alert("请输入正确范围的长度");
                    return false;
                }else if(width>100){
                    alert("请输入正确范围的宽度");
                    return false;
                }else if(high>100){
                    alert("请输入正确范围的高度");
                    return false;
                }

                var num=(parseFloat($scope.ruleModel.length)
                    * parseFloat($scope.ruleModel.width)
                    * parseFloat($scope.ruleModel.high)).toFixed(4);
                if(!isNaN(num)){
                    $scope.ruleModel.volume =num;
                }else{
                    $scope.ruleModel.volume=0;
                }
            }
        }])
});