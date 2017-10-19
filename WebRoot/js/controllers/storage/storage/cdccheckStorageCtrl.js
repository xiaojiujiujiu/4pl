/**
 * Created by xuwusheng on 15/11/23.
 */
'use strict';
define(['../../../app','../../../services/storage/storage/cdccheckStorageService'], function (app) {
    var app = angular.module('app');
    app.controller('cdccheckStorageCtrl',['$scope','$state','$stateParams','$sce','$window','cdccheckStorage','$interval',function ($scope,$state,$stateParams,$sce,$window,cdccheckStorage,$interval) {
        $scope.querySeting = {
            items: [
                { type: 'text', model: 'goodsStyle', title: '规格型号' ,autofocus:true},
            ],
            btns: [
                { text: $sce.trustAsHtml('查询'), click: 'searchClick' }]
        };
        $scope.banner={};
        //table头
        $scope.thHeader = cdccheckStorage.getThead();


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
        var pmsSearch = cdccheckStorage.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query;//设置当前作用域的查询对象
            //get();
        }, function (error) {
            console.log(error)
        });

        //查询
        $scope.searchClick = function () {
//            //设置默认第一页
//            $scope.paging = {
//                totalPage: 1,
//                currentPage: 1,
//                showRows: $scope.paging.showRows,
//            };
            getPosition();
            $scope.searchModel.goodsStyle='';
        }
        function getPosition() {
        	if($scope.searchModel.goodsStyle=='' || $scope.searchModel.goodsStyle==null){
        		return;
        	}
            var goodsStyle=$scope.searchModel.goodsStyle;
            var result=[];//点击查询时，返回的结果集
            var first=null;
            output= $scope.result;
            for(var i=0;i<output.length;i++){
            	if(goodsStyle == output[i]['goodsStyle']){
            		first=output[i];
            		output.splice(i,1)
            		break;
            	}
            }
            if(first != null){
            	output.splice(0,0,first);
            	for(var i=0;i<output.length;i++){
            		//重新设置序号
            		output[i]["pl4GridIndex"]=i;
            	}
            }
            var  inputDom;
            inputDom=document.getElementById('inCount');
            if(!!inputDom){
                if(inputDom instanceof  Array){
                    inputDom=inputDom[0];
                }
                inputDom.focus();
            }
        }
        function  getBanner(){
            var opts = {};
            opts.taskId = $stateParams['taskId'];
            var promise = cdccheckStorage.getDataTable({param: {query: opts}}, '/inGoodsOrder/inGoodsOrderDetailBanner');
            promise.then(function (data){
                if(data.status.code==="0000") {
                    $scope.banner = data.banner;
                }
            })
        }
        getBanner()
        $scope.result=[];
        var output = [], keys = [];
        function get() {
            //获取选中 设置对象参数
           var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.taskId = $stateParams['taskId'];
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = cdccheckStorage.getDataTable({param: {query: opts}});
            promise.then(function (data) {
                if(data.status.code==="0000"){
//                    angular.forEach(data.grid, function (item) {
//                        var key = item['orderItemId'];
//                        if (keys.indexOf(key) === -1) {
//                            keys.push(key);
//                            output.push(item);
//                        }
//                    });
//                    $scope.result=output;
//                    //获取光标定位
//                    var  inputDom;
//                    $scope.intervalGetId= $interval(function(){
//                        inputDom=document.getElementById('inCount');
//                        console.log(inputDom);
//                        if(!!inputDom){
//                            if(inputDom instanceof  Array){
//                                inputDom=inputDom[0];
//                            }
//                            inputDom.focus();
//                            $interval.cancel($scope.intervalGetId);
//                        }
//                    },500)
                	
                	$scope.result=data.grid;
                	output=data.grid;
                    //重置paging 解决分页指令不能监听对象问题
                    $scope.paging = {
                        totalPage: data.total,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };
                }

            }, function (error) {
                console.log(error);
            });

        }
        get();
        $scope.skuKeyUp= function () {
            var reg=/[\u4E00-\u9FA5\uF900-\uFA2D]/g;
            $scope.pageModel.SKU=$scope.pageModel.SKU.replace(reg,'');
        }
       //get();

        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
        //导航
        $scope.navClick= function (i) {
            switch (i){
                case 0:
                    $state.go('main.cdctakegoods');
                    break;
                case 1:
                    $state.go('main.cdccheckstorage',{taskId:$stateParams['taskId']});
                    break;
                case 2:
                    $state.go('main.cdctakegoodsconfirm',{taskId:$stateParams['taskId']});
                    break;
            }
        }
        //定义表单模型
        $scope.goodsDifferenceModel={
            packageDamage:'',
            damage:'',
            lost:'',
            id:'',
            i:'',
            item:'',
        }
        //编辑差异
        //$scope.editDate=function(i,item){
        //    $scope.goodsDifferenceModel.i = i;
        //    $scope.goodsDifferenceModel.item =item;
        //    $scope.goodsDifferenceModel.id=item.id;
        //    var opts={};
        //         opts.id=item.id;
        //    var sendParams = {
        //        param: {
        //            query:opts
        //        }
        //    }
        //    cdccheckStorage.getDataTable(sendParams, '/inGoodsOrder/getInGoodsDiffCountDetail')
        //        .then(function (data) {
        //                $scope.goodsDifferenceModel.packageDamage = data.banner.packageDamage;
        //                $scope.goodsDifferenceModel.damage = data.banner.damage;
        //                $scope.goodsDifferenceModel.lost = data.banner.lost;
        //                item.inCount =data.banner.inCount;
        //                item.inDiffCount =data.banner.inDiffCount;
        //        })
        //}
        ////确认编辑
        //$scope.enterAdd=function(){
        //    var opts = angular.extend({},  $scope.goodsDifferenceModel, {});//克隆出新的对象，防止影响scope中的对象
        //    var sendParams = {
        //        param: {
        //            query:opts
        //        }
        //    }
        //    cdccheckStorage.getDataTable(sendParams, '/inGoodsOrder/editInGoodsCount')
        //        .then(function (data) {
        //            alert(data.status.msg)
        //            if (data.status.code == "0000") {
        //                $scope.goodsDifferenceModel.packageDamage='';
        //                $scope.goodsDifferenceModel.damage='';
        //                $scope.goodsDifferenceModel.lost='';
        //                $('#editDate').modal('hide');
        //                $scope.editDate($scope.goodsDifferenceModel.i,$scope.goodsDifferenceModel.item)
        //            }
        //        })
        //}

        $scope.parseInt = parseInt;
        //收货完成
        $scope.takeGoodsDown= function () {
        	
            //if(confirm('确定收货？')) {
                var takeGoodsDowns = [];
                var flag=true;
                 var reg = new RegExp("^[0-9]*$");
                angular.forEach($scope.result, function (item,i) {
                    if (parseInt(item.inCount) != parseInt(item.goodsCount)) {
                        alert('收货数量错误，应收数量和实收数量保持一致！')
                        flag=false;
                        return;
                    }
                    if(!reg.test(item.inCount)){
                                alert("请输入正确的收货数量！")
                        flag=false;
                        return;
                            }
                        takeGoodsDowns.push(item);
                });
                if(!flag){
                    return;
                }
                var opts = {
                    banner: {taskId: $scope.banner.taskId},
                    grid: takeGoodsDowns
                }
                var promise = cdccheckStorage.getDataTable({param: opts}, '/inGoodsOrder/inGoodsOrderSuccess');
                promise.then(function (data) {
                    alert(data.status.msg);
                    if(data.status.code=="0000"){
                       // get();
                        $state.go('main.inGoodsOrderList')
                        //$scope.pageModel.SKU="";
                    }

                }, function (error) {
                    console.log(error);
                });
           // }
        }
        //返回
        $scope.back= function () {
            $window.history.back();
        }
        
        $scope.clearNoNum= function (index, obj) {
        	var inCount= obj.inCount;
        	obj.inCount=inCount.replace(/\D/g,'');
        }
        
    }]);
});