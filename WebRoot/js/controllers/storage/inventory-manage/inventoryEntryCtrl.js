/**
 * Created by xiaojiu on 2016/11/7.
 */
define(['../../../app','../../../services/storage/inventory-manage/inventoryEntryService','../../../services/uploadFileService'], function (app) {
     var app = angular.module('app');
    app.controller('inventoryEntryCtrl', ['$rootScope','$scope', '$sce', '$timeout', 'inventoryEntry','$window','$stateParams','$state','uploadFileService', function ($rootScope,$scope, $sce, $timeout, inventoryEntry,$window,$stateParams,$state,uploadFileService) {
        //theadr
        $scope.pageModel={
            SKU:''
        }//查询框
        $scope.thHeader = inventoryEntry.getThead();
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
            var opts ={
                taskId:$stateParams['taskId'],
                sku:$scope.pageModel.SKU
            }
            $scope.exGoodsAlloParam={query:opts};
            var promise = inventoryEntry.getDataTable('/ckInventory/inventoryOrderInput',{param: {query: opts}});
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
                $scope.banner=data.banner;
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
        //导入
        $scope.isShow=true;
        $scope.impUploadFiles= function (files) {
            if(files.length==0) return false;
            var opts ={
                taskId:$stateParams['taskId'],
            }
            //多文件上传
            var count=0;
            function upFiles(){
                uploadFileService.upload('/ckInventory/importExcel'+"?taskId="+$stateParams["taskId"],files[count],{query: opts},function(evt){
                    //进度回调
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.impUploadFilesProgress=evt.config.data.file.name+'的进度:'+progressPercentage+'%';
                }).then(function (resp) {
                   if(resp.data.status.code=="0000"){
                       //上传成功
                       $scope.impUploadFilesProgress='上传完成!';
                       get();
                       alert( resp.data.status.msg);
                       count++;
                       $timeout(function(){
                           $scope.isShow = false;
                       },3000);
                       if(files.length>count)
                           upFiles();
                   }else{
                       $scope.impUploadFilesProgress='上传失败!';
                   }
                });

            }
            upFiles();

        }
        $scope.ajaxInput= function (index, obj) {
            var opts = {};//克隆出新的对象，防止影响scope中的对象
            var inventoryCount=obj.inventoryCount;
            obj.inventoryCount= obj.inventoryCount.replace(/\D/g,'');
            opts.taskId = $stateParams['taskId'];
            opts.customerName = obj.customerName;
            opts.suppliersName = obj.suppliersName;
            opts.inventoryCount =obj.inventoryCount;
            opts.id =obj.id;
            opts.remarks =obj.remarks;
            var reg = new RegExp("^[0-9]{0,5}$");
            if(!reg.test(opts.inventoryCount)){
            	alert("转移数量必须为1-99999的数字！");
            	$("#confirmApplication").modal("hide");
            	return false;
            }
            if(inventoryCount==obj.inventoryCount){
                var promise = inventoryEntry.getDataTable('/ckInventory/ajaxInputSuccess',{param: {query: opts}});
                promise.then(function (data) {
                   // console.log(data);
                }, function (error) {
                    console.log(error);
                });
            }

        }
        $scope.ajaxInput2= function (index, obj) {
            var opts = {};//克隆出新的对象，防止影响scope中的对象
            opts.taskId = $stateParams['taskId'];
            opts.customerName = obj.customerName;
            opts.suppliersName = obj.suppliersName;
            opts.inventoryCount =obj.inventoryCount;
            opts.id =obj.id;
            opts.remarks =obj.remarks;

        	var promise2 = inventoryEntry.getDataTable('/ckInventory/ajaxInputSuccess',{param: {query: opts}});
            promise.then(function (data) {
            }, function (error) {
                console.log(error);
            });

        }
        
        
        //完成登记
        $scope.completeRegistration=function(){
            //var isTrue=true;
            //var reg = new RegExp("^[0-9]*$");
            //angular.forEach($scope.result, function (item,index){
            //    if(!reg.test(item.inventoryCount)){
            //        alert("请输入正确的实盘数量！")
            //        isTrue=false
            //    }
            //});
            //if(isTrue==false){
            //    return false
            //}

            var opts = {};
            opts.taskId = $stateParams['taskId'];
            var promise = inventoryEntry.getDataTable('/ckInventory/inputSuccess',{param: {query: opts}});
            promise.then(function (data) {
                if(data.status.code == "0000"){
                    alert(data.status.msg);
                    $state.go('main.inventoryTask')
                }
            }, function (error) {
                console.log(error);
            });
        }
        get();
        //返回
        $scope.update= function () {
            $window.history.back();
        }
    }]);
});