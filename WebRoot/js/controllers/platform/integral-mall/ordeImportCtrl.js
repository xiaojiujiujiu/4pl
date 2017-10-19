/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/platform/integral-mall/ordeImportService','../../../services/uploadFileService'], function (app) {
     var app = angular.module('app');
    app.controller('ordeImportCtrl', ['$rootScope', '$scope','$timeout', '$state', '$sce', '$filter', 'HOST', '$window','ordeImport','uploadFileService', function ($rootScope, $scope,$timeout, $state, $sce, $filter, HOST, $window,ordeImport,uploadFileService) {

        //table头
        $scope.thHeader = ordeImport.getThead();

        /*var pmsSearch = ordeImport.getSearch();
         pmsSearch.then(function (data) {
         $scope.searchModel = data.query; //设置当前作用域的查询对象
         //获取table数据
         get();
         }, function (error) {
         console.log(error)
         });*/
        //查询
        //$scope.searchClick = function () {
        //    $scope.paging = {
        //        totalPage: 1,
        //        currentPage: 1,
        //        showRows: $scope.paging.showRows
        //    };
        //    get();
        //}


        $scope.exParams = '';
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            $scope.exParams = $filter('json')({query: opts});
            var promise = ordeImport.getDataTable(
                '/giftOrder /searchData',
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
                if(data.code==-1){
                    alert(data.message);
                    $scope.result = [];
                    return false;
                }
                $scope.result = data.grid;
                // $scope.paging.totalPage = data.total;
            }, function (error) {
                console.log(error);
            });
        }
        //导入
        $scope.isShow=true;
        $scope.impUploadFiles= function (files) {
            if(files.length==0) return false;
            //多文件上传
            var count=0;
            function upFiles(){
                uploadFileService.upload('/giftOrder/importExcel',files[count],function(evt){
                    //进度回调
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.impUploadFilesProgress=evt.config.data.file.name+'的进度:'+progressPercentage+'%';
                }).then(function (resp) {
                    //上传成功
                    $scope.impUploadFilesProgress='上传完成!';
                    //get();
                    alert( resp.data.status.msg);
                    $timeout(function(){
                        $scope.isShow = false;
                    },3000);
                    if(resp.data.status.code=="0000"){
                        $scope.result = resp.data.grid;
                        $scope.query =resp.data.query;
                    }
                    count++;
                    if(files.length>count)
                        upFiles();
                });
            }
            upFiles();
        }

        //确认导入
        $scope.confirmImpor=function(){
            if($scope.result) {
                var opts = {
                    grid: {grid: $scope.result}
                }
                ordeImport.getDataTable('/giftOrder/addOrderAndDetail', {param: opts})
                    .then(function (data) {
                        if(data.code==-1){
                            alert(data.message);
                        }else if(data.status.code=="0000") {
                            alert(data.status.msg, function () {
                                $state.go('main.giftOrders');
                            });
                        }else
                            alert(data.status.msg);
                    });
            }else{
                alert('请导入数据！');
            }
        }
        //取消导入
        $scope.cancel=function(){
            var like=window.confirm("确认取消导入订单信息？");
            if(like){
                $state.go('main.giftOrders');
            }
        }
    }])
});