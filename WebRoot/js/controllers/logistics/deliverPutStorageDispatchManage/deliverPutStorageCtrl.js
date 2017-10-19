/**
 * author wusheng.xu
 * date 16/4/19
 */
define(['../../../app', '../../../services/logistics/deliverPutStorageDispatchManage/deliverPutStorageService'], function (app) {
     var app = angular.module('app');
    app.controller('deliverPutStorageCtrl', ['$rootScope', '$scope','$state','$filter','$window', 'deliverPutStorage', function ($rootScope, $scope,$state,$filter,$window, deliverPutStorage) {
        $scope.isTabs = true;

        $scope.navClick = function (i) {
            if (i == 0) {
                $scope.isTabs=true
                get1Grid1();
            } else {
                $scope.isTabs=false;
                get2Grid1();
            }
        }

        //取货tab 查询框
        $scope.searchModel1 = {
            take: '',
            business: ''
        }
        //取货tab 取货grid表头
        $scope.tab1ThHeader1 = deliverPutStorage.getTab1ThHeader1();
        //取货tab 入库grid表头
        $scope.tab1ThHeader2 = deliverPutStorage.getTab1ThHeader2();
        //取货tab getGrid1
        function get1Grid1() {
            deliverPutStorage.getDataTable({
                    param: {
                        query: {
                            taskId: $scope.searchModel1.take,
                            orderTypeId: 9
                        }
                    }
                }, '/wlReturnGoods/queryWlReturnOrderList')
                .then(function (data) {
                	if(data.code == -1){
                		alert(data.message);
                        $scope.tab1Result1=[];
                		return false;
                	}else{
                    $scope.tab1Result1 = data.grid;
                	}

                }, function (error) {
                    console.error(error);
                });
        }

        //取货tab getGrid2
        function get1Grid2() {
            deliverPutStorage.getDataTable({
                    param: {query: {
                        taskIdBox:$scope.searchModel1.business,
                        orderTypeId: 9
                    }}
                }, '/wlReturnGoodsDetail/createTempWlReturnOrder')
                .then(function (data) {
                    if(data.code==0) {
                        deliverPutStorage.getDataTable({param: {query:{  taskIdBox:$scope.searchModel1.business,orderTypeId: 9}}}, '/wlReturnGoodsDetail/queryTempWlReturnOrder')
                            .then(function (data) {
                            	if(data.code == -1){
                            		alert(data.message);
                                    $scope.tab1Result2=[];
                            		return false;
                            	}else{
                            		$scope.tab1Result2 = data.grid;
                            	}
                            }, function (err) {
                                console.error(err);
                            })
                    }else {
                        alert(data.message);
                    }
                }, function (error) {
                    console.error(error);
                });

        }

        //取货tab 取货单号查询
        $scope.search1Click1 = function () {
            get1Grid1();
        }
        //取货tab 业务单号/箱号查询
        $scope.search1Click2 = function () {
            get1Grid2();
        }
        //取货tab 打印所有箱单
        $scope.printAll1 = function () {
            var printGrid=[];
            angular.forEach($scope.tab1Result1, function (item) {
                //printGrid.push('{\"taskId\":\"'+item.relationTaskId+'\",\"boxCount\":'+item.acceGoodCount+'}');
                printGrid.push(JSON.stringify({taskId:item.relationTaskId,boxCount:item.acceGoodCount}));
            })
            $window.localStorage.setItem('pl4boxUnitPrintGrid', printGrid);
            $window.open("/print/boxUnit.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId);

        }
        //取货tab 确认入库
        $scope.enterDispatch1 = function () {
            var ids='';
            angular.forEach( $scope.tab1Result2, function (item) {
                ids+=item.taskId+',';
            })
            if(ids!=''){
                ids=ids.substr(0,ids.length-1);
                $state.go('main.deliverPutStorageEnter',{taskIds:ids});
            }else {
                alert('入库列表不能为空!');
            }
        }

        //分拨tab 查询框
        $scope.searchModel2 = {
            dispatch: '',
            business: ''
        }
        //分拨tab 取货grid表头
        $scope.tab2ThHeader1 = deliverPutStorage.getTab2ThHeader1();
        //分拨tab 入库grid表头
        $scope.tab2ThHeader2 = deliverPutStorage.getTab2ThHeader2();
        //分拨tab getGrid1
        function get2Grid1() {
            deliverPutStorage.getDataTable({
                    param: {
                        query: {
                            taskId: $scope.searchModel2.dispatch,
                            orderTypeId: 14
                        }
                    }
                }, '/wlReturnGoods/queryWlReturnOrderList')
                .then(function (data) {
                	if(data.code == -1){
                		alert(data.message);
                        $scope.tab2Result1=[];
                		return false;
                	}else{
                    $scope.tab2Result1 = data.grid;
                	}
                }, function (error) {
                    console.error(error);
                });
        }

        //分拨tab  getGrid2
        function get2Grid2() {
            deliverPutStorage.getDataTable({
                    param: {query: {
                        taskIdBox:$scope.searchModel2.business,
                        orderTypeId: 14
                    }}
                }, '/wlReturnGoodsDetail/createTempWlReturnOrder')
                .then(function (data) {
                    if(data.code==0) {
                        deliverPutStorage.getDataTable({param: {query:{taskIdBox:$scope.searchModel2.business,orderTypeId: 14}}}, '/wlReturnGoodsDetail/queryTempWlReturnOrder')
                            .then(function (data) {
                            	if(data.code == -1){
                                    $scope.tab2Result2=[];
                            		alert(data.message);
                            		return false;
                            	}else{
                                $scope.tab2Result2 = data.grid;
                            	}
                            }, function (err) {
                                console.error(err);
                            })
                    }else {
                        alert(data.message);
                    }
                }, function (error) {
                    console.error(error);
                });
        }

        //分拨tab 取货单号查询
        $scope.search2Click1 = function () {
            get2Grid1();
        }
        //分拨tab 业务单号/箱号查询
        $scope.search2Click2 = function () {
            get2Grid2();
        }
        //分拨tab 打印所有箱单
        $scope.printAll2 = function () {

        }
        //分拨tab 确认入库
        $scope.enterDispatch2 = function () {
            var ids='';
            angular.forEach( $scope.tab2Result2, function (item) {
                ids+=item.taskId+',';
            })
            if(ids!=''){
                ids=ids.substr(0,ids.length-1);
                $state.go('main.deliverPutStorageEnter',{taskIds:ids, fbTaskId: $scope.searchModel2.dispatch});
            }else {
                alert('入库列表不能为空!');
            }
        }

        get1Grid1();
    }]);
});