/**
 * Created by xuwusheng on 15/12/11.
 */
define(['../../../app','../../../services/storage/goods-allocation/goodsAlloDataService'], function (app) {
     var app = angular.module('app');
    app.controller('goodsAlloCtrl', ['$scope','$sce','goodsAlloData','$window','$rootScope', function ($scope,$sce,goodsAlloData,$window,$rootScope) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'select',
                model: 'areaId',
                selectedModel: 'areaIdSelect',
                title: '货区选择'
            }, {
                type: 'select',
                model: 'subAreaId',
                selectedModel: 'subAreaIdSelect',
                title: '分区选择'
            }, {
                type: 'select',
                model: 'status',
                selectedModel: 'statusSelect',
                title: '货位状态'
            }],
            btns: [
            // {
            //    text: $sce.trustAsHtml('<span >添加货位</span>'),
            //    click: 'addGoodsAllo'
            //},
                {
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        var pmsQuery=goodsAlloData.getQuery();
        pmsQuery.then(function (data) {
            $scope.searchModel = data.query;//设置当前作用域的查询对象
            //下拉框model
            $scope.searchModel.areaIdSelect = -1;
            $scope.searchModel.subAreaIdSelect = -1;
            $scope.searchModel.statusSelect = -1;
            //获取table数据
            get();
        }, function (error) {
            console.log(error)
        });

        //theadr
        $scope.thHeader=goodsAlloData.getThead();
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
        //查询
        $scope.searchClick= function () {
        	//设置默认第一页
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            get();
        }
        //打印货位码
        $scope.selectPrint=function(){
            var  taskIds = '';
            angular.forEach($scope.result, function (val, index, arr) {
                if (val.pl4GridCheckbox.checked == true) {
                    taskIds += val.id + ',';
                }
            })

            if (taskIds != '') {
                taskIds = taskIds.slice(0, taskIds.length - 1);
                // 打开拣货清单打印预览页面
                $window.open("../print/huoweiCode.html?tokenId=" + $rootScope.userInfo.token + "&sessionid=" + $rootScope.userInfo.sessionId + "&ids=" + taskIds);
                $scope.taskIds = taskIds;
            } else {
                alert('当前没有勾选打印项！')
            }
        }
        //初始化打印
        $scope.initPrint=function(){
            $window.open("../print/huoweiCode.html?tokenId=" + $rootScope.userInfo.token + "&sessionid=" + $rootScope.userInfo.sessionId);
        }
        //添加货位
        $scope.addGoodsAllo= function () {
            $('#addGoodsAlloModal').modal();
            var pmsQuery=goodsAlloData.getQuery('/ckHuoWei/getDicLists');
            pmsQuery.then(function (data) {
                // console.log(data)
                $scope.addStorage=data.query;
                $scope.addStorage.subAreaIdSelected=-1;
                $scope.addStorage.areaIdSelected=-1;
                $scope.addStorage.rowNo='';
                $scope.addStorage.columnNo='';
                $scope.addStorage.layerCount='';
                $scope.addStorage.huoWeiCount='';
            }, function (error) {
                console.log(error)
            });
        }
        //确认添加货位
        $scope.addGoodsAlloEnter= function () {
            //if(confirm('确定添加货位？')){
                if($scope.addStorage.areaIdSelected==-1){
                    alert('请选择货区！');
                    return false;
                }
                if($scope.addStorage.subAreaIdSelected==-1){
                    alert('请选择分区！');
                    return false;
                }
                if($scope.addStorage.rowNo==""){
                    alert('请选择货架行数！');
                    return false;
                }
                if($scope.addStorage.columnNo==""){
                    alert('请选择货架列数！');
                    return false;
                }
                if($scope.addStorage.layerCount==""){
                    alert('请选择货位数！');
                    return false;
                }
                if($scope.addStorage.huoWeiCount==""){
                    alert('请选择货架层数！');
                    return false;
                }
                var opt={
                    "areaId": $scope.addStorage.areaIdSelected,
                    "subAreaId": $scope.addStorage.subAreaIdSelected,
                    "rowNo": $scope.addStorage.rowNo,
                    "columnNo": $scope.addStorage.rowNo,
                    "layerCount": $scope.addStorage.layerCount,
                    "huoWeiCount": $scope.addStorage.huoWeiCount
                };
                var promise = goodsAlloData.getDataTable({param: {query: opt}}, '/ckHuoWei/create');
                promise.then(function (data) {
                    //添加成功
                    if (data.status.code == "0000") {
                    	alert(data.status.msg);
                        get();
                        $('#addGoodsAlloModal').modal('hide');
                    }else{
                        $('#addGoodsAlloModal').modal('hide');
                        alert('添加失败：'+data.status.msg);
                    }
                }, function (error) {
                    console.log(error);
                });
            }
        //}
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.subAreaId = $scope.searchModel.subAreaIdSelect;
            opts.areaId = $scope.searchModel.areaIdSelect;
            opts.status = $scope.searchModel.statusSelect;
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = goodsAlloData.getDataTable({param: {query:opts}});
            promise.then(function (data) {
               if(data.status){
                   if(data.status.code== "1003"){
                       alert(data.status.msg);
                       $scope.result = [];
                       $scope.paging = {
                           totalPage: 1,
                           currentPage: 1,
                           showRows: $scope.paging.showRows,
                       };
                       return false;
                   }
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
        $scope.goToPage= function () {
            get();
        }
        //冻结
        $scope.freezeCall= function (index,item) {
            if(confirm('确定冻结吗？')) {
                var promise = goodsAlloData.getDataTable({param: {query: {id: item.id}}}, '/ckHuoWei/frozen_ckHuoWei');
                promise.then(function (data) {
                    alert(data.status.msg);
                    //冻结成功
                    if (data.status.code == "0000") {
                        get();
                    }
                }, function (error) {
                    console.log(error);
                });
            }
        }
        //恢复
        $scope.resumeCall= function (index,item) {
            if(confirm('确定恢复吗？')) {
                var promise = goodsAlloData.getDataTable({param: {query: {id: item.id}}}, '/ckHuoWei/frozen_ckHuoWei');
                promise.then(function (data) {
                    alert(data.status.msg);
                    //恢复成功
                    if (data.status.code == "0000") {
                        get();
                    }
                }, function (error) {
                    console.log(error);
                });
            }
        }
        //删除
        $scope.deleteCall= function (index,item) {
            if(confirm('确定删除吗？')) {
                var promise = goodsAlloData.getDataTable({param: {query: {id: item.id}}}, '/ckHuoWei/delete_ckHuoWei');
                promise.then(function (data) {
                    alert(data.status.msg);
                    //删除成功
                    if (data.status.code == "0000") {
                        get();
                    }
                }, function (error) {
                    console.log(error);
                });
            }
        }
    }]);
});