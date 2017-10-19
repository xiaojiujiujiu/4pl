/**
 * author wusheng.xu
 * date 16/6/21
 */
define(['../../../app', '../../../services/logistics/deliverPutStorageDispatchManage/fbDistributionService', '../../../services/addressLinkageService'], function (app) {
     var app = angular.module('app');
    app.controller('fbDistributionCtrl', ['$scope', '$sce','$rootScope','$state', '$stateParams', 'fbDistribution', 'addressLinkage', function ($scope, $sce,$rootScope,$state, $stateParams, fbDistribution, addressLinkage) {
        $scope.navShow = true;
        $scope.pageModel = {
            vmiSelect: {
              
                select2: {
                    data: [{id:-1,name:'全部'},{id:9,name:'VMI补货'},{id:19,name:'拆车件'},{id:13,name:'个人业务'},{id:10,name:'VMI退货(RDC退货)'}],
                    id: -1,
                    change: function () {

                    }
                }
            },
            dateTime: {
                startTime: '',
                endTime: ''
            },
            taskIds: {
            	taskId: '',
            	fbTaskId:''
            },
            distributionSelect: {
                select1: {
                    data: [{id:-1,name:'全部'}],
                    id: -1,
                    change: function () {}
                }
            }
        };
        //获取省
        addressLinkage.getFbWldept({"param": {"query": {"isAllFlag": 2}}})
            .then(function (data) {
                $scope.pageModel.distributionSelect.select1.data = data.query.areaInfo;
            }, function (error) {
                console.log(error);
            });
        //分页下拉框
        $scope.pagingSelect = [{
            value: 5,
            text: 5
        }, {
            value: 10,
            text: 10,
            selected: true
        }, {
            value: 20,
            text: 20
        }, {
            value: 30,
            text: 30
        }, {
            value: 50,
            text: 50
        }];
        //分页对象1
        $scope.paging1 = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        //分页对象2
        $scope.paging2 = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        var assignFlag = 1;
        $scope.gridThHeader1 = fbDistribution.getThead1();
        $scope.navClick = function (i) {
            $scope.pageModel = {
                vmiSelect: {

                    select2: {
                        data: [{id:-1,name:'全部'},{id:9,name:'VMI补货'},{id:19,name:'拆车件'},{id:13,name:'个人业务'},{id:10,name:'VMI退货(RDC退货)'}],
                        id: -1,
                        change: function () {

                        }
                    }
                },
                dateTime: {
                    startTime: '',
                    endTime: ''
                },
                taskIds: {
                    taskId: '',
                    fbTaskId:''
                },
                distributionSelect: {
                    select1: {
                        data: [{id:-1,name:'全部'}],
                        id: -1,
                        change: function () {}
                    }
                }
            };
            //获取省
            addressLinkage.getFbWldept({"param": {"query": {"isAllFlag": 2}}})
                .then(function (data) {
                    $scope.pageModel.distributionSelect.select1.data = data.query.areaInfo;
                }, function (error) {
                    console.log(error);
                });
            $scope.pageModel.vmiSelect.select2.id = -1;
            $scope.pageModel.vmiSelect.select2.data = [{id:-1,name:'全部'}];
            $scope.pageModel.distributionSelect.select1.data = [{id:-1,name:'全部'}];
            $scope.pageModel.distributionSelect.select1.id = -1;
            if (i == 0) {
                assignFlag = 1;
                $scope.navShow = true;
                $scope.gridThHeader1 = fbDistribution.getThead1();
            } else {
                assignFlag = 2;
                $scope.navShow = false;
                $scope.gridThHeader2 = fbDistribution.getThead2();
            }
            getGrid(i);
        }
        //查询
        $scope.btnClick = function (i) {
            $scope['paging'+(i+1)] = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope['paging'+(i+1)].showRows
            };
            getGrid(i);
        }
        $scope.gridResult1Paging={
            pageNo:1,
            pageSize:10
        }
        function getGrid(i) {
            var opt = {};
            if (i == 0) {
                opt = {
                    page: $scope.paging1.currentPage,
                    pageSize: $scope.paging1.showRows,
                    taskId: $scope.pageModel.taskIds.taskId,
                    orderType: $scope.pageModel.vmiSelect.select2.id,
                    assignFlag: assignFlag
                },
                fbDistribution.getDataTable({
                    param: {
                        query:opt
                    }
                }, '/returnPickQuery/queryNeedFbTaskList')
                .then(function (data) {
                        if (data.code == -1) {
                            
                            $scope.gridResult1 = [];
                            $scope.paging1 = {
                                totalPage: 1,
                                currentPage: 1,
                                showRows: $scope.paging1.showRows,
                            };
                            return false;
                        }
                        $scope.gridResult1 = data.grid;
                        $scope.paging1 = {
                            totalPage: data.total,
                            currentPage: $scope.paging1.currentPage,
                            showRows: $scope.paging1.showRows,
                        };
                  
                });
            } else {
                opt = {
                    page: $scope.paging2.currentPage,
                    pageSize: $scope.paging2.showRows,
                    startTime: $scope.pageModel.dateTime.startTime,
                    endTime: $scope.pageModel.dateTime.endTime,
                    fbTaskId: $scope.pageModel.taskIds.fbTaskId,
                    assignFlag: assignFlag
                },
                fbDistribution.getDataTable({
                    param: {
                        query:opt
                    }
                }, '/returnPickQuery/queryFinishFbTaskList')
                .then(function (data) {
                   
                        if (data.code == -1) {
                            alert(data.message);
                            $scope.gridResult2 = [];
                            $scope.paging2 = {
                                totalPage: 1,
                                currentPage: 1,
                                showRows: $scope.paging2.showRows,
                            };
                            return false;
                        }
                        $scope.gridResult2 = data.grid;
                        $scope.paging2 = {
                            totalPage: data.total,
                            currentPage: $scope.paging2.currentPage,
                            showRows: $scope.paging2.showRows,
                        };
                    
                });
            }
           
        }
        
    
        //分配
        $scope.btnDistribution= function () {
        	if($scope.pageModel.distributionSelect.select1.id==-1){
        		alert('请选择分拨中心!');
                return false;
        	}
            if(confirm('确定分拨吗?')){
                var ids='';
                angular.forEach($scope.gridResult1, function (item) {
                    if (item.pl4GridCheckbox.checked) {
                        ids+=item.taskId+',';
                    }
                });
                if(ids!=''){
                	  ids=ids.substr(0,ids.length-1);
                      $state.go('main.deliverDispatchEnter', {taskIds:ids, wlDeptId:$scope.pageModel.distributionSelect.select1.id,flag:1});
                }else {
                    alert('请选择业务单再进行分拨!');
                    return false;
                }
            }
        }
        //查看
        	$scope.getOpenModelData = function (index){
        		 var currTaskId = $scope.gridResult2[index].taskId;
        		 $state.go('main.deliverDispatchEnter', {taskIds:currTaskId, flag:0});
        	}
        getGrid(0);
        $scope.goToPage = function (i) {
            getGrid(i);
        }
    }])
})