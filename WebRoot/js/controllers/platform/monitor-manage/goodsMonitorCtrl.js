/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/platform/monitor-manage/goodsMonitorService'], function (app) {
     var app = angular.module('app');
    app.controller('goodsMonitorCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','goodsMonitor', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window,goodsMonitor) {
    	 
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'goodsName',
                title: '商品名称'
                //autocomplete: 'goodsName',
                //autoCallback: 'goodsNameAutocomplete',
                //automodel: 'goodsId'
            }, {
                type: 'select',
                model: 'customerId',
                selectedModel: 'customerIdSelect',
                title: '客户'
            }, {
                type: 'text',
                model: 'goodsType',
                title: '品类'
            },{
                type: 'text',
                model: 'brand',
                title: '品牌名称'
            }, {
                type: 'text',
                model: 'model',
                title: '规格型号'
            }, {
                type: 'text',
                model: 'sku',
                title: '商品编码'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //选择类型
        $scope.radioInside='radio1';
        $scope.radioInsideText='移动加权平均价';
        // default flag
        $scope.flag = true;
        $scope.thHeader=goodsMonitor.getThead();
        $scope.exParams = '';
        $scope.exAction = '/goodsMonitor/impToExcel';
        // 默认
        $scope.radioInsideChange= function (item) {
        	 $scope.paging = {
        	            totalPage: 1,
        	            currentPage: 1,
        	            showRows: 30,
        	        };
            if($scope.radioInside=='radio1'){
            	 $scope.exAction='/goodsMonitor/impToExcel';
                $scope.radioInsideText='移动加权平均价';
                //加权平均价格theadr
                $scope.thHeader=goodsMonitor.getThead();
                $scope.flag = true;
               
                getData($scope.flag)
            } else{
            	$scope.exAction='../../goodsMonitor/impToExcels';
                $scope.radioInsideText='批次价格';
                //批次价格theadr
                $scope.thHeader=goodsMonitor.getBatchThead();
                $scope.flag = false;
                getData($scope.flag)
            }

        };
        function getData( flag ){
//            var prosmise  = registerList.getQuery();
//            promise.then(function(data){
        	var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.customerId = $scope.searchModel.customerIdSelect;
           // opts.model = $scope.searchModel.modelSelect;
            opts.areaId = $scope.searchModel.areaIdSelect;
          //  opts.goodsType = $scope.searchModel.goodsTypeSelect;
            if(flag==true){
                // 移动加权平均价
            	  //获取选中 设置对象参数
                 opts.pageNo = $scope.paging.currentPage;
                 opts.pageSize = $scope.paging.showRows;
                 $scope.exParams = $filter('json')({query: opts});
                 var promise = goodsMonitor.getDataTable('/goodsMonitor/query_goods',{
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
                    $scope.paging = {
                        totalPage: data.total,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };
                    // $scope.paging.totalPage = data.total;
                }, function (error) {
                    console.log(error);
                });
            }else{
                // 批次价格
            	  //获取选中 设置对象参数
                 opts.pageNo = $scope.paging.currentPage;
                 opts.pageSize = $scope.paging.showRows;
                 $scope.exParams = $filter('json')({query: opts});
                 var promise = goodsMonitor.getBatchDataTable({
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
                    $scope.paging = {
                            totalPage: data.total,
                            currentPage: $scope.paging.currentPage,
                            showRows: $scope.paging.showRows,
                        };
                    // console.log($scope.paging)

                    // $scope.paging.totalPage = data.total;
                }, function (error) {
                    console.log(error);
                });
            }
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
     // 批次价格分页下拉框
        $scope.batchPagingSelect = [
            {value: 5, text: 5},
            {value: 10, text: 10, selected: true},
            {value: 20, text: 20},
            {value: 30, text: 30},
            {value: 50, text: 50}
        ];
        //批次价格分页对象
        $scope.batchLogPaging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        var pmsSearch = goodsMonitor.getQuery();
        pmsSearch.then(function (data) {
            // console.log(data)
            $scope.searchModel = data.query; //设置当前作用域的查询对象
           // $scope.searchModel.goodsType.splice(0,0,{id:-1,name:'全部'});
            $scope.searchModel.customerIdSelect = -1;
            //$scope.searchModel.modelSelect = -1;
            $scope.searchModel.areaIdSelect = -1;
           // $scope.searchModel.goodsTypeSelect = -1;
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
            if($scope.flag==true){
            	getData(true);
            }else{
            	getData(false);
            }
        }
        $scope.goToPage = function(){
        	if($scope.flag==true){
            	getData(true);
            }else{
            	getData(false);
            }
        }
        $scope.openModelThHeader=goodsMonitor.getOpenModelThHeader();
        $scope.getOpenModel = function(index,item){
            var promise = goodsMonitor.getBatchDataTable('/goodsMonitor/query_goodsBatch',{
                 param: {
                     query: {
                        ckId: item.ckId,
                        customerId: item.customerId,
                        sku: item.sku
                     }
                 }
            });
            promise.then(function (data) {
                $scope.modalBanner = data.banner;
                $scope.openModelResult = data.grid;
            })
            $('#lookModal').modal('show');
        }
        //$scope.dropDownList = [];
        //$scope.goodsNameAutocomplete= function (newValue) {
        //    var opts = angular.extend({}, $scope.searchModel, {});
        //    opts.userName="z";
        //  	return goodsMonitor.test({
        //        param: {
        //            query: opts
        //        }
        //    });
        //};
          
          
    }]);
});