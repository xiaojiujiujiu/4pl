/**
 * author wusheng.xu
 * date 16/4/20
 */
define(['../../../app', '../../../services/logistics/deliverPutStorageDispatchManage/deliverPutStorageEnterService'], function (app) {
     var app = angular.module('app');
    app.controller('deliverPutStorageEnterCtrl', ['$scope', '$sce','$window','$rootScope','$stateParams', 'deliverPutStorageEnter', function ($scope, $sce,$window,$rootScope,$stateParams, deliverPutStorageEnter) {

        $scope.thHeader=deliverPutStorageEnter.getThHeader();

        function get(){
            deliverPutStorageEnter.getDataTable({param:{query:{taskIdBox:$stateParams['taskIds'],fbTaskId:$stateParams['fbTaskId']}}},'/wlReturnGoodsDetail/queryTempWlReturnOrder')
                .then(function (data) {
                    if (data.code == -1) {
                        alert(data.message);
                        $scope.result = [];
                        return false;
                    }
                    $scope.result=data.grid;
                }, function (err) {
                    console.error(err);
                });
        }

        get();

        //打印
        var taskId='';
        $scope.print= function () {
            var ids='';
            angular.forEach($scope.result, function (item) {
                ids+=item.taskId+',';
            });
            if(ids!=''){
                ids=ids.substr(0,ids.length-1);
                taskId=ids;
                $window.open("/print/deliverPutStorage.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+ids);
                $('#enterPrint').modal('show');
            }
        }
        $scope.printConfirm = function(){
        	var resetPromise = deliverPutStorageEnter.getDataTable({
                "param": {
                "query":{
                	"taskIds":taskId,
                	"fbTaskId":$stateParams['fbTaskId']
                }
            }
        },'/wlReturnGoodsDetail/updatePrintState')
        	resetPromise.then(function(data){
        		// console.log(data)
            	if(data.code == 0){
                	$('#enterPrint').modal('hide');
                	window.history.back(-1);
            	}
            })
        }
    }]);
});