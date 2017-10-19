/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app', '../../../services/platform/address-dispatch/taskHallService', '../../../services/addressLinkageService'], function (app) {
     var app = angular.module('app');
    app.controller('taskHallCtrl', ['$scope', '$sce', 'taskHall', 'addressLinkage', function ($scope, $sce, taskHal, addressLinkage) {
        var curNavIndex = 0;
        $scope.navFs = false;
        $scope.storage={};
        $scope.storageRDC = [];
        $scope.storageCDC = [{id:'-1',name:'全部'}];
        $scope.searchModel = {
            province: [],
            city: [{id: '-1', name: '全部'}],
            county: [{id: '-1', name: '全部'}],
            startTime: '',
            endTime: ''
        }
        //分页下拉框
        $scope.pagingSelect = [
            {value: 5, text: 5},
            {value: 10, text: 10, selected: true},
            {value: 20, text: 20},
            {value: 30, text: 30},
            {value: 50, text: 50}
        ];
        //分页对象
        $scope.paging1 = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        //分页对象
        $scope.paging2 = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        //省 选择事件
        $scope.searchModel.provinceChange = function () {
            var opt = {
                query: {parentId: $scope.searchModel.provinceSelected}
            }
            //获取市
            addressLinkage.getCity({param:opt})
                .then(function (data) {
                    $scope.searchModel.city = data.query.city;
                    $scope.searchModel.citySelected = '-1';
                }, function (error) {
                    console.log(error)
                });
            //初始化区
            $scope.searchModel.county=[{id: '-1', name: '全部'}];
            $scope.searchModel.countySelected = '-1';
        }
        //市 选择事件
        $scope.searchModel.cityChange = function () {
            var opt = {
                query: {parentId: $scope.searchModel.citySelected}
            }
            //获取市
            addressLinkage.getCounty({param:opt})
                .then(function (data) {
                    $scope.searchModel.county = data.query.city;
                    $scope.searchModel.countySelected = '-1';
                }, function (error) {
                    console.log(error)
                });
        }
        //区 选择事件
        $scope.searchModel.countyChange = function () {

        }
        //查询
        $scope.searchClick = function () {
            //设置默认第一页
            $scope['paging' + (curNavIndex + 1)] = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope['paging' + (curNavIndex + 1)].showRows
            };
            getTable(curNavIndex);
        }
        //tab切换
        $scope.navClick = function (i) {
            curNavIndex = i;
            if (i == 0)
                $scope.navFs = false;
            else
                $scope.navFs = true;
            getTable(i);
        }
        taskHal.getSearch()
            .then(function (data) {
                $scope.searchModel.province = data.query.province;
                $scope.storageRDC = data.query.RDC;
                $scope.storage.storageSelectedRDC='-1';
                $scope.storage.storageSelectedCDC='-1';
                $scope.searchModel.provinceSelected = '-1';
                $scope.searchModel.citySelected = '-1';
                $scope.searchModel.countySelected = '-1';
                //获取table数据
                getTable(0);
            }, function (error) {
                console.log(error)
            });
        //table头
        $scope.tHeader1 = taskHal.getThead1();
        $scope.tHeader2 = taskHal.getThead2();
        //获取table数据
        function getTable(i) {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.province = $scope.searchModel.provinceSelected;
            opts.city = $scope.searchModel.citySelected;
            opts.county = $scope.searchModel.countySelected;
            //未绑定
            if (i == 0) {
                opts.page = $scope.paging1.currentPage;
                opts.pageSize = $scope.paging1.showRows;
                var promise = taskHal.getDataTable({param: {query: opts}}, '/TaskHall/getTaskHalls');
                promise.then(function (data) {
                    if(data.code==-1){
                        alert(data.message);
                        $scope.result1 = [];
                        $scope.paging1 = {
                            totalPage: 1,
                            currentPage: 1,
                            showRows: $scope.paging1.showRows,
                        };
                        return false;
                    }
                    $scope.result1 = data.grid;
                    //重置paging 解决分页指令不能监听对象问题
                    $scope.paging1 = {
                        totalPage: data.total,
                        currentPage: $scope.paging1.currentPage,
                        showRows: $scope.paging1.showRows,
                    };
                }, function (error) {
                    console.log(error);
                });
            } else {
                //已绑定
                opts.page = $scope.paging2.currentPage;
                opts.pageSize = $scope.paging2.showRows;
                var promise = taskHal.getDataTable({param: {query: opts}}, '/TaskHallAddress/getTaskHallAddressList');
                promise.then(function (data) {
                    if(data.code==-1){
                        alert(data.message);
                        $scope.result2 = [];
                        $scope.paging2 = {
                            totalPage: 1,
                            currentPage: 1,
                            showRows: $scope.paging2.showRows,
                        };
                        return false;
                    }
                    $scope.result2 = data.grid;
                    //重置paging 解决分页指令不能监听对象问题
                    $scope.paging2 = {
                        totalPage: data.total,
                        currentPage: $scope.paging2.currentPage,
                        showRows: $scope.paging2.showRows,
                    };
                }, function (error) {
                    console.log(error);
                });
            }
        }
        //RDC change事件
        $scope.storageRDCChange= function () {
            taskHal.getDataTable({param: {query:{RDC:$scope.storage.storageSelectedRDC}}}, '/CkBaseInfo/getCRCByRDC')
                .then(function (data) {
                    $scope.storageCDC = data.query.CDC;
                    $scope.storageSelectedCDC='-1';
                }, function (error) {
                    console.log(error)
                });
        }
        //CDC change事件
        $scope.storageCDCChange= function () {

        }
        //绑定
        $scope.addressBind = function () {
            if (confirm('确定绑定？')) {
                var selectedItems = [];
                //获取选中
                angular.forEach($scope.result1, function (item) {
                    if (item.pl4GridCheckbox.checked) {
                        selectedItems.push({
                            "id": item.id,
                            "province": item.province,
                            "provinceName": item.provinceName,
                            "city": item.city,
                            "cityName": item.cityName,
                            "address": item.address,
                            "customerID": item.customerID,
                            "factoryId": item.factoryId,
                            "addressId": item.addressId
                        });
                    }
                });
                if (selectedItems.length == 0) {
                    alert('请选择数据');
                    return;
                }
                //获取仓库选择
                //console.log($scope.storageSelectedRDC) RDC
                //console.log($scope.storageSelectedCDC) CDC
                if($scope.storage.storageSelectedCDC=='-1'){
                	alert('请选择CDC！');
                	return;
                }
                //提交绑定数据
                taskHal.getDataTable({param: {grid: selectedItems,query:{CDC:$scope.storage.storageSelectedCDC}}}, '/TaskHall/binding')
                    .then(function (data) {
                        alert(data.message);
                        getTable(0);
                    }, function (error) {
                        console.log(error)
                    });
            }
        }
        //解绑
        $scope.addressUnBind = function () {
            if (confirm('确定解绑吗？')) {
                var selectedItems = [];
                //获取选中
                angular.forEach($scope.result1, function (item) {
                    if (item.pl4GridCheckbox.checked) {
                        selectedItems.push({
                            "id": item.id
                        });
                    }
                });
                if (selectedItems.length == 0) {
                    alert('请选择数据');
                    return;
                }
                //提交解绑数据
                taskHal.getDataTable({param: {grid: selectedItems}}, '/TaskHallAddress/batchUnbundling')
                    .then(function (data) {
                        alert(data.message);
                        getTable(1);
                    }, function (error) {
                        console.log(error)
                    });
            }
        }
        //解绑一条数据
        $scope.unBindOnce= function (index,item) {
            if (confirm('确定解绑吗？')) {
                //提交解绑数据
                taskHal.getDataTable({param: {query: {id:item.id}}}, '/TaskHallAddress/unbundling')
                    .then(function (data) {
                        alert(data.message);
                    }, function (error) {
                        console.log(error)
                    });
            }
        }
        //分页跳转回调
        $scope.goToPage = function (i) {
            getTable(i);
        }

    }]);
});