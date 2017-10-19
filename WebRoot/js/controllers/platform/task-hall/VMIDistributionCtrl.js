/**
 * author wusheng.xu
 * date 16/6/21
 */
define(['../../../app', '../../../services/platform/task-hall/VMIDistributionService', '../../../services/addressLinkageService'], function (app) {
     var app = angular.module('app');
    app.controller('VMIDistributionCtrl', ['$scope', '$sce', 'VMIDistribution', 'addressLinkage', function ($scope, $sce, VMIDistribution, addressLinkage) {
        $scope.navShow = true;
        $scope.pageModel = {
            //vmiSelect: {
            //    select1: {
            //        data: [{id:-1,name:'全部'}],
            //        id: -1,
            //        change: function () {
            //            //获取市
            //            addressLinkage.getCity({param: {query: {parentId: this.id}}})
            //                .then(function (data) {
            //                    $scope.pageModel.vmiSelect.select2.data = data.query.city;
            //                    $scope.pageModel.vmiSelect.select2.id = '-1';
            //                }, function (error) {
            //                    console.log(error)
            //                });
            //            if(this.id!=-1) {
            //                VMIDistribution.getDataTable({
            //                        param: {query: {wlSheng: this.id}}
            //                    }, '/vmiRelation/getWlDeptListByAreaId')
            //                    .then(function (data) {
            //                       // console.log(data.query.wlDeptList);
            //                        $scope.pageModel.distributionSelect.select1.data = data.query.wlDeptList;
            //                        //console.log($scope.pageModel.distributionSelect.select1.data);
            //                        if ($scope.pageModel.distributionSelect.select1.data){
            //                            $scope.pageModel.distributionSelect.select1.data.splice(0, 0, {
            //                                id: -1,
            //                                name: '全部'
            //                            });
            //                        }else{
            //                            $scope.pageModel.distributionSelect.select1.data = [{id: -1, name: '全部'}];
            //                            $scope.pageModel.distributionSelect.select1.id = -1;
            //                        }
            //                    });
            //            }else {
            //                $scope.pageModel.distributionSelect.select1.data=[{
            //                    id: -1,
            //                    name: '全部'
            //                }];
            //                $scope.pageModel.distributionSelect.select2.data=[{
            //                    id: -1,
            //                    name: '全部'
            //                }];
            //                $scope.pageModel.distributionSelect.select1.id = -1;
            //                $scope.pageModel.distributionSelect.select2.id = -1;
            //            }
            //        }
            //    },
            //    select2: {
            //        data: [{id:'-1',name:'全部'}],
            //        id: '-1',
            //        change: function () {
            //            if(this.id!=-1) {
            //                VMIDistribution.getDataTable({
            //                        param: {query: {wlShi: this.id}}
            //                    }, '/vmiRelation/getWlDeptListByAreaId')
            //                    .then(function (data) {
            //                        $scope.pageModel.distributionSelect.select2.data = data.query.wlDeptList;
            //                        if ($scope.pageModel.distributionSelect.select2.data)
            //                            $scope.pageModel.distributionSelect.select2.data.splice(0, 0, {
            //                                id: -1,
            //                                name: '全部'
            //                            });
            //                        $scope.pageModel.distributionSelect.select2.id = -1;
            //                    });
            //            }else {
            //                $scope.pageModel.distributionSelect.select2.data=[{
            //                    id: -1,
            //                    name: '全部'
            //                }];
            //                $scope.pageModel.distributionSelect.select2.id = -1;
            //            }
            //        }
            //    }
            //},
            dateTime: {
                startTime: '',
                endTime: ''
            },
            distributionSelect: {
                select1: {
                    data: [{id:-1,name:'全部'}],
                    id: -1,
                    change: function () {

                    }
                },
                select2: {
                    data: [{id:-1,name:'全部'}],
                    id: -1,
                    change: function () {

                    }
                }
            }
        };
        //获取省
        //addressLinkage.getProvince({"param": {"query": {"isAllFlag": 2, "parentId": 0}}})
        //    .then(function (data) {
        //        $scope.pageModel.vmiSelect.select1.data = data.query.areaInfo;
        //    }, function (error) {
        //        console.log(error);
        //    });
        $scope.getSelect=function(){
        VMIDistribution.getDataTable({
                param: {query: {wlType: 1}}
            }, '/vmiRelation/getWlDeptListByAreaId')
            .then(function (data) {
                // console.log(data.query.wlDeptList);
                $scope.pageModel.distributionSelect.select1.data = data.query.wlDeptList;
                //console.log($scope.pageModel.distributionSelect.select1.data);
                if ($scope.pageModel.distributionSelect.select1.data){
                    $scope.pageModel.distributionSelect.select1.data.splice(0, 0, {
                        id: -1,
                        name: '全部'
                    });
                }else{
                    $scope.pageModel.distributionSelect.select1.data = [{id: -1, name: '全部'}];
                    $scope.pageModel.distributionSelect.select1.id = -1;
                }
            });
        }
        $scope.getSelect()
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
        $scope.gridThHeader1 = VMIDistribution.getThead1();
        $scope.navClick = function (i) {
            $scope.pageModel.dateTime.startTime="";
            $scope.pageModel.dateTime.endTime="";
            //$scope.pageModel.vmiSelect.select1.id = -1;
            //$scope.pageModel.vmiSelect.select2.id = '-1';
            //$scope.pageModel.vmiSelect.select2.data = [{id:'-1',name:'全部'}];
            $scope.pageModel.distributionSelect.select1.data = [{id:-1,name:'全部'}];
            $scope.pageModel.distributionSelect.select1.id = -1;
            $scope.pageModel.distributionSelect.select2.id = -1;
            $scope.pageModel.distributionSelect.select2.data = [{id:-1,name:'全部'}];
            if (i == 0) {
                assignFlag = 1;
                $scope.navShow = true;
                $scope.gridThHeader1 = VMIDistribution.getThead1();
            } else {
                assignFlag = 2;
                $scope.navShow = false;
                $scope.gridThHeader2 = VMIDistribution.getThead2();
            }
            getGrid(i);
            $scope.getSelect()
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
        function  getGrid(i) {
           // console.log("run:"+i);
            var opt = {};
            if (i == 0) {
                opt = {
                    page: $scope.paging1.currentPage,
                    pageSize: $scope.paging1.showRows,
                    startTime: $scope.pageModel.dateTime.startTime,
                    endTime: $scope.pageModel.dateTime.endTime,
                    //wlSheng: $scope.pageModel.vmiSelect.select1.id,
                    //wlShi: $scope.pageModel.vmiSelect.select2.id,
                    assignFlag: assignFlag
                }
            } else {
                opt = {
                    page: $scope.paging2.currentPage,
                    pageSize: $scope.paging2.showRows,
                    startTime: $scope.pageModel.dateTime.startTime,
                    endTime: $scope.pageModel.dateTime.endTime,
                    //wlSheng: $scope.pageModel.vmiSelect.select1.id,
                    //wlShi: $scope.pageModel.vmiSelect.select2.id,
                    assignFlag: assignFlag
                }
            }
           // console.log("before");
            VMIDistribution.getDataTable({
                    param: {
                        query:opt
                    }
                }, '/vmiRelation/queryVmiOrderList')
                .then(function (data) {
                   // console.log("start");
                    if(i==0) {
                        $scope.gridResult1 = data.grid;
                        $scope.paging1 = {
                            totalPage: data.total,
                            currentPage: $scope.paging1.currentPage,
                            showRows: $scope.paging1.showRows,
                        };
                    }else {
                        $scope.gridResult2 = data.grid;
                        $scope.paging2 = {
                            totalPage: data.total,
                            currentPage: $scope.paging2.currentPage,
                            showRows: $scope.paging2.showRows,
                        };
                    }
                  //  console.log("end");
                });
        }
        //分配
        $scope.btnDistribution= function () {
            if(confirm('确定分配吗?')){
                var ids='';
                angular.forEach($scope.gridResult1, function (item) {
                    if (item.pl4GridCheckbox.checked) {
                        ids+=item.taskId+',';
                    }
                });
                if(ids!=''){
                    ids=ids.substr(0,ids.length-1);
                }
                else {
                    alert('请勾选后再进行分配!');
                    return false;
                }
                VMIDistribution.getDataTable({
                    param:{
                        query:{
                            taskIds:ids,
                           // wlDeptId:$scope.pageModel.distributionSelect.select2.id!=-1?$scope.pageModel.distributionSelect.select2.id:$scope.pageModel.distributionSelect.select1.id
                            wlDeptId2:$scope.pageModel.distributionSelect.select2.id,
                            wlDeptId:$scope.pageModel.distributionSelect.select1.id
                        }
                    }

                },'/vmiRelation/insertVmiRelation')
                    .then(function (data) {
                        if(data.status.code=="0000"){
                            alert('分配成功!');
                           // $scope.pageModel.vmiSelect.select1.id=-1;
                            $scope.pageModel.distributionSelect.select1.id=-1;
                            getGrid(0);
                        }else {
                            alert(data.status.msg);
                        }
                    });
            }
        }
        getGrid(0);
        $scope.goToPage = function (i) {
            getGrid(i);
        }
    }])
})