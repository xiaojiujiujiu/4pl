/**
 * Created by xiaojiu on 2017/5/26.
 */
/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/platform/newUnmannedWarehouse/newUnmannedWarehouseService',, '../../../services/addressLinkageService'], function (app) {
    var app = angular.module('app');
    app.controller('newUnmannedWarehouseCtrl', ['$rootScope', '$scope','$timeout', '$state', '$sce', '$filter', 'HOST', '$window','newUnmannedWarehouse','addressLinkage',
        function ($rootScope, $scope,$timeout, $state, $sce, $filter, HOST, $window,newUnmannedWarehouse,addressLinkage) {
            //获取省
            addressLinkage.getProvince({"param": {"query": {"isAllFlag": 2, "parentId": 0}}})
                .then(function (data) {
                    $scope.addressModel.province = data.query.areaInfo;
                    //$scope.operationManagerAreas.province = data.query.areaInfo;
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
                        if (_this.county){
                            _this.county = data.query.city;
                        }
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
            // 配置查询
            $scope.querySeting = {
                items: [  {
                    type: 'text',
                    model: 'bindQxc',
                    title: '绑定汽修厂'
                }, {
                    type: 'text',
                    model: 'ckBossMan',
                    title: '负责人'
                }],
                btns: [{
                    text: $sce.trustAsHtml('查询'),
                    click: 'searchClick'
                }]
            };
            //table头
            $scope.thHeader = newUnmannedWarehouse.getThead();
            //分页下拉框
            $scope.pagingSelect = [
                {value: 5, text: 5},
                {value: 10, text: 10, selected: true},
                {value: 20, text: 20},
                {value: 30, text: 30},
                {value: 50, text: 50}
            ];
            //分页对象
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: 30,
            };
            //初始化查询
            var pmsSearch = newUnmannedWarehouse.getSearch();
            pmsSearch.then(function (data) {
                $scope.searchModel = data.query;
                $scope.banner=data.banner;
                $scope.giftModel.rdcModelSelect = data.query.rdcId;
                //获取table数据
                get();
            }, function (error) {
                console.log(error)
            });
            //根据rdc获取FDC数据
            $scope.getFdc=function(rdcID){
                newUnmannedWarehouse.getDataTable(
                    {
                        param: {
                            query: {
                                rdcId:rdcID
                            }
                        }
                    },
                    '/fsInfo/getFdcForRdcId'
                ).then(function(data){
                    $scope.giftModel.fdcModelSelect = data.query.cdcIds;
                })
            }
            //根据FDC获取对应的省市区
            $scope.getAddress=function(id){
                newUnmannedWarehouse.getDataTable(
                    {
                        param: {
                            query: {
                                id:id
                            }
                        }
                    },
                    '/fsInfo/getFdcArea'
                ).then(function(data){
                    $scope.addressModel.provinceSelected=data.banner.ckSheng;
                    //触发省选择
                    $scope.addressModel.provinceChange(function () {
                        $scope.addressModel.citySelected = data.banner.ckShi + '';
                        //触发市
                        $scope.addressModel.cityChange(function () {
                            $scope.addressModel.countySelected =data.banner.ckXian + '';
                        });
                    });
                })
            }
            //查询
            $scope.searchClick = function () {
                //重新设置分页从第一页开始
                $scope.paging = {
                    totalPage: 1,
                    currentPage: 1,
                    showRows: $scope.paging.showRows
                };
                get();
            }

            function get() {
                //获取选中 设置对象参数
                var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
                delete opts.rdcId;
                delete opts.cdcId;
                opts.pageNo = $scope.paging.currentPage;
                opts.pageSize = $scope.paging.showRows;
                var promise = newUnmannedWarehouse.getDataTable(
                    {
                        param: {
                            query: opts
                        }
                    },
                    '/fsInfo/fsInfoList'//请求表格的数据接口
                );
                promise.then(function (data) {
                    // $scope.query =data.query;
                    //如果返回code==-1表示服务器出错
                    if(data.code==-1){
                        alert(data.message);
                        $scope.result = [];
                        $scope.paging = {
                            totalPage: 1,
                            currentPage: 1,
                            showRows: $scope.paging.showRows,
                        };
                        return false;
                    }
                    //设置表格指令数据
                    $scope.result = data.grid;

                    //设置分页
                    $scope.paging = {
                        totalPage: data.total,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };
                    // $scope.paging.totalPage = data.total;
                }, function (error) {
                    console.log(error);
                });
            }

            //分页跳转回调
            $scope.goToPage = function () {
                get();
            }
            function initOperationCode() {
              newUnmannedWarehouse.getDataTable({param: {}}, '/fsInfo/initFsCode')
                    .then(function (data) {
                        $scope.banner.ckCode = data.banner.ckCode;
                    });
            }
            //定义标题
            $scope.giftTtle='新建无人仓';
            $scope.isDisabled=false;
            // 添加礼品
            $scope.addGift = function () {
                $scope.giftTtle = "新建无人仓";
                $scope.isDisabled=false;
                //设置清空表单
                $scope.giftModel.ckCode= '';
                $scope.giftModel.qxcName= '';
                $scope.giftModel.benchCount= '';
                $scope.giftModel.ckBossMan= '';
                $scope.giftModel.ckBossPhone= '';
                $scope.giftModel.ckAddress='';
                $scope.giftModel.rdcModel='-1';
                $scope.giftModel.fdcModel=-1;
                $scope.addressModel.provinceSelected=-1;
                $scope.addressModel.citySelected='-1';
                $scope.addressModel.countySelected='-1';
                $('#createGift').modal('show');
                // $scope.confirmBtn = 0;
                initOperationCode();
            }
            //定义表单模型
            $scope.giftModel={
                ckCode:'',
                qxcName:'',
                benchCount:'',
                ckBossMan:'',
                ckBossPhone:'',
                ckAddress:'',
                rdcModel:'-1',
                rdcModelSelect:null,
                fdcModel:-1,
                fdcModelSelect:null,
            }

            // 确认新增
            $scope.enterAdd = function () {
                var phone = /^1[34578]\d{9}$/.test($scope.giftModel.ckBossPhone);
                if(!phone){
                    alert("手机号码有误，请重填");
                    return false;
                }
                var ckBossMan = /^[A-Za-z\u4e00-\u9fa5]+$/.test($scope.giftModel.ckBossMan);
                if(!ckBossMan){
                    alert("负责人不能为数字！");
                    return false;
                }
                if ($scope.giftModel.rdcModel == '-1') {
                    alert('请选择RDC仓库!');
                    return;
                }
                if ($scope.giftModel.fdcModel == '-1' || $scope.giftModel.fdcModel == null) {
                    alert('请选择FDC仓库!');
                    return;
                }
                if ($scope.addressModel.provinceSelected == -1) {
                    alert('请选择仓库地址区域省!');
                    return;
                }
                if ($scope.addressModel.citySelected == '-1') {
                    alert('请选择仓库地址区域市!');
                    return;
                }
                    if ($scope.addressModel.countySelected == '-1') {
                        alert('请选择仓库地址区/县!');
                        return;
                    }
                if($scope.giftModel.benchCount>4){
                    alert("柜子数不能大于4个！");
                    return;
                }
                if($scope.giftModel.benchCount<=0){
                    alert("请输入正确的柜子数！");
                    return;
                }
                console.log($scope.giftModel.benchCount)
                var opts = angular.extend({},  $scope.giftModel, {});//克隆出新的对象，防止影响scope中的对象
                delete opts.rdcModelSelect;
                delete opts.fdcModelSelect;
                opts.ckSheng = $scope.addressModel.provinceSelected;
                opts.ckShi = $scope.addressModel.citySelected;
                opts.ckXian = $scope.addressModel.countySelected;
                opts.ckCode=$scope.banner.ckCode;
                var sendParams = {
                    param: {
                        query:opts
                    }
                }
                //如果gifttitle==添加礼品，走的是添加接口 否就走修改接口
                newUnmannedWarehouse.getDataTable(sendParams, $scope.giftTtle=='新建无人仓'?'/fsInfo/insertCkBaseInfo':'/fsInfo/updateFsInfo')
                    .then(function (data) {
                        alert(data.status.msg)
                        if (data.status.code == "0000") {
                            $('#createGift').modal('hide');
                            get();
                        }
                    })
            }
            //修改
            $scope.updateGift= function (i,item) {
                $scope.giftTtle = "修改无人仓";
                $scope.isDisabled=true;
                //配置的是初始化接口从服务器获取数据
                newUnmannedWarehouse.getDataTable({param: {query: {id: item.id}}},'/fsInfo/initFsInfo')
                    .then(function (data) {
                        //服务器通过id返回数据并绑定到修改的表单中
                        $scope.giftModel.id= data.query.id;
                        $scope.banner.ckCode= data.query.ckCode;
                        $scope.giftModel.benchCount= data.query.benchCount;
                        $scope.giftModel.qxcName= data.query.qxcName;
                        $scope.giftModel.ckAddress= data.query.ckAddress;
                        $scope.giftModel.ckBossMan= data.query.ckBossMan;
                        $scope.giftModel.ckBossPhone= data.query.ckBossPhone;
                        $scope.giftModel.rdcModel=data.query.rdcId;
                        $scope.getFdc($scope.giftModel.rdcModel);
                        $scope.giftModel.fdcModel=data.query.fdcId;
                        $scope.addressModel.provinceSelected = data.query.ckSheng;
                        //触发省选择
                        $scope.addressModel.provinceChange(function () {
                            $scope.addressModel.citySelected = data.query.ckShi + '';
                            //触发市
                            $scope.addressModel.cityChange(function () {
                                $scope.addressModel.countySelected =data.query.ckXian + '';
                            });
                        });
                    })

            }
            //冻结恢复
//            $scope.frozen=function(i,item){
//                newUnmannedWarehouse.getDataTable('/gift/initUpdateGift', {param: {query: {id: item.id}}})
//                    .then(function (data) {
//                       alert(data.status.msg);
//                    })
//            }
            //冻结
            $scope.frozen= function (i,item) {
                if(confirm('确定冻结吗?')) {
                	newUnmannedWarehouse.getDataTable({param:{query:{id:item.id,status:2}}}, '/fsInfo/lockFsBaseInfo')
                        .then(function (data) {
                            if(data.status.code=="0000"){
                                get();
                            }
                            alert(data.status.msg);
                        });
                }
            }
            //恢复
            $scope.perResume= function (i,item) {
                if(confirm('确定恢复吗?')) {
                	newUnmannedWarehouse.getDataTable({param:{query:{id:item.id,status:1}}}, '/fsInfo/lockFsBaseInfo')
                        .then(function (data) {
                            if(data.status.code=="0000"){
                                get();
                            }
                            alert(data.status.msg);
                        });
                }
            }

        }])
});