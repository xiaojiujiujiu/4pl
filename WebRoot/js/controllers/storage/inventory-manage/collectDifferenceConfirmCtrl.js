/**
 * Created by xiaojiu on 2017/2/9.
 */
define(['../../../app', '../../../services/storage/inventory-manage/collectDifferenceConfirmService'], function(app) {
    var app = angular.module('app');
    app.controller('collectDifferenceConfirmCtrl', ['$scope', '$state', '$stateParams', '$sce', 'collectDifferenceConfirm', function($scope, $state, $stateParams, $sce, collectDifferenceConfirm) {

        //table头
        $scope.thHeader = collectDifferenceConfirm.getThead();
        // get banner and grid data
        var pmsBanner = collectDifferenceConfirm.getBanner({
            param: {
                query:{
                    taskId: $stateParams['taskId'],
                    custTaskId: $stateParams['custTaskId'],
                }
            }
        });
        pmsBanner.then(function(data) {
            $scope.result = data.grid;
            $scope.banner = data.banner
        })
        // 返回
        $scope.goBack = function(){
            $state.go('main.goodsDifferenceManage')
        }
        $scope.showRemarks=function(){
            $("#remarks").modal('show');
        }
        $scope.remarksModel={
            remarks:'',
        }
        //定义表单模型
        $scope.goodsDifferenceModel={
            packageDamage:'',
            damage:'',
            lost:'',
            id:''
        }
        //查看差异
        $scope.checkDetail=function(i,item){
            $scope.goodsDifferenceModel.id=item.id;
            var opts={};
            opts.id=item.id;
            var sendParams = {
                param: {
                    query:opts
                }
            }
            var pmsBanner = collectDifferenceConfirm.getDataTableLook(sendParams);
            pmsBanner.then(function(data) {
                $scope.goodsDifferenceModel.packageDamage=data.banner.packageDamage;
                $scope.goodsDifferenceModel.damage=data.banner.damage;
                $scope.goodsDifferenceModel.lost=data.banner.lost;
            })
        }
        // 确认差异
        $scope.diffConfirm = function(){
            var sendParam = {
                query: $scope.banner
            }
            sendParam.query.remarks=$scope.remarksModel.remarks;
            var diffComfirmPms = collectDifferenceConfirm.getDataTable({
                param: sendParam
            });
            diffComfirmPms.then(function(data){
                if(data.status.code == "0000"){
                    $("#remarks").modal('hide');
                    alert('确认成功',function(){
                        $state.go('main.goodsDifferenceManage')
                    });
                }else {
                    alert(data.status.msg);
                }
            })
        }
        //删除备注差异
        $scope.deleteRemarks=function(){
            $scope.remarksModel={
                remarks:'',
            }
        }
    }])
});