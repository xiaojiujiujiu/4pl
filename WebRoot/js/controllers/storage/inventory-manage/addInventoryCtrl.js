/**
 * Created by xiaojiu on 2016/11/7.
 */
define(['../../../app','../../../services/storage/inventory-manage/addInventoryService'], function (app) {
     var app = angular.module('app');
    app.controller('addInventoryCtrl', ['$rootScope','$scope', '$sce', '$timeout', 'addInventory','$window', function ($rootScope,$scope, $sce, $timeout, addInventory,$window) {


        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'brand',
                title: '品牌'
            },{
                type: 'text',
                model: 'product',
                title: '品类'
            },{
                type: 'text',
                model: 'supplier',
                title: '供应商'
            },{
                type: 'text',
                model: 'goodsCode',
                title: '商品编码'
            },{
                type: 'text',
                model: 'name',
                title: '商品名称'
            },{
                type: 'text',
                model: 'serialNumber',
                title: '出厂编码'
            },{
                type: 'text',
                model: 'goodsStyle',
                title: '规格型号'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //theadr
        $scope.thHeader = addInventory.getThead();
        $scope.inventoryAssignedTasks={
            personList:{
                id:-1,
                select:[],
            }
        }
        var pmsQuery = addInventory.getQuery();
        pmsQuery.then(function (data) {
            $scope.searchModel = data.query;//设置当前作用域的查询对象
            /*$scope.inventoryAssignedTasks.personList.select=data.query.personList;
            //下拉框model
            $scope.searchModel.customerListSelect = -1;
            $scope.searchModel.areaListSelect = -1;
            $scope.searchModel.isOrderListSelect = "is";*/
            //$rootScope.isRdc=data.query.isRdc;
            //获取table数据
           // get();
        }, function (error) {
            console.log(error)
        });
        //查询
        $scope.searchClick = function () {
            get();
        }
        function get(){
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
          /*  opts.customerId = $scope.searchModel.customerListSelect;
            opts.areaId = $scope.searchModel.areaListSelect;
            opts.isOrder = $scope.searchModel.isOrderListSelect;*/
            var promise = addInventory.getDataTable('/ckInventory/queryInventoryGoodsList',{param: {query:opts}});
            promise.then(function (data) {
                $scope.result = data.grid;
                //重置paging 解决分页指令不能监听对象问题
            }, function (error) {
                console.log(error);
            });
        }
        if($scope.result==''){
            $scope.flag=false;
        }else {
            $scope.flag=true;
        }
        //打印
        $scope.print= function (i) {
            if(!!$scope.result){
                if($scope.result==null){
                    $scope.flag=false;
                }else {
                    $scope.flag=true;
                }
                var params = "";
                params = params +"&brand="+escape($scope.searchModel.brand);
                params = params +"&product="+escape($scope.searchModel.product);
                params = params +"&supplier="+escape($scope.searchModel.supplier);
                params = params +"&goodsCode="+escape($scope.searchModel.goodsCode);
                params = params +"&name="+escape($scope.searchModel.name);
                params = params +"&serialNumber="+escape($scope.searchModel.serialNumber);
                params = params +"&goodsStyle="+escape($scope.searchModel.goodsStyle);
                params = params +"&inventoryType="+i;
                params = params +"&flag="+escape($scope.flag);
                $window.open('../print/inventorySheet.html?tokenId='+$rootScope.userInfo.token+'&sessionid='+$rootScope.userInfo.sessionId+params);
            }else {
                alert("暂无数据！");
            }

        }
        //返回
        $scope.update= function () {
            $window.history.back();
        }
    }]);
});