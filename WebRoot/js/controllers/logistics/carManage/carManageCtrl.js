
'use strict';
define(['../../../app', '../../../services/logistics/carManage/carManageService'], function(app) {
     var app = angular.module('app');
    app.controller('carManageCtrl', ['$scope', '$state', '$sce', 'carManage', function($scope, $state, $sce, carManage) {
        $scope.chinaCities = [
            { py: 'qb', province: '全部', cities: ['全部'] },
            { py: 'rdc', province: 'RDC', cities: ['上海'] },
            { py: 'cdc', province: 'CDC', cities: ['北京'] }
        ];
        $scope.selectSetting = {
            firstName: '物流选择'
        }
        //机构名称
        $scope.wlDept={
            select:{},
            id:'-1'
        };
        // 头部标签跳转
        $scope.orderPackHref = function(){
            $state.go('orderPack')
        }
        // 商品条码查询
        $scope.searchBarcode = function(barCode){
            alert(barCode)
        }
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'vehicleId',
                title: '车辆编号'
            }, {
                type: 'text',
                model: 'licenseNumber',
                title: '车牌号'
            }, {
                type: 'select',
                model: 'vehicleState',
                selectedModel:'vehicleStateSelect',
                title: '状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = carManage.getThead();
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
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 10
        };
        $scope.ifShowSelect=true;
        var pmsSearch = carManage.getSearch();
        pmsSearch.then(function(data) {

            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.wlDept.select=data.query.wlDeptId;
            if($scope.wlDept.select.length>1) {
                $scope.wlDept.id = data.query.wlDeptId[1].id;
            }
            $scope.searchModel.vehicleStateSelect=-1;
            $scope.newCar.vehicleModelSelect=data.query.vehicleModel;
            $scope.newCar.vehicleStateSelect=data.query.vehicleState;
            $scope.labelName = '关联FDC';
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            if(data.query.flag==1){
                $scope.ifShowSelect=false;
            }else {
                $scope.ifShowSelect=true;
            }
            //获取table数据
            get();
        }, function(error) {
            console.log(error)
        });

        //查询
        $scope.searchClick = function() {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            get();
        }
            //任务类型 下拉框change
        $scope.orderTypeIdChange = function() {
            //  console.log($scope.searchModel.orderTypeIdSelect)
        }

        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            delete opts.vehicleModel;
            opts.wlDeptId=$scope.wlDept.id;
            opts.vehicleState = $scope.searchModel.vehicleStateSelect;
            // opts.taskState = $scope.searchModel.putGoodStateSelect;

            // opts.customerId = $scope.searchModel.customerIdSelect;
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = carManage.getDataTable({
                param: {query:opts}
            });
            promise.then(function(data) {
                if (data.code == -1) {
                    alert(data.message);
                    $scope.result = [];
                    $scope.paging = {
                        totalPage: 1,
                        currentPage: 1,
                        showRows: $scope.paging.showRows,
                    };
                    return false;
                }
                $scope.result = data.grid;
                //重置paging 解决分页指令不能监听对象问题
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function(error) {
                console.log(error);
            });
        }
        //新车辆model
        $scope.newCar={
            'id':0,
            "wlDeptId":'',
            "carId":'',
            "vehicleName":'',
            "vehicleId": "",
            "licenseNumber":"",
            "vehicleModel":-1,
            "volume":'',
            "loadCapacity":'',
            "drivingNum":"",
            "remarks":"",
            "vehicleDescription":"",
            'vehicleUnit':'',
            vehicleModelSelect:null,
            vehicleStateSelect:null
        };
        $scope.addCarTitle='新增车辆';
        //新增车辆
        $scope.addCar= function () {
//            if($scope.newCar.vehicleState=='全部'){
//                alert('请选择状态!');
//                return;
//            }
            if($scope.newCar.vehicleModel==-1){
                alert('请选择车型!');
                return;
            }
            var postResult=angular.extend({},$scope.newCar,{});
            delete postResult.vehicleModelSelect;
            delete postResult.vehicleStateSelect;
            carManage.getDataTable({
                    param: {
                        query: postResult
                    }
                },$scope.addCarTitle=='新增车辆'?'/wlCar/saveWlCar':'/wlCar/updateWlCar')
                .then(function (data) {
                    alert(data.status.msg);
                    if(data.status.code=="0000") {
                        get();
                        $('#addCar').modal('hide');
                    }
                }, function (error) {
                    console.log(error)
                });
        }
        //编辑车辆回调
        $scope.editCar= function (index,item) {
            $scope.addCarTitle='修改车辆';
            $scope.newCar.carId=item.carId;
            $scope.newCar.id=item.id;
            $scope.newCar.vehicleName=item.vehicleName;
            $scope.newCar.licenseNumber=item.licenseNumber;
            $scope.newCar.drivingNum=item.drivingNum;
            $scope.newCar.vehicleDescription=item.vehicleDescription;
            $scope.newCar.vehicleUnit=item.vehicleUnit;
            //设置选中车型
            angular.forEach($scope.newCar.vehicleModelSelect, function (k) {
                if(k.name==item.vehicleModel) {
                    $scope.newCar.vehicleModel = k.id;
                    return false;
                }
            });
            //设置选中状态
            angular.forEach($scope.newCar.vehicleStateSelect, function (k) {
                if(k.name==item.vehicleState) {
                    $scope.newCar.vehicleState = k.id;
                    return false;
                }
            });
        }
        //查看车辆回调
        $scope.queryCar= function (index,item) {
            $scope.addCarTitle='查看车辆';
            $scope.newCar.carId=item.carId;
            $scope.newCar.id=item.id;
            $scope.newCar.vehicleName=item.vehicleName;
            $scope.newCar.licenseNumber=item.licenseNumber;
            $scope.newCar.vehicleModel=item.vehicleModel;
            $scope.newCar.drivingNum=item.drivingNum;
            $scope.newCar.vehicleDescription=item.vehicleDescription;
            $scope.newCar.vehicleUnit=item.vehicleUnit;
        }
        // 冻结
        $scope.freezeCar= function (index,item) {
            if(confirm('确定冻结吗?'))
                freezeAndRecovery(item);
        }
        //恢复
        $scope.recovery= function (index,item) {
            if(confirm('确定恢复吗?'))
                freezeAndRecovery(item);
        }
        function freezeAndRecovery(item){
            carManage.getDataTable({
                    param: {
                        "query":{
                            "wlDeptId": $scope.wlDept.id,
                            "carId":item.carId,
                            "id":item.id
                        }
                    }
                },'/wlCar/changeWlCarState')
                .then(function (data) {
                    alert(data.status.msg)
                    if(data.status.code=="0000") {
                        get();
                    }
                }, function (error) {
                    console.log(error)
                });
        }
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
        $scope.deleteData=function(){
            $scope.addCarTitle='新增车辆';
            $scope.newCar.licenseNumber="";
            $scope.newCar.vehicleName="";
            $scope.newCar.vehicleUnit="";
            $scope.newCar.drivingNum="";
            $scope.newCar.vehicleDescription="";
            $scope.newCar.vehicleModel = -1;
        }
    }])
});