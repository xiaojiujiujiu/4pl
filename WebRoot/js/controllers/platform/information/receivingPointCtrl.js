/**
 * Created by xiaojiu on 2016/11/22.
 */
define(['../../../app','../../../services/platform/information/receivingPointService', '../../../services/addressLinkageService'], function (app) {
     var app = angular.module('app');
    app.controller('receivingPointCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','receivingPoint','addressLinkage',
        function ($rootScope, $scope, $state, $sce, $filter, HOST, $window, receivingPoint,addressLinkage) {
            // query moudle setting
            $scope.querySeting = {
                items: [{
                    type: 'text',
                    model: 'receivingPointName',
                    title: '收货点名称'
                },{
                    type: 'date',
                    model: ['startTime', 'endTime'],
                    title: '创建时间'
                }, {
                    type: 'text',
                    model: 'address',
                    title: '收货点地址'
                }, {
                    type: 'select',
                    model: 'wlDeptfoList',
                    selectedModel: 'wlDeptfoListSelect',
                    title: '关联分拨中心'
                }],
                btns: [{
                    text: $sce.trustAsHtml('查询'),
                    click: 'searchClick'
                }]
            };
            //table头
            $scope.thHeader = receivingPoint.getThead();

            //定义添加modal
            $scope.addModel = {
                province: [],
                city: [{id: '-1', name: '全部'}],
                county: [{id: '-1', name: '全部'}],
                id:'',
                receivingPointName: '',
                receivingPointUserName: '',
                tel: '',
                receivingPointAccount: '',
                address: '',
                wlDeptId:{
                    id:"-1",
                    select:[]
                }
            }
            //获取省
            addressLinkage.getProvince({"param":{"query":{"isAllFlag":2,"parentId":0}}})
                .then(function (data) {
                    $scope.addModel.province=data.query.areaInfo;
                    $scope.addModel.provinceSelected=-1;
                    $scope.addModel.citySelected = '-1';
                    $scope.addModel.countySelected = '-1';
                }, function (error) {
                    console.log(error);
                });
            //省 选择事件
            $scope.addModel.provinceChange = function (call) {
                var opt = {
                    query: {parentId: $scope.addModel.provinceSelected}
                }
                //获取市
                addressLinkage.getCity({param:opt})
                    .then(function (data) {
                        $scope.addModel.city = data.query.city;
                        if(!(call instanceof Function))
                            $scope.addModel.citySelected = '-1';
                        else
                            call();
                    }, function (error) {
                        console.log(error)
                    });
                //初始化区
                $scope.addModel.county=[{id: '-1', name: '全部'}];
                $scope.addModel.countySelected = '-1';
            }
            //市 选择事件
            $scope.addModel.cityChange = function (call) {
                var opt = {
                    query: {parentId: $scope.addModel.citySelected}
                }
                //获取市
                addressLinkage.getCounty({param:opt})
                    .then(function (data) {
                        $scope.addModel.county = data.query.city;
                        if(!(call instanceof Function))
                            $scope.addModel.countySelected = '-1';
                        else
                            call();
                    }, function (error) {
                        console.log(error)
                    });
            }
            //区 选择事件
            $scope.addModel.countyChange = function () {

            }


            receivingPoint.getDataTable('/receivingPoint/getDicLists', {param:{}})
                .then(function (data) {
                    $scope.addModel.wlDeptId.select=data.query.wlDeptfoList;
                })
            //新增
            $scope.addParty= function () {
                $scope.giftTtle = "新建收货点";
                $scope.disabled=false;
                $('#workLogModal').modal('show');
                $scope.addModel.provinceSelected=-1;
                $scope.addModel.city=[{id: '-1', name: '全部'}];
                $scope.addModel.citySelected = '-1';
                $scope.addModel.county=[{id: '-1', name: '全部'}];
                $scope.addModel.countySelected = '-1';
                $scope.addModel.receivingPointName='';
                $scope.addModel.tel='';
                $scope.addModel.receivingPointUserName='';
                $scope.addModel.address='';
                $scope.addModel.receivingPointAccount='';
                $scope.addModel.wlDeptId.id='-1';
            }
            // 确认新增
            $scope.enterAdd = function () {
                if($scope.addModel.wlDeptId.id=='-1'){
                    alert('请选择关联分拨中心');
                    return;
                }
                if($scope.addModel.provinceSelected==-1){
                    alert('请选择省!');
                    return;
                }
                if($scope.addModel.citySelected == '-1'){
                    alert('请选择市!');
                    return;
                }
                if($scope.addModel.county.length>1){
                    if ($scope.addModel.countySelected == '-1') {
                        alert('请选择区县!');
                        return;
                    }
                }
                //台湾.香港.澳门
                //if(parseInt($scope.addModel.citySelected)!=271500&&parseInt($scope.addModel.citySelected)!=380200&&parseInt($scope.addModel.provinceSelected)!=420000&&parseInt($scope.addModel.provinceSelected)!=430000&&parseInt($scope.addModel.provinceSelected)!=440000&&parseInt($scope.addModel.provinceSelected)!=450000) {
                //
                //}
                var opts=$scope.addModel;

                var opts = angular.extend({},  $scope.addModel, {});//克隆出新的对象，防止影响scope中的对象
                opts.wlDeptId=  $scope.addModel.wlDeptId.id;
                var sendParams = {
                    param: {
                        query:opts
                    }
                }
                receivingPoint.getDataTable( $scope.giftTtle=='新建收货点'?'/receivingPoint/addReceivingPoint':'/receivingPoint/updateReceivingPoint', sendParams)
                    .then(function (data) {
                        alert(data.status.msg)
                        if (data.status.code == "0000") {
                            $('#workLogModal').modal('hide');
                            get();
                        }
                    })
            }
            $scope.disabled=false;
            //编辑
            $scope.updateGift= function (i,item) {
                $scope.giftTtle = "编辑收货点";
                $scope.disabled=true;
                receivingPoint.getDataTable('/receivingPoint/initReceivingPoint', {param: {query: {id: item.id}}})
                    .then(function (data) {
                        $scope.addModel.id= data.banner.receivingPoint.id;
                        $scope.addModel.receivingPointName=data.banner.receivingPoint.receivingPointName;
                        $scope.addModel.tel=data.banner.receivingPoint.tel;
                        $scope.addModel.receivingPointUserName=data.banner.receivingPoint.receivingPointUserName;
                        $scope.addModel.address=data.banner.receivingPoint.address;
                        $scope.addModel.receivingPointAccount=data.banner.receivingPoint.receivingPointAccount;
                        $scope.addModel.wlDeptId.id=data.banner.receivingPoint.wlDeptId;

                        $scope.addModel.provinceSelected=data.banner.receivingPoint.provinceId;
                        //触发省选择
                        $scope.addModel.provinceChange(function () {
                            $scope.addModel.citySelected = data.banner.receivingPoint.cityId+'';
                            //触发市
                            $scope.addModel.cityChange(function () {
                                $scope.addModel.countySelected=data.banner.receivingPoint.countyId+'';
                            });
                        });
                    })

            }
            //删除
            $scope.deleteCustom= function (i,item) {
                if(confirm('确定删除吗?')){
                    receivingPoint.getDataTable(
                        '/receivingPoint/deleteReceivingPoint',
                        {
                            param: {
                                query: {id:item.id}
                            }
                        }
                    ).then(function (data) {
                        alert(data.status.msg);
                        if(data.status.code=="0000"){
                            get();
                            //$('#addCustomerModal').modal('hide');
                        }
                    }, function (error) {
                        console.log(error);
                    });
                }
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
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: 30,
            };
            var pmsSearch = receivingPoint.getSearch();
            pmsSearch.then(function (data) {
                $scope.searchModel = data.query; //设置当前作用域的查询对象
                $scope.searchModel.wlDeptfoListSelect = "-1";
                //获取table数据
                get();
            }, function (error) {
                console.log(error)
            });

            //查询
            $scope.searchClick = function () {
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
                opts.wlDeptId = $scope.searchModel.wlDeptfoListSelect;
                opts.pageNo = $scope.paging.currentPage;
                opts.pageSize = $scope.paging.showRows;
                var promise = receivingPoint.getDataTable(
                    '/receivingPoint/queryReceivingPointList',
                    {
                        param: {
                            query: opts
                        }
                    }
                );
                promise.then(function (data) {

                    $scope.result = data.grid;
                    $scope.paging = {
                        totalPage: data.total,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };;
                }, function (error) {
                    console.log(error);
                });
            }

            //分页跳转回调
            $scope.goToPage = function () {
                get();
            }

        }])
});