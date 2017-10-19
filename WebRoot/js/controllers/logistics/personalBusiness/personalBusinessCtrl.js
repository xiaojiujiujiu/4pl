/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/logistics/personalBusiness/personalBusinessService', '../../../services/addressLinkageService'], function (app) {
     var app = angular.module('app');
    app.controller('personalBusinessCtrl', ['$rootScope','$scope','$sce','personalBusiness','addressLinkage','$window', function ($rootScope,$scope,$sce,personalBusiness,addressLinkage,$window) {
        //获取省
        addressLinkage.getProvince({"param": {"query": {"isAllFlag": 2, "parentId": 0}}})
            .then(function (data) {
                $scope.addressModelFirst.province = data.query.areaInfo;
                $scope.addressModelSecond.province = data.query.areaInfo;
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
                this.county = [{id: '-1', name: '全部'}];
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
        $scope.addressModelFirst = {
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
        $scope.addressModelSecond = {
            province: [{id: -1, name: '全部'}],
            provinceSelected: -1,
            city: [{id: '-1', name: '全部'}],
            citySelected: '-1',
            county: [{id: '-1', name: '全部'}],
            countySelected: '-1',
            provinceChange: provinceChange,
            cityChange: cityChange
        }

        $scope.customerModel = {
            chuHuoName    : '',  // 发货人
            chuHTel       : '',  // 发货人电话
            receiverName  : '',  // 收货人
            receTel       : '',  // 收货人电话
            weight        : '',  // 重量
            length        : '',  // 长
            width         : '',  // 宽
            high          : '',  // 高
            acceTypeCount : '',  // 商品种类
            acceGoodCount : '',  // 数量
            boxCount      : '',  // 箱数
            wlFee         : '',  // 配送费
            remarks       : ''   // 备注
        }; 
        $scope.addCustomTitle = '添加个人业务单';
        $scope.BtnText = '生成业务单';
        // 点击添加
        $scope.btnAddCutom= function () {
            $scope.addCustomTitle='添加个人业务单';
            $scope.BtnText = "生成业务单";
            // 初始化第一个级联菜单
            $scope.addressModelFirst.provinceSelected = -1;
            $scope.addressModelFirst.city = [{id: '-1', name: '全部'}];
            $scope.addressModelFirst.citySelected = '-1';
            $scope.addressModelFirst.county = [{id: '-1', name: '全部'}];
            $scope.addressModelFirst.countySelected = '-1';
            $scope.addressModelFirst.provinceChange = provinceChange;
            $scope.addressModelFirst.cityChange = cityChange;
            // 初始化第二个级联菜单
            $scope.addressModelSecond.provinceSelected = -1;
            $scope.addressModelSecond.city = [{id: '-1', name: '全部'}];
            $scope.addressModelSecond.citySelected = '-1';
            $scope.addressModelSecond.county = [{id: '-1', name: '全部'}];
            $scope.addressModelSecond.countySelected = '-1';
            $scope.addressModelSecond.provinceChange = provinceChange;
            $scope.addressModelSecond.cityChange = cityChange;
            // 初始化input
            $scope.customerModel = {
                chuHuoName    : '',  // 发货人
                chuHTel       : '',  // 发货人电话
                receiverName  : '',  // 收货人
                receTel       : '',  // 收货人电话
                weight        : '',  // 重量
                length        : '',  // 长
                width         : '',  // 宽
                high          : '',  // 高
                acceTypeCount : '',  // 商品种类
                acceGoodCount : '',  // 数量
                boxCount      : '',  // 箱数
                wlFee         : '',  // 配送费
                remarks       : ''   // 备注
            }; 
        }
        // 生成业务单
        $scope.enterAdd= function () {
            if($scope.addressModelFirst.provinceSelected == -1 || $scope.addressModelFirst.citySelected == '-1' || $scope.addressModelFirst.countySelected == '-1'){
                alert('请选择发货人地址!');
                return;
            }
            if($scope.addressModelSecond.provinceSelected == -1 || $scope.addressModelSecond.citySelected == '-1' || $scope.addressModelSecond.countySelected == '-1'){
                alert('请选择收货人地址!');
                return;
            }
            var opts = $scope.customerModel;
            opts['chuHuoSheng']=$scope.addressModelFirst.provinceSelected;
            opts['chuHuoShi']=parseInt($scope.addressModelFirst.citySelected);
            opts['chuHuoXian']=parseInt($scope.addressModelFirst.countySelected);
            opts['receiverSheng']=$scope.addressModelFirst.provinceSelected;
            opts['receiverShi']=parseInt($scope.addressModelFirst.citySelected);
            opts['receiverXian']=parseInt($scope.addressModelFirst.countySelected);
            personalBusiness.getDataTable(
                $scope.addCustomTitle=='添加个人业务单'?'/personalOrder/addPersonalOrder':'/personalOrder/updatePersonalOrder',
                {
                    param: {
                        query: opts
                    }
                }
            ).then(function (data) {
                if(data.status.code=="0000"){
                    get($scope.tabFlag);
                    $('#addCustomerModal').modal('hide');
                    // $window.open("/print/personalInventory1.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+data.query.taskId);
                }else{
                    alert(data.status.msg)
                }
            }, function (error) {
                console.log(error);
            });
        }


        //table头
        $scope.thHeader = personalBusiness.getThead();
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
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '创建时间'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        $scope.queryState = false;
        // 客户名称
        $scope.searchName = '';
        //查询
        $scope.searchClick = function () {
            //设置默认第一页
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows,
            };
            get($scope.tabFlag);
        }
        $scope.tabFlag = 0;
        $scope.tabChange = function(index){
            $scope.tabFlag = index;
            $scope.queryState = index;
            if(index == 0){
                $scope.thHeader = personalBusiness.getThead();
            }else{
                $scope.thHeader = personalBusiness.getTheadSecond();
            }
            get($scope.tabFlag);
        }
        function get(flag) {
            /*console.log(flag)*/
            //获取选中 设置对象参数
            if(flag == 1){
                var opts = angular.extend({}, $scope.searchModel, {});
            }else{
                var opts = {};
            }
            opts.flag = flag;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = personalBusiness.getDataTable(
                '/personalOrder/queryPersonalOrder',
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
                if(!$scope.searchModel){
                    $scope.searchModel = data.query;
                }
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
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function (error) {
                console.log(error);
            });
        }
        
        var customID=0;
        //修改
        $scope.updateCustom= function (i,item) {
            $scope.BtnText = "确认修改";
            $scope.addCustomTitle='修改个人业务单';
            var promise = personalBusiness.getDataTable(
                '/personalOrder/initUpdatePersonalOrder',
                {
                    param: {
                        query: {
                            taskId: item.taskId
                        }
                    }
                }
            );
            promise.then(function (data) {
                var getResult = data.query;
                $scope.customerModel = getResult;
                $scope.addressModelFirst.provinceSelected = getResult.chuHuoSheng;
                //触发省选择
                $scope.addressModelFirst.provinceChange(function () {
                    $scope.addressModelFirst.citySelected = getResult.chuHuoShi.toString();
                    //触发市
                    $scope.addressModelFirst.cityChange(function () {
                        $scope.addressModelFirst.countySelected = getResult.chuHuoXian.toString();
                    });
                });
                $scope.addressModelSecond.provinceSelected = getResult.receiverSheng;
                //触发省选择
                $scope.addressModelSecond.provinceChange(function () {
                    $scope.addressModelSecond.citySelected = getResult.receiverShi.toString();
                    //触发市
                    $scope.addressModelSecond.cityChange(function () {
                        $scope.addressModelSecond.countySelected = getResult.receiverXian.toString();
                    });
                });
            })
            customID=item.id;
        }
        // 确认入库
        $scope.confirmStorage = function(){
            var sendTaskIds = '';
            angular.forEach($scope.result, function(item, index){
                if(item.pl4GridCheckbox.checked){
                    sendTaskIds += item.taskId + ','
                }
            });
            sendTaskIds = sendTaskIds.substr(0,sendTaskIds.length - 1);
            if(sendTaskIds != ''){
                var promise = personalBusiness.getDataTable(
                    '/personalOrder/confirmInGoods',
                    {
                        param: {
                            query: {
                                taskIds: sendTaskIds
                            }
                        }
                    }
                );
                promise.then(function (data) {
                    alert(data.status.msg);
                    if(data.status.code == "0000"){
                        get($scope.tabFlag);
//                        $window.open("/print/personalInventory1.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+sendTaskIds);
                    }
                })
            }else{
                alert('请勾选需要确认入库项！')
            }
        }


        //删除
        $scope.deleteCustom= function (i,item) {
            if(confirm('确定删除吗?')){
                personalBusiness.getDataTable(
                    '/personalOrder/deletePersonalOrder',
                    {
                        param: {
                            query: {taskId:item.taskId}
                        }
                    }
                ).then(function (data) {
                    alert(data.status.msg);
                    if(data.status.code=="0000"){
                        get($scope.tabFlag);
                    }
                }, function (error) {
                    console.log(error);
                });
            }
        }
        
        //分页跳转回调
        $scope.goToPage = function () {
            get($scope.tabFlag);
        }
        get($scope.tabFlag);
        $scope.printFirst = function(index, item){
        	window.open("/print/personalInventory.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&rkTaskId="+item.taskId);
        }
        $scope.printSecond = function(index, item){
        	$window.open("/print/personalInventory1.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+item.taskId);
        }
    }]);
});
