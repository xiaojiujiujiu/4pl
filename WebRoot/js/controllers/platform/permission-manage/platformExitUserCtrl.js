/**
 * Created by xiaojiu on 2017/2/9.
 */
define(['../../../app','../../../services/platform/permission-manage/platformExitUserService'], function (app) {
    var app = angular.module('app');
    app.controller('platformExitUserCtrl', ['$scope','$sce','platformExitUser', function ($scope,$sce,platformExitUser) {
        $scope.userModel={
            account:'',
        }
        $scope.playUserClick=function(){
            var opts = angular.extend({}, $scope.userModel, {});
            platformExitUser.getDataTable({param:{query:opts}})
                .then(function (data) {
                    if(data.status.code=="0000"){
                        alert(data.status.msg);
                        $scope.userModel.account='';
                    }

                });
        }


    }]);
});