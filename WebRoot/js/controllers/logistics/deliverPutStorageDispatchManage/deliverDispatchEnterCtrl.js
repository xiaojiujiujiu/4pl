/**
 * author wusheng.xu
 * date 16/4/19
 */
define(['../../../app', '../../../services/logistics/deliverPutStorageDispatchManage/deliverDispatchEnterService'], function (app) {
     var app = angular.module('app');
    app.controller('deliverDispatchEnterCtrl', ['$scope', '$sce', '$window', '$rootScope','$state', '$stateParams', 'deliverDispatchEnter', function ($scope, $sce, $window, $rootScope,$state, $stateParams, deliverDispatchEnter) {
        var queryParam = {
            taskIds: $stateParams['taskIds'],
            wlDeptId: $stateParams['wlDeptId'],
            flag: $stateParams['flag'],
        }
        $scope.banner = {};

        $scope.thHeader = deliverDispatchEnter.getThHeader();

        function get() {
        	var url='';
        	if(queryParam.flag==1){
        		url='/TempAllotTask/insertBgTask';
        	}else{
        		url='/TempAllotTask/queryFbTaskDetail';
        	}
            deliverDispatchEnter.getDataTable({
                    param: {
                        query: {
                            taskIds:queryParam.taskIds,
                            wlDeptId:queryParam.wlDeptId,
                        }
                    }
                },url )
                .then(function (data) {
                    if (data.code == -1) {
                        alert(data.message);
                        $scope.result = [];
                        return false;
                    }
                    $scope.banner = data.query;
                    $scope.result = data.grid;
                }, function (err) {
                    console.error(err);
                });
        }

        get();

        //打印
        $scope.print = function () {
        	$window.open("/print/fbPutStroageDetail.html?tokenId=" + $rootScope.userInfo.token + "&sessionid=" + $rootScope.userInfo.sessionId + "&taskId=" + $scope.banner.fbTaskId);
            $('#enterPrint').modal('show');
        }
        $scope.printConfirm= function () {
            $('#enterPrint').modal('hide');
            $window.history.back();
        }
    }]);
});