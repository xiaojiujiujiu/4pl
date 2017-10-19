/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app', '../../../services/platform/storage-logistics/addStorageLogisticsService', '../../../services/addressLinkageService', '../../../services/rdc2cdcService'], function (app) {
     var app = angular.module('app');
    app.controller('addStorageLogisticsCtrl', ['$scope', '$sce', 'addStorageLogistics', 'HOST', 'addressLinkage', 'rdc2cdc', function ($scope, $sce, addStorageLogistics, HOST, addressLinkage, rdc2cdc) {
        $('select').on('click', function () {
            $('[disabled].form-control, fieldset[disabled] .form-control').css('cursor', 'default');
        }).on('change', function () {
            $('[disabled].form-control, fieldset[disabled] .form-control').css('cursor', 'not-allowed');
        }).on('blur', function () {
            $('[disabled].form-control, fieldset[disabled] .form-control').css('cursor', 'not-allowed');
        })
        //获取省
        addressLinkage.getProvince({"param": {"query": {"isAllFlag": 2, "parentId": 0}}})
            .then(function (data) {
                $scope.addressModel.province = data.query.areaInfo;
                $scope.address2Model.province = data.query.areaInfo;
                $scope.address3Model.province = data.query.areaInfo;
                $scope.operationManagerAreas.province = data.query.areaInfo;
                //$scope.operationManagerAreas.province.splice(0,1);
            }, function (error) {
                console.log(error);
            });
        //省 选择事件
        var provinceChange = function (call) {
            var opt = {
                    query: {parentId: this.provinceSelected}
                },
                _this = this;
            //获取市
            addressLinkage.getCity({param: opt})
                .then(function (data) {
                    _this.city = data.query.city;
                    if (!(call instanceof Function))
                        _this.citySelected = '-1';
                    else
                        call();
                }, function (error) {
                    console.log(error)
                });
            //初始化区
            if (this.county) {
                this.county = [{id: '-1', name: '请选择'}];
                this.countySelected = '-1';
            }
        }
        //市 选择事件
        var cityChange = function (call) {
            var opt = {
                    query: {parentId: this.citySelected}
                },
                _this = this;
            //获取市
            addressLinkage.getCounty({param: opt})
                .then(function (data) {
                    if (_this.county)
                        _this.county = data.query.city;
                    else {
                        angular.forEach(data.query.city, function (item, i) {
                            if (item.id == '-1') {
                                data.query.city.splice(i, 1);
                                return false;
                            }
                        })
                        _this.countyCheckbox = data.query.city;
                    }
                    if (!(call instanceof Function))
                        _this.countySelected = '-1';
                    else
                        call();
                }, function (error) {
                    console.log(error)
                });
        }
        //地址1联动model
        $scope.addressModel = {
            province: [{id: -1, name: '全部'}],
            provinceSelected: -1,
            city: [{id: '-1', name: '全部'}],
            citySelected: '-1',
            county: [{id: '-1', name: '全部'}],
            countySelected: '-1',
            provinceChange: provinceChange,
            cityChange: cityChange
        }
        //地址2联动model
        $scope.address2Model = {
            province: [{id: -1, name: '全部'}],
            provinceSelected: -1,
            city: [{id: '-1', name: '全部'}],
            citySelected: '-1',
            countyCheckbox: [],
            provinceChange: provinceChange,
            cityChange: cityChange
        }
        //地址3联动model
        $scope.address3Model = {
            province: [{id: -1, name: '全部'}],
            provinceSelected: -1,
            city: [{id: '-1', name: '全部'}],
            citySelected: '-1',
            county: [{id: '-1', name: '全部'}],
            countySelected: '-1',
            provinceChange: provinceChange,
            cityChange: cityChange
        }
        // query moudle setting
        $scope.querySeting = addStorageLogistics.getQuerySet0();
        //theadr
        $scope.operationThHeader = addStorageLogistics.getThead0();
        //添加仓库 模拟系统功能数据
        $scope.sysStationData = [
            {
                name: '4PL仓储操作',
                checked: false,
                child: [
                    {
                        name: '收货入库',
                        checked: false
                    },
                    {
                        name: '商品上架',
                        checked: false
                    }, {
                        name: '订单拣货',
                        checked: false
                    }, {
                        name: '订单包装',
                        checked: false
                    }, {
                        name: '退货取货单打印',
                        checked: false
                    }
                ]
            }, {
                name: '4PL仓储操作2',
                child: [
                    {
                        name: '收货入库2',
                        checked: false
                    },
                    {
                        name: '商品上架2',
                        checked: false
                    }, {
                        name: '订单拣货2',
                        checked: false
                    }, {
                        name: '订单包装2',
                        checked: false
                    }, {
                        name: '退货取货单打印2',
                        checked: false
                    }
                ]
            }
        ];
        //添加仓库 checkbox change事件
        $scope.checkedChange = function (item, check) {
            var isCheckFlag = false;
            angular.forEach(item.child, function (k) {
                if (!k.checked) {
                    isCheckFlag = true;
                    return false;
                }
            });
            item.checked = !isCheckFlag;
        }
        $scope.checkedChangeAll = function (item) {
            angular.forEach(item.child, function (k) {
                k.checked = item.checked;
            });
        }
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
        $scope.storagePaging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        //分页对象2
        $scope.logisticPaging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        //分页对象3
        $scope.operationPaging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        //子运营查询
        $scope.searchClick0 = function () {
            $scope.operationPaging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.operationPaging.showRows
            };
            getGrid(-1);
        }
        //仓储查询查询
        $scope.searchClick1 = function () {
            $scope.storagePaging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.storagePaging.showRows
            };
            getGrid(0);
        }
        //物流查询查询
        $scope.searchClick2 = function () {
            $scope.logisticPaging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.logisticPaging.showRows
            };
            getGrid(1);
        }
        $scope.isStorageOrLogistics = -1;
        //标签切换
        $scope.navClick = function (n) {
            switch (n) {
                case -1:
                    $scope.querySeting = addStorageLogistics.getQuerySet0();
                    $scope.storageThHeader = addStorageLogistics.getThead1();
                    $scope.isStorageOrLogistics = -1;
                    getSearch(-1);
                    break;
                case 0:
                    $scope.querySeting = addStorageLogistics.getQuerySet1();
                    $scope.sysStationData = [
                        {
                            name: '4PL仓储操作',
                            checked: false,
                            child: [
                                {
                                    name: '收货入库',
                                    checked: false
                                },
                                {
                                    name: '商品上架',
                                    checked: false
                                }, {
                                    name: '订单拣货',
                                    checked: false
                                }, {
                                    name: '订单包装',
                                    checked: false
                                }, {
                                    name: '退货取货单打印',
                                    checked: false
                                }
                            ]
                        }, {
                            name: '4PL仓储操作2',
                            child: [
                                {
                                    name: '收货入库2',
                                    checked: false
                                },
                                {
                                    name: '商品上架2',
                                    checked: false
                                }, {
                                    name: '订单拣货2',
                                    checked: false
                                }, {
                                    name: '订单包装2',
                                    checked: false
                                }, {
                                    name: '退货取货单打印2',
                                    checked: false
                                }
                            ]
                        }
                    ];
                    $scope.storageThHeader = addStorageLogistics.getThead1();
                    $scope.isStorageOrLogistics = true;
                    getSearch(0);
                    break;
                case 1:
                    $scope.querySeting = addStorageLogistics.getQuerySet2();
                    $scope.sysStationData = [
                        {
                            name: '物流系统--操作',
                            checked: false,
                            child: [
                                {
                                    name: '任务大厅',
                                    checked: false
                                },
                                {
                                    name: '订单配送',
                                    checked: false
                                }, {
                                    name: '取货单打印',
                                    checked: false
                                }, {
                                    name: '订单回执',
                                    checked: false
                                }, {
                                    name: '自营订单登记',
                                    checked: false
                                }
                            ]
                        }, {
                            name: '物流系统--管理设置',
                            child: [
                                {
                                    name: '物流任务管理',
                                    checked: false
                                },
                                {
                                    name: '线路管理',
                                    checked: false
                                }, {
                                    name: '车辆管理',
                                    checked: false
                                }, {
                                    name: '运费管理',
                                    checked: false
                                }, {
                                    name: '承运损毁登记',
                                    checked: false
                                }
                            ]
                        }
                    ];
                    $scope.logisticThHeader = addStorageLogistics.getThead2();
                    $scope.isStorageOrLogistics = false;
                    getSearch(1);
                    initRDC();
                    break;
            }
        }

        $scope.searchModel = {
            code: '',
            name: ''
        };
        function getSearch(i) {
            if (i == -1) {
                getGrid(i);
            }
            else if (i == 0) {
                var s1 = addStorageLogistics.getSearch1();
                s1.then(function (data) {
                	//console.log(data)
                    $scope.searchModel = data.query;
                    $scope.searchModel.ckTypeSelect = -1;
                    $scope.searchModel.partyIdSelect = "-1";
                    getGrid(0);
                }, function (error) {
                    console.log(error)
                })
            } else if (i == 1) {
            	//console.log(data)
                var s2 = addStorageLogistics.getSearch2();
                s2.then(function (data) {
                    $scope.searchModel = data.query;
                    $scope.searchModel.cooperationTypeSelect = -1;
                    $scope.searchModel.wlTypeSelect = -1;
                    getGrid(1);
                }, function (error) {
                    console.log(error)
                })
            }
        }

        function getGrid(i) {
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            var promis;
            if (i == -1) {
                opts.code = $scope.searchModel.code;
                opts.name = $scope.searchModel.name;

                opts.page = $scope.operationPaging.currentPage;
                opts.pageSize = $scope.operationPaging.showRows;
                promis = addStorageLogistics.getDataTable0({param: {query: opts}});
                promis.then(function(data){
                	$scope.showFlag = data.query.showPartyFlag;
                	/*if(!$scope.showFlag){
                		$('.nav li').eq(1).addClass('active').siblings().removeClass('active');
                	}*/
                	// console.log(data)
                })
            }
            else if (i == 0) {
                opts.ckType = $scope.searchModel.ckTypeSelect;
                opts.partyId = $scope.searchModel.partyIdSelect;

                opts.page = $scope.storagePaging.currentPage;
                opts.pageSize = $scope.storagePaging.showRows;
                promis = addStorageLogistics.getDataTable1({param: {query: opts}});

            } else if (i == 1) {
                opts.cooperationType = $scope.searchModel.cooperationTypeSelect || '-1';
                opts.wlType = $scope.searchModel.wlTypeSelect || '-1';
                opts.page = $scope.logisticPaging.currentPage;
                opts.pageSize = $scope.logisticPaging.showRows;
                promis = addStorageLogistics.getDataTable2({param: {query: opts}});
            }

            promis.then(function (data) {
                    if (i == -1) {
                        if (data.code == -1) {
                            alert(data.message);
                            $scope.operationResult = [];
                            $scope.operationPaging = {
                                totalPage: 1,
                                currentPage: 1,
                                showRows: $scope.operationPaging.showRows,
                            };
                            return false;
                        }
                        $scope.operationResult = data.grid;
                        $scope.operationPaging = {
                            totalPage: data.total,
                            currentPage: $scope.operationPaging.currentPage,
                            showRows: $scope.operationPaging.showRows,
                        };
                    } else if (i == 0) {
                        if (data.code == -1) {
                            alert(data.message);
                            $scope.storageResult = [];
                            $scope.storagePaging = {
                                totalPage: 1,
                                currentPage: 1,
                                showRows: $scope.storagePaging.showRows,
                            };
                            return false;
                        }
                        $scope.storageResult = data.grid;
                        $scope.storagePaging = {
                            totalPage: data.total,
                            currentPage: $scope.storagePaging.currentPage,
                            showRows: $scope.storagePaging.showRows,
                        };
                    } else if (i == 1) {
                        if (data.code == -1) {
                            alert(data.message);
                            $scope.logisticResult = [];
                            $scope.logisticPaging = {
                                totalPage: 1,
                                currentPage: 1,
                                showRows: $scope.logisticPaging.showRows,
                            };
                            return false;
                        }
                        $scope.logisticResult = data.grid;
                        $scope.logisticPaging = {
                            totalPage: data.total,
                            currentPage: $scope.logisticPaging.currentPage,
                            showRows: $scope.logisticPaging.showRows,
                        };
                    }
                }
                ,
                function (error) {
                    console.log(error)
                }
            )
        }

        getSearch(-1);
        $scope.goToPage = function (i) {
            getGrid(i);
        }
        $scope.operationModel = {
            id: '',
            code: 0,
            name: '',
            shengId: '',
            shiId: '',
            xianId: '',
            address: '',
            connector: '',
            phone: '',
            managerAreas: '',
            managerAreasNames: '',
        };
        $scope.operationManagerAreas = {
            province: [],
            checkedChange: function (item) {
                var regName = new RegExp('(,)*(' + item.name + ')');
                var regId = new RegExp('(,)*(' + item.id + ')');

                var isReplace = false;
                if (item.checked) {
                    if (!regName.test($scope.operationModel.managerAreasNames)) {
                        $scope.operationModel.managerAreasNames += ($scope.operationModel.managerAreasNames != '' ? ',' : '') + item.name;
                        $scope.operationModel.managerAreas += ($scope.operationModel.managerAreas != '' ? ',' : '') + item.id;
                    }
                } else
                    isReplace = true;
                if (isReplace) {
                    $scope.operationModel.managerAreasNames = $scope.operationModel.managerAreasNames.replace(regName, '');
                    $scope.operationModel.managerAreas = $scope.operationModel.managerAreas.replace(regId, '');
                    if ($scope.operationModel.managerAreasNames.substr(0, 1) == ',') {
                        $scope.operationModel.managerAreasNames = $scope.operationModel.managerAreasNames.substr(1, $scope.operationModel.managerAreasNames.length);
                        $scope.operationModel.managerAreas = $scope.operationModel.managerAreas.substr(1, $scope.operationModel.managerAreas.length);
                    }
                }
            }
        }
        //初始化子运营编号
        function initOperationCode() {
            addStorageLogistics.getData({param: {}}, '/party/getPartyCode')
                .then(function (data) {
                    $scope.operationModel.code = data.query.partyCode;
                    $scope.operationModel.id = data.query.id;
                });
        }

        initOperationCode();
        $scope.operationTitle = '新增子运营';
        //添加子运营
        $scope.btnAddOperation = function () {
            $scope.operationTitle = '新增子运营';
            angular.forEach($scope.operationManagerAreas.province, function (item) {
                    item.checked = false;
            })
            $scope.operationModel = {
                id: '',
                code: 0,
                name: '',
                shengId: '',
                shiId: '',
                xianId: '',
                address: '',
                connector: '',
                phone: '',
                managerAreas: '',
                managerAreasNames: '',
            };
            $scope.address3Model.provinceSelected = -1;
            $scope.address3Model.city = [{id: '-1', name: '请选择'}];
            $scope.address3Model.citySelected = '-1';
            $scope.address3Model.county = [{id: '-1', name: '请选择'}];
            $scope.address3Model.countySelected = '-1';
            initOperationCode();
        }
        //保存子运营
        $scope.operationEnterAdd = function () {
            if ($scope.address3Model.provinceSelected == -1) {
                alert('请选择子运营公司区域省!');
                return;
            }
            if ($scope.address3Model.citySelected == '-1') {
                alert('请选择子运营公司区域市!');
                return;
            }
            if($scope.address3Model.county.length>1){
                if ($scope.address3Model.countySelected == '-1') {
                    alert('请选择子运营公司区域区县!');
                    return;
                }
            }
            //台湾.香港.澳门
            //if(parseInt($scope.address3Model.provinceSelected)!=420000&&parseInt($scope.address3Model.provinceSelected)!=430000&&parseInt($scope.address3Model.provinceSelected)!=440000) {
            //
            //
            //}
            $scope.operationModel.shengId = $scope.address3Model.provinceSelected;
            $scope.operationModel.shiId = $scope.address3Model.citySelected;
            $scope.operationModel.xianId = $scope.address3Model.countySelected;
            addStorageLogistics.getData({
                    param: {
                        query: $scope.operationModel
                    }
                }, $scope.operationTitle == '新增子运营' ? '/party/insertParty' : '/party/updateParty')
                .then(function (data) {
                    if (data.status.code == "0000") {
                        alert(data.status.msg);
                        getGrid(-1);
                        $('#addOperationModal').modal('hide');
                    }
                    alert(data.status.msg);
                })
        }
        //修改子运营
        $scope.updateOperation = function (index, item) {
            $scope.operationTitle = '修改子运营';
            addStorageLogistics.getData({param: {query: {id: item.id}}}, '/party/initParty')
                .then(function (data) {
                    $scope.operationModel.id = data.banner.id;
                    $scope.operationModel.code = data.banner.code;
                    $scope.operationModel.name = data.banner.name;
                    $scope.operationModel.shengId = data.banner.shengId;
                    $scope.operationModel.shiId = data.banner.shiId;
                    $scope.operationModel.xianId = data.banner.xianId;
                    $scope.operationModel.address = data.banner.address;
                    $scope.operationModel.connector = data.banner.connector;
                    $scope.operationModel.phone = data.banner.phone;
                    $scope.operationModel.managerAreas = data.banner.managerAreas;
                    var _managerAreas = data.banner.managerAreas.split(',');
                    $scope.operationModel.managerAreasNames = '';
                    for (var i = 0; i < _managerAreas.length; i++) {
                        angular.forEach($scope.operationManagerAreas.province, function (province) {
                            if (parseInt(_managerAreas[i]) == parseInt(province.id)) {
                                $scope.operationModel.managerAreasNames += ($scope.operationModel.managerAreasNames != '' ? ',' : '') + province.name;
                                province.checked = true;
                            }
                        })
                    }
                    $scope.address3Model.provinceSelected = data.banner.shengId;
                    //触发省选择
                    $scope.address3Model.provinceChange(function () {
                        $scope.address3Model.citySelected = data.banner.shiId + '';
                        //触发市
                        $scope.address3Model.cityChange(function () {
                            $scope.address3Model.countySelected = data.banner.xianId + '';
                        });
                    });
                });

        }
        //冻结子运营
        $scope.freezeOperation = function (index, item, btn) {
            if (confirm('确定冻结吗?')) {
                addStorageLogistics.getData({param: {query: {id: item.id, partyStatus: 2}}}, '/party/lockParty')
                    .then(function (data) {
                        if (data.status.code =="0000") {
                            getGrid(-1);
                        }
                        alert(data.status.msg);
                    });
            }
        }
        //恢复子运营
        $scope.restoreOperation = function (index, item) {
            if (confirm('确定恢复吗?')) {
                addStorageLogistics.getData({param: {query: {id: item.id, partyStatus: 1}}}, '/party/lockParty')
                    .then(function (data) {
                        if (data.status.code =="0000") {
                            getGrid(-1);
                        }
                        alert(data.status.msg);
                    });
            }
        }
        //管理区域点击
        $scope.managerAreasClick = function (e) {
            $('.operation-area-manage').show();
        }
        //管理区域确认
        $scope.operationManagerAreasEnter = function () {
            $('.operation-area-manage').hide();
        }
        //管理区域取消
        $scope.operationManagerAreasCancel = function () {
            $scope.operationModel.managerAreasNames = '';
            angular.forEach($scope.operationManagerAreas.province, function (item) {
                if (item.checked)
                    item.checked = false;
            })
            $scope.operationModel.managerAreas = '';
            $('.operation-area-manage').hide();
        }
        $scope.storageTitle = '新增仓库';
        //添加仓库model
        $scope.storateModel = {
            ckName: '',
            bindGarageAmount: '',
            ckFacilitator: '',
            deliveryFacilitator: '',
            acreage: '',
            rent: '',
            ckType: 1,
            leaseTime: '',
            signDate: '',
            contractPeriod: '',
            remarks: '',
            ckSheng: '',
            ckShi:'',
            ckXian:'',
        };
        $scope.partyId={
            select: [],
            id: '1',
        }
        $scope.cooperationType={
            select: [],
            id: '1',
        }
        $scope.signState={
            select: [],
            id: '1',
        }
        $scope.payType={
            select: [],
            id: '1',
        }
        //仓库类型model
        $scope.storageTypeModel = [];
        $scope.storageParentRDC = {
            select: [],
            id: '-1',
            change: function () {
                addStorageLogistics.postData({"param": {query: {RDCId: this.id}}}, '/CkBaseInfo/getCDCCode')
                    .then(function (data) {
                        $scope.storateModel.ckId = data.query.CDCCode;
                    });

            }
        };
        //初始化上级RDC
        function initParentRDC() {
            addStorageLogistics.postData({"param": {}}, '/CkBaseInfo/getRDCList')
                .then(function (data) {
                    $scope.storageParentRDC.select = data.query.RDC;
                });
        }

        $scope.storageTypeChange = function () {
            if ($scope.storateModel.ckType == 2) {
                initParentRDC();
                $scope.isSelectCkCDC = true;
                $scope.isRdcPartyDisabled = true;
                $scope.storateModel.ckId = '';
                $scope.storageParentRDC.id = '-1';
            } else {
                addStorageLogistics.postData({"param": {}}, '/CkBaseInfo/getRDCCode')
                    .then(function (data) {
                        $scope.storateModel.ckId = data.query.RDCCode;
                    });
                $scope.isSelectCkCDC = false;
                $scope.isRdcPartyDisabled = false;
            }

        }
        //合作形式model
        $scope.cooperationTypeModel = [];
        //新增仓库 确认按钮
        $scope.storageEnterAdd = function () {
//if(toString($scope.storateModel.rent).length>6){
            //    alert('仓库租金只能为6位以下的数字');
            //    return;
            //}
            if ($scope.storateModel.ckType == 2 && $scope.storageParentRDC.id == '-1') {
                alert('请选择上级RDC');
                return;
            }
            if ($scope.storateModel.ckType == 1 && $scope.partyId.id == 1) {
                alert('请选择所属运营');
                return;
            }
            if ($scope.addressModel.provinceSelected == -1) {
                alert('请选择所属区域省!');
                return;
            }
            if ($scope.addressModel.citySelected == '-1') {
                alert('请选择所属区域市!');
                return;
            }
            if($scope.addressModel.county.length>1){
                if ($scope.addressModel.countySelected == '-1') {
                    alert('请选择所属区域区县!');
                    return;
                }
            }
            if ($scope.storateModel.signDate== '') {
                alert('请输入签约日期!');
                return;
            }
            $scope.storateModel.parentId = $scope.storageParentRDC.id != '-1' ? $scope.storageParentRDC.id : '';
            $scope.storateModel.ckSheng = $scope.addressModel.provinceSelected;
            $scope.storateModel.ckShi = $scope.addressModel.citySelected;
            $scope.storateModel.ckXian = $scope.addressModel.countySelected;
            $scope.storateModel.partyId = $scope.partyId.id;
            $scope.storateModel.cooperationType = $scope.cooperationType.id;
            $scope.storateModel.signState = $scope.signState.id;
            $scope.storateModel.payType = $scope.payType.id;
            addStorageLogistics.postData({param: {query: $scope.storateModel}}, $scope.storageTitle == '新增仓库' ? '/CkBaseInfo/insertCkBaseInfo' : '/CkBaseInfo/updateCkBaseInfo')
                .then(function (data) {
                    if (data.status.code == "0000") {
                        getGrid(0);
                        $('#addStorageModal').modal('hide');
                    }
                    alert(data.status.msg);
                }, function (error) {
                    console.log(error)
                });

        }
        //仓库类型是否可选
        $scope.isCheckStorage = true;
        $scope.isCheckStoragecdc = true;
        $scope.isRdcPartyDisabled = true;
        $scope.Modify = true;
        //修改仓库
        $scope.isShow=true;
        $scope.updateStorage = function (i, item) {
            $scope.isCheckStorage = false;
            $scope.isCheckStoragecdc = false;
            $scope.isRdcPartyDisabled = false;
            $scope.Modify = false;
            $scope.storageTitle = '修改仓库';
            addStorageLogistics.postData({"param": {"query": {"id": item.id}}}, '/CkBaseInfo/initUpdateCkBaseInfo')
                .then(function (data) {
                    $scope.storageTypeModel = data.query.ckType;
                    $scope.cooperationTypeModel = data.query.cooperationType;

                    $scope.partyId.select = data.query.party;
                    $scope.cooperationType.select = data.query.cooperationType;
                    $scope.signState.select = data.query.signState;
                    $scope.payType.select = data.query.payType;

                    $scope.partyId.id = data.query.partyId;
                   
                    $scope.cooperationType.id = data.query.cooperationTypeId;
                    $scope.signState.id = data.query.signStateId;
                    $scope.payType.id = data.query.payTypeId;


                    $scope.storateModel = {
                        id: item.id,
                        ckType: data.query.checkedCkType,
                        ckSheng: data.query.ckSheng,
                        ckShi: data.query.ckShi,
                        ckXian: data.query.ckXian,
                        ckAddress: data.query.ckAddress,
                        ckName: data.query.ckName,
                        bindGarageAmount:data.query.bindGarageAmount,
                        ckFacilitator:data.query.ckFacilitator,
                        deliveryFacilitator:data.query.deliveryFacilitator,
                        acreage:data.query.acreage,
                        rent: data.query.rent,
                        leaseTime: data.query.leaseTime,
                        signDate:data.query.signDate,
                        contractPeriod: data.query.contractPeriod,
                        remarks:data.query.remarks,
                    };
                    if($scope.storateModel.ckSheng==null || $scope.storateModel.ckShi==null){
                        $scope.isShow=false;
                    }else{
                        $scope.isShow=true;
                    }
                    if (data.query.checkedCkType == 2) {
                        initParentRDC();
                        $scope.isSelectCkCDC = true;
                        $scope.isCheckStoragecdc = true;
                        $scope.isCheckStorage = true;
                        $scope.isRdcPartyDisabled = true;
                        $scope.storageParentRDC.id = data.query.parentId + '';
                    } else{
                        $scope.isSelectCkCDC = false;
                        $scope.isCheckStoragecdc = false;
                        $scope.isCheckStorage = false;
                        $scope.isRdcPartyDisabled = false;
                    }
                    $scope.addressModel.provinceSelected = data.query.ckSheng;
                    //触发省选择
                    $scope.addressModel.provinceChange(function () {
                        $scope.addressModel.citySelected = data.query.ckShi + '';
                        //触发市
                        $scope.addressModel.cityChange(function () {
                            $scope.addressModel.countySelected = data.query.ckXian + '';
                        });
                    });
                   /* $scope.address2Model.provinceSelected = parseInt(data.query.mgSheng);
                    //触发省选择
                    $scope.address2Model.provinceChange(function () {
                        $scope.address2Model.citySelected = data.query.mgShi + '';
                        //触发市
                        $scope.address2Model.cityChange(function () {
                            //多选县
                            angular.forEach($scope.storateModel.mgXian, function (kk1) {

                                angular.forEach($scope.address2Model.countyCheckbox, function (kk2) {
                                    if (parseInt(kk1.areaId) == parseInt(kk2.id)) {
                                        kk2.checked = true;
                                    }
                                })
                            });
                        });
                    });*/
                }, function (error) {
                    console.log(error);
                });

        }
        //新增仓库按钮事件
        $scope.btnAddStorage = function () {
            $scope.storageTitle = '新增仓库';
            $scope.isCheckStorage = true;
            $scope.isCheckStoragecdc = true;
            $scope.isRdcPartyDisabled = true;
            $scope.Modify = true;
            //$scope.isCheckStorage = true;
            //$scope.isCheckStoragecdc = false;
            //$scope.isSelectCkCDC = false;
            //$scope.isRdcPartyDisabled = false;
            addStorageLogistics.postData({"param": {}}, '/CkBaseInfo/initAddCkBaseInfo')
                .then(function (data) {
                    //获取仓储编号
                    //addStorageLogistics.postData({"param": {}}, '/CkBaseInfo/getRDCCode')
                    //    .then(function (data) {
                    //        $scope.storateModel.ckId = data.query.RDCCode;
                    //    });
                    $scope.storageTypeModel = data.query.ckType;
                    $scope.partyId.select = data.query.partyId;
                    $scope.cooperationType.select = data.query.cooperationType;
                    $scope.signState.select = data.query.signState;
                    $scope.payType.select = data.query.payType;
                    $scope.storateModel = {
                        ckName: '',
                        bindGarageAmount: '',
                        ckFacilitator: '',
                        deliveryFacilitator: '',
                        acreage: '',
                        rent: '',
                        ckType: 1,
                        leaseTime: '',
                        signDate: '',
                        contractPeriod: '',
                        remarks: '',
                        ckSheng: '',
                        ckShi:'',
                        ckXian:'',
                    };
                }, function (error) {
                    console.log(error);
                });

            $scope.addressModel.provinceSelected = -1;
            $scope.addressModel.city = [{id: '-1', name: '请选择'}];
            $scope.addressModel.citySelected = '-1';
            $scope.addressModel.county = [{id: '-1', name: '请选择'}];
            $scope.addressModel.countySelected = '-1';

        }
        //冻结仓库
        $scope.deleteStorage = function (i, item) {
            //if (confirm('确定冻结吗?')) {
                addStorageLogistics.postData({"param": {"query": {"id": item.id}}}, '/CkBaseInfo/deleteCkBaseInfo')
                    .then(function (data) {
                        if (data.status.code == "0000")
                            getGrid(0);
                        alert(data.status.msg);
                    }, function (error) {
                        console.log(error);
                    });
           // }
        }

        //初始化RDC
        function initRDC() {
            rdc2cdc.getRDC({param: {}})
                .then(function (data) {
                    $scope.RDCModel.select = data.query.RDC;
                }, function (error) {
                    console.log(error);
                });
        }

        initRDC();
        $scope.isSelectCkCDC = false;
        $scope.isRdcPartyDisabled = false;
        $scope.RDCModel = {
            select: [],
            id: '-1',
            isDisable: false,
            change: function (call) {

                if ($scope.wlType.id != 1) {
                    rdc2cdc.getCDC({param: {"query": {"RDC": $scope.RDCModel.id}}})
                        .then(function (data) {
                            if (data.query.CDC.length == 1 && data.query.CDC[0].id == '-1') {

                                data.query.CDC.splice(0, 1);
                            }
                            if (!$scope.isStorageOrLogistics && !call)
                                getWlNum($scope.RDCModel.id);
                            $scope.CDCModel.select = data.query.CDC;
                            if (!(call instanceof Function))
                                $scope.CDCModel.id = '-1';
                            else
                                call();
                        }, function (error) {
                            console.log(error);
                        });
                } else {
                    if (!$scope.isStorageOrLogistics && !call)
                        getWlNum($scope.RDCModel.id);
                }
            }
        }
        $scope.CDCModel = {
            select: [],
            id: '-1',
            isDisable: false,
            change: function () {
                if (!$scope.isStorageOrLogistics)
                    getWlNum($scope.CDCModel.id);
            }
        }
        //根据仓库获取物流编号
        function getWlNum(id) {
            addStorageLogistics.postData({param: {query: {ckId: id}}}, '/CkBaseInfo/getWlDeptCodeByCkId')
                .then(function (data) {
                    if (data.code == -1) {
                        alert(data.message);
                        return;
                    }
                    $scope.logisticModel.wlDeptId = data.query.WlDeptCode;
                });
        }

        //新增配送中心model
        $scope.logisticModel = {
            wlDeptId: '',
            wlDeptName: '',
            address: '',
            bossMan: '',
            bossPhone: '',
            cooperationType: 1,
            managCompany: '',
            wlSheng: '',
            wlShi: '',
            wlXian: '',
            owerCKId: ''
        };
        $scope.logisticCooperationTypeModel = [];
        $scope.logisticTitle = '新增配送中心';
        //配送中心类型
        $scope.wlType = {
            id: -1,
            select: [],
            change: function () {
                $scope.RDCModel.id = '-1';
                $scope.CDCModel.id = '-1';
                $scope.CDCModel.select = [];
            },
            isDisable: false
        };
        $scope.party = {
            id: -1,
            select: [],
            isDisable: false
        };
        $scope.btnAddLogistic = function () {
            $scope.logisticTitle = '新增配送中心';
            $scope.RDCModel.id = '-1';
            $scope.CDCModel.id = '-1';
            $scope.wlType.isDisable = false;
            $scope.RDCModel.isDisable = false;
            $scope.CDCModel.isDisable = false;
            addStorageLogistics.postData({"param": {}}, '/wlDept/initAddWlDept')
                .then(function (data) {
                    $scope.wlType.select = data.query.wlType;
                    $scope.wlType.select.splice(0, 0, {id: -1, name: '请选择'});
                    $scope.wlType.id = -1;
                    $scope.logisticCooperationTypeModel = data.query.cooperationType;
//                    $scope.party.select = data.query.party;
                    $scope.party.select.splice(0, 0, {id: -1, name: '请选择'});
                    $scope.party.id = -1;
                }, function (error) {
                    console.log(error);
                });
            $scope.logisticModel = {
                wlDeptId: '',
                wlDeptName: '',
                address: '',
                bossMan: '',
                bossPhone: '',
                cooperationType: 1,
                managCompany: '',
                wlSheng: '',
                wlShi: '',
                wlXian: '',
                owerCKId: ''
            };
            $scope.addressModel.provinceSelected = -1;
            $scope.addressModel.city = [{id: '-1', name: '请选择'}];
            $scope.addressModel.citySelected = '-1';
            $scope.addressModel.county = [{id: '-1', name: '请选择'}];
            $scope.addressModel.countySelected = '-1';
        }
        
        //根据仓库Id，获取运营LIST
        $scope.getPartySelectListByCkId = function (ckId) {
        	addStorageLogistics.postData({param: {query: {ckId: ckId}}},'/party/getPartySelectListByCkId' ).then(function (data) {
                try {
                	$scope.party.select = data.query.party;
                	$scope.party.id = data.query.party[0].id;
                    //$scope.wlSecondSubSelectModel = data.query.wlDeptList[0].id;
            }catch (e){}
            })
        }
        //根据仓库Id，获取运营LIST
        $scope.getPartySelectListByCkIdStorage = function (ckId) {
            addStorageLogistics.postData({param: {query: {id: ckId}}},'/CkBaseInfo/bindYY' ).then(function (data) {
                try {
                    $scope.partyId.select = data.query.party;
                    $scope.partyId.id = data.query.party[0].id;
                    //$scope.wlSecondSubSelectModel = data.query.wlDeptList[0].id;
                }catch (e){}
            })
        }
        
        //修改配送中心
        $scope.updateLogistic = function (i, item) {
            $scope.logisticTitle = '修改配送中心';
            $scope.wlType.isDisable = true;
            $scope.RDCModel.isDisable = true;
            $scope.CDCModel.isDisable = true;
            addStorageLogistics.postData({"param": {query: {id: item.id}}}, '/wlDept/initUpdateWlDept')
                .then(function (data) {
                    $scope.logisticModel = {
                        id: item.id,
                        wlDeptId: data.query.wlDeptId,
                        wlDeptName: data.query.wlDeptName,
                        address: data.query.address,
                        bossMan: data.query.bossMan,
                        bossPhone: data.query.bossPhone,
                        cooperationType: data.query.checkedCooperationType,
                        managCompany: data.query.managCompany,
                        wlSheng: data.query.wlSheng,
                        wlShi: data.query.wlShi,
                        wlXian: data.query.wlXian,
                        owerCKId: data.query.owerCKId
                    };
                    $scope.wlType.select = data.query.wlType;
                    $scope.wlType.select.splice(0, 0, {id: -1, name: '全部'});
                    $scope.wlType.id = data.query.wlTypeId || -1;
                    $scope.logisticCooperationTypeModel = data.query.cooperationType;
                    $scope.addressModel.provinceSelected = data.query.wlSheng;
                    $scope.party.select = data.query.party;
                    $scope.party.select.splice(0, 0, {id: -1, name: '请选择'});
                    $scope.party.id = data.query.partyId;
                    //触发省选择
                    $scope.addressModel.provinceChange(function () {
                        $scope.addressModel.citySelected = data.query.wlShi + '';
                        //触发市
                        $scope.addressModel.cityChange(function () {
                            $scope.addressModel.countySelected = data.query.wlXian + '';
                        });
                    });
                    $scope.RDCModel.id = data.query.owerRDCId + '';
                    $scope.CDCModel.select = [];
                    $scope.CDCModel.id = '-1';
                    if (parseInt(data.query.owerCDCId) != -1) {
                        $scope.RDCModel.change(function () {
                            $scope.CDCModel.id = data.query.owerCDCId + '';
                        });
                    }
                }, function (error) {
                    console.log(error);
                });
        }
        //删除物流
        $scope.deleteLogistic = function (i, item) {
            if (confirm('确定删除吗?')) {
                addStorageLogistics.postData({"param": {query: {id: item.id}}}, '/wlDept/deleteWlDept')
                    .then(function (data) {
                        if (data.status.code == "0000")
                            getGrid(1);
                        alert(data.status.msg);
                    }, function (error) {
                        console.log(error);
                    });
            }
        }
        //新增配送中心 确认按钮
        $scope.logisticEnterAdd = function () {
            if (!$scope.wlType.isDisable) {
                if ($scope.wlType.id == -1) {
                    alert('请选择配送中心类型!');
                    return;
                }
                $scope.logisticModel.wlType = $scope.wlType.id;
            }
            if ($scope.RDCModel.id == '-1') {
                alert('请选择仓库RDC');
                return;
            }
            $scope.logisticModel.owerCKId = $scope.CDCModel.id == -1 ? $scope.RDCModel.id : $scope.CDCModel.id;
            if ($scope.addressModel.provinceSelected == -1) {
                alert('请选择所属区域省!');
                return;
            }
            if ($scope.addressModel.citySelected == '-1') {
                alert('请选择所属区域市!');
                return;
            }
            if($scope.addressModel.county.length>1){
                if ($scope.addressModel.countySelected == '-1') {
                    alert('请选择所属区域区县!');
                    return;
                }
            }
            //台湾.香港.澳门
            //if(parseInt($scope.addressModel.provinceSelected)!=420000&&parseInt($scope.addressModel.provinceSelected)!=430000&&parseInt($scope.addressModel.provinceSelected)!=440000) {
            //}
            if ($scope.party.id == -1) {
                alert('请选择所属运营!');
                return;
            }
            $scope.logisticModel.party = $scope.party.id;
            $scope.logisticModel.wlSheng = $scope.addressModel.provinceSelected;
            $scope.logisticModel.wlShi = $scope.addressModel.citySelected;
            $scope.logisticModel.wlXian = $scope.addressModel.countySelected;
            addStorageLogistics.postData({"param": {query: $scope.logisticModel}}, $scope.logisticTitle == '新增配送中心' ? '/wlDept/insertWlDept' : '/wlDept/updateWlDept')
                .then(function (data) {
                    if (data.status.code == "0000") {
                        getGrid(1);
                        $('#addLogisticModal').modal('hide');
                    }
                    alert(data.status.msg);
                }, function (error) {
                    console.log(error);
                });
        }

    }]);
});