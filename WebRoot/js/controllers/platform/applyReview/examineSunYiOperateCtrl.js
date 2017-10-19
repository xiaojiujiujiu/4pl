/**
 * Created by xiaojiu on 2016/11/18.
 */
define(['../../../app','../../../services/platform/applyReview/examineSunYiOperateService'], function (app) {
     var app = angular.module('app');
    app.controller('examineSunYiOperateCtrl', ['$rootScope', '$scope','$stateParams', '$state', '$sce', '$filter', 'HOST', '$window','examineSunYiOperate', function ($rootScope, $scope, $stateParams,$state, $sce, $filter, HOST, $window,examineSunYiOperate) {


        //table头
        $scope.thHeader = examineSunYiOperate.getThead();

        //$scope.exGoodsAlloParam={
        //    query:{
        //        taskId:$stateParams['taskId']
        //    }
        //};
        var data = {
            param: {
                query:{
                    taskId:$stateParams['taskId']
                }
            }
        };
        $scope.exParams = '';
        var pmsBanner = examineSunYiOperate.getDataTable('/examine/getCkLossAndOverFlowOrderDetailList',data);
        $scope.exParams = $filter('json')({query: data});
        pmsBanner.then(function(data) {
            $scope.result = data.grid;
            $scope.banner = data.banner
        })
        $scope.goBack = function(){
            $state.go($rootScope.examineSunYi);
        }
        //通过申请
        $scope.countersign= function () {
            $('#passModal').modal('show');
        }
       //通过申请确认
        $scope.passCountersign=function(){
            var opts={};
            opts.taskId=$scope.banner.taskId;
            opts.status=1;
            var promise = examineSunYiOperate.getDataTable(
                '/examine/updateAuditedAndReject',
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
                if(data.status.code=="0000"){
                    alert(data.status.msg);
                    $('#passModal').modal('hide');
                    $state.go("main.examineSunYi");
                }
            }, function (error) {
                console.log(error);
            });
        }
        //驳回申请
        $scope.reject= function () {
            $('#rejectModal').modal('show');
        }
        $scope.remarksModel={
            remarks:'',
        }
        //驳回申请
        $scope.rejectCountersign=function(){
            var opts={};
            opts.taskId=$scope.banner.taskId;
            opts.status=2;
            opts.remarks=$scope.remarksModel.remarks;
            var promise = examineSunYiOperate.getDataTable(
                '/examine/updateAuditedAndReject',
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
                if(data.status.code=="0000"){
                    alert(data.status.msg);
                    $('#rejectModal').modal('hide');
                    $state.go("main.examineSunYi");
                }
            }, function (error) {
                console.log(error);
            });
        }
    }])
});