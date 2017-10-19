/**
 * author wusheng.xu
 * date 16/4/19
 */
define(['../../../app', '../../../services/logistics/deliverPutStorageDispatchManage/deliverDispatchService'], function (app) {
     var app = angular.module('app');
    app.controller('deliverDispatchCtrl', ['$scope', '$sce', '$state', 'deliverDispatch', function ($scope, $sce, $state, deliverDispatch) {
        $scope.isShow = $scope.isGrid = false;
        $scope.model = {
            take: ''
        }
        $scope.querySeting = {
            items: [{
                type: 'select',
                model: 'wlList',
                selectedModel: 'wlListSelect',
                title: '分拨目的地'
            }],
            btns: [{
                text: $sce.trustAsHtml('确定'),
                click: 'searchClick'
            }]
        };
        $scope.thHeader = deliverDispatch.getThHeader();
        deliverDispatch.getDataTable({param: {}}, '/TempAllotTask/getDicLists')
            .then(function (data) {
                $scope.searchModel = data.query;//设置当前作用域的查询对象
                $scope.searchModel['wlList'].splice(0, 0, {id: -1, name: '请选择'})
                //下拉框model
                $scope.searchModel.wlListSelect = -1;
            }, function (error) {
                console.log(error)
            });
        //分拨地查询
        $scope.searchClick = function () {
            if ($scope.searchModel.wlListSelect == -1) {
                alert('请选择分拨目的地!');
                return false;
            }
            $scope.isShow = true;
            //get();
        }
        function get() {
            deliverDispatch.getDataTable({param: {query: {taskIdBox: $scope.model.take}}}, '/TempAllotTask/insertTempAllotTask')
                .then(function (data) {
                    if (data.code == 0) {
                        deliverDispatch.getDataTable({param:{query: {taskIds: $scope.model.take,wlDeptId:$scope.searchModel.wlListSelect}}}, '/TempAllotTask/queryTempAllotTaskList')
                            .then(function (data) {
                                if (data.code == 0)
                                    $scope.result = data.grid;
                                else
                                    alert(data.message);
                            }, function (err) {
                                console.error(err);
                            });
                    } else {
                        alert(data.message);
                    }
                }, function (err) {
                    console.error(err);
                });
        }

        //业务单号查询
        $scope.taskSerach = function () {
            if ($scope.model.take != '') {
                $scope.isGrid = true;
                get();
            }
            else
                alert('请输入业务单号!');
        }
        //确认分拨
        $scope.enterDispatch = function () {
            if ($scope.searchModel.wlListSelect != -1) {
                var wlListName='',ids='';
                angular.forEach($scope.searchModel.wlList, function (item) {
                    if($scope.searchModel.wlListSelect==item.id){
                        wlListName=item.name;
                        return false;
                    }
                })
                angular.forEach($scope.result, function (item) {
                    ids+=item.taskId+',';
                });
                if(ids!=''){
                    ids=ids.substr(0,ids.length-1);
                    $state.go('main.deliverDispatchEnter', {taskIds:ids,taskIdBox: $scope.model.take,receiverID:$scope.searchModel.wlListSelect,receiverName:wlListName});

                }else {
                    alert('列表没有任何数据!');
                    return false;
                }
            }
        }
        //删除
        $scope.deleteCall = function (i, item) {
        	$('tr').eq(i+1).remove();
        	/*return;
            if (confirm('确定删除吗?')) {
                deliverDispatch.getDataTable({param: {query: {taskId: item.taskId}}}, '/wlReturnGoodsDetail/deleteTempWlReturnOrder')
                    .then(function (data) {
                        if (data.code == 0) {
                        	 alert(data.message);
                            get();
                        }
                       
                    }, function (err) {
                        console.error(err);
                    });
            }*/
        }
    }]);
});