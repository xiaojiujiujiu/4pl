/**
 * Created by xiaojiu on 2017/5/6.
 */
'use strict';
define(['../../../app', '../../../services/logistics/createOrder/createOrderService', '../../../services/addressLinkageService'], function(app) {
     var app = angular.module('app');
    app.controller('createOrderCtrl', ['$rootScope','$scope','$window','$filter', '$state', '$sce', 'createOrder', 'addressLinkage', function($rootScope,$scope,$window,$filter, $state, $sce, createOrder, addressLinkage) {
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
        //地址2联动model
        $scope.address2Model = {
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
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            }, {
                type: 'text',
                model: 'chuHuoName',
                title: '发件方'
            }, {
                type: 'text',
                model: 'senderTel',
                title: '发件方电话'
            }, {
                type: 'text',
                model: 'recipientsTel',
                title: '收件方电话'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '创建时间'
            }, {
                type: 'select',
                model: 'frequency',
                selectedModel:'frequencySelect',
                title: '班次',
                isNavShow:true
            }, {
                type: 'select',
                model: 'ydDistribution',
                selectedModel:'ydDistributionSelect',
                title: '配送方式',
                isNavShow:true
            }  , {
                type: 'text',
                model: 'senderNumber',
                title: '发件方编号'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.tabFlag = true;
        $scope.isShow3=false;
        function getTableHeader(){
            if($scope.tabFlag){
                $scope.thHeader = createOrder.getThead();
                $scope.querySeting.items[6].isNavShow=true;
                $scope.querySeting.items[5].isNavShow=true;
            }else{
                $scope.thHeader = createOrder.getTheadChange();
                $scope.querySeting.items[6].isNavShow=false;
                $scope.querySeting.items[5].isNavShow=false;
            }
        }
        getTableHeader();
        $scope.tabChange = function(index){
//            console.log(index)
//            console.log($scope.isShow)
            var date = new Date();
            $('#dt_0').datepicker('setValue', new Date(date.getFullYear(), date.getMonth(), date.getDate()));
            $('#dt_1').datepicker('setValue', new Date(date.getFullYear(), date.getMonth(), date.getDate()));
            $('#dt_0,#dt_1').val('');
            $scope.paging.currentPage= 1;
            $scope.searchModel.taskId='';
            $scope.searchModel.orderTypeIdSelect=-1;
            $scope.searchModel.startTime='';
            $scope.searchModel.endTime='';

            if(index == 1){
                $scope.tabFlag = true;
                $scope.isShow3=false;
            }else{
                $scope.tabFlag = false;
                $scope.isShow3=true;
            }
            //getQuery(index);
            getTableHeader(index);
            get(index);

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
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        var pmsSearch = createOrder.getSearch();
        pmsSearch.then(function(data) {

            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.frequencySelect=-1;
            $scope.searchModel.ydDistributionSelect=-1;
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
                showRows: $scope.paging.showRows,
            };
            get();
        }
        $scope.exParams = '';
        function get(packStatus) {
            if(!packStatus){
                if($scope.tabFlag){
                    packStatus = 1;
                }else{
                    packStatus = 2;
                }
            };
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.frequency = $scope.searchModel.frequencySelect;
            opts.ydDistribution = $scope.searchModel.ydDistributionSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            opts.wlState = packStatus;
            $scope.exParams = $filter('json')({query: opts});
            var promise = createOrder.getDataTable({
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
                $scope.banner = data.banner;
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
        //确认收货按钮
        $scope.confirmGoodsReceipt=function(i,item){
            if($scope.frequencyName=='早班次'){ $scope.newIndentModel.frequency=1; }
            if($scope.frequencyName=='午班次'){ $scope.newIndentModel.frequency=2; }
            if($scope.frequencyName=='晚班次'){ $scope.newIndentModel.frequency=3; }
        	 var ids='';
             angular.forEach($scope.result, function (item) {
                 if (item.pl4GridCheckbox.checked) {
                     ids+=item.taskId+',';
                 }
             });
             if(ids!=''){
                 ids=ids.substr(0,ids.length-1);
             }
             else {
                 alert('请勾选后再进行收货!');
                 return false;
             }
             if(confirm('确定收货吗?')){
           createOrder.confirmInCk({
                   param: {
                       "query":{
                           "taskIds":ids,
                           "frequency": $scope.newIndentModel.frequency
                       }
                   }
               },'/personalOrder/confirmInGoods')
               .then(function (data) {
                   alert(data.status.msg)
                   if(data.status.code=="0000") {
                       $("#confirmCar").modal("hide");
                       get();
                   }
               }, function (error) {
                   console.log(error)
               });
             }
        }
        //作废
        $scope.obtainId=function(i,item){
            $rootScope.taskId=item.taskId;
        }
        $scope.deleteOrder=function(i,item){
        	  createOrder.deletePersonOrder({
                  param: {
                      "query":{
                          "taskId":$rootScope.taskId,
                          "remark":$scope.remark
                      }
                  }
              },'/personalOrder/deletePersonalOrder')
              .then(function (data) {
                 // alert(data.status.msg)
                  if(data.status.code=="0000") {
                      $("#deleteCar").modal("hide");
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
        //新建业务单modal
        $scope.newIndentModel={
            senderNumber: '',
        		chuHuoName: '',
        		chuHTel:'',
            chuHAdd: '',
            receiverName: '',
            receTel: '',
            receAdd: '',
            acceGoodCount: '',
            pay: '',
            weight: '',
            size: '',
            collectMoney: '',
            collectTimeliness: 'T+0',
            fee: '',
            offerMoney: '',
            insuranceMoney: '',
            paySide: '',
            payType: '',
            remarks: '',
            frequency:''
        }
       $scope.selectData= ['早班次','午班次','晚班次'];

        $scope.operationTitle = '新建业务单';
        //select的切换隐藏
        $scope.isShow=false;
        $scope.isShow2=true;
        $scope.tebSelect= function () {
            if($scope.newIndentModel.paySide=="2"){
            	$scope.newIndentModel.payType="1";
                $scope.isShow=true;
                $scope.isShow2=false;
            }else if($scope.newIndentModel.paySide=="1"){
                $scope.isShow=false;
                $scope.isShow2=true;
            }
        }
        //新建业务单
        $scope.AddOperation = function () {
            $scope.operationTitle = '新建业务单';
            $scope.newIndentModel={
                senderNumber: '',
            		chuHuoName: '',
                chuHuoName2: '',
            		chuHTel:'',
                chuHAdd: '',
                receiverName: '',
                receiverName2: '',
                receTel: '',
                receAdd: '',
                acceGoodCount: '',
                pay: '',
                weight: '',
                size: '',
                collectMoney: '',
                collectTimeliness: 'T+0',
                collectMoney2: '',
                fee: '',
                offerMoney: '',
                offerMoney2: '',
                insuranceMoney: '',
                paySide: '1',
                payType: '1',
                remarks: '',
            }
            $scope.addressModel.provinceSelected = -1;
            $scope.address2Model.provinceSelected = -1;
            $scope.addressModel.city = [{id: '-1', name: '请选择'}];
            $scope.addressModel.citySelected = '-1';
            $scope.addressModel.county = [{id: '-1', name: '请选择'}];
            $scope.addressModel.countySelected = '-1';
            $scope.address2Model.city = [{id: '-1', name: '请选择'}];
            $scope.address2Model.citySelected = '-1';
            $scope.address2Model.county = [{id: '-1', name: '请选择'}];
            $scope.address2Model.countySelected = '-1';
            $scope.isShow=false;
            $scope.isShow2=true;
        }
        //保存业务单
        $scope.operationEnterAdd = function () {
            if ($scope.addressModel.provinceSelected == -1) {
                alert('请选择发件方区域省!');
                return;
            }
            if ($scope.addressModel.citySelected == '-1') {
                alert('请选择发件方区域市!');
                return;
            }

            if ($scope.address2Model.provinceSelected == -1) {
                alert('请选择收件方区域省!');
                return;
            }
            if ($scope.address2Model.citySelected == '-1') {
                alert('请选择收件方区域市!');
                return;
            }
            if($scope.address2Model.county.length>1){
                if ($scope.address2Model.countySelected == '-1') {
                    alert('请选择收件方区/县!');
                    return;
                }
            }
            if($scope.addressModel.county.length>1){
                if ($scope.addressModel.countySelected == '-1') {
                    alert('请选择发件方区/县!');
                    return;
                }
            }
            //台湾.香港.澳门
            //if(parseInt($scope.addressModel.citySelected)!=271500&&parseInt($scope.addressModel.citySelected)!=380200&&parseInt($scope.addressModel.provinceSelected)!=420000&&parseInt($scope.addressModel.provinceSelected)!=430000&&parseInt($scope.addressModel.provinceSelected)!=440000&&parseInt($scope.addressModel.provinceSelected)!=450000) {
            //
            //}
            //if(parseInt($scope.address2Model.citySelected)!=271500&&parseInt($scope.addressModel.citySelected)!=380200&&parseInt($scope.address2Model.provinceSelected)!=420000&&parseInt($scope.address2Model.provinceSelected)!=430000&&parseInt($scope.address2Model.provinceSelected)!=440000&&parseInt($scope.address2Model.provinceSelected)!=450000) {
            //
            //}
            $scope.newIndentModel.chuHuoSheng = $scope.addressModel.provinceSelected;
            $scope.newIndentModel.chuHuoShi = $scope.addressModel.citySelected;
            $scope.newIndentModel.chuHuoXian = $scope.addressModel.countySelected;
            $scope.newIndentModel.receiverSheng = $scope.address2Model.provinceSelected;
            $scope.newIndentModel.receiverShi = $scope.address2Model.citySelected;
            $scope.newIndentModel.receiverXian = $scope.address2Model.countySelected;
            $scope.newIndentModel.frequency= $scope.frequencyName;
            createOrder.confirmInCk({
                    param: {
                        query: $scope.newIndentModel
                    }
                },$scope.operationTitle == '新建业务单' ? '/personalOrder/addPersonalOrder' : '/personalOrder/updatePersonalOrder')

                .then(function (data) {
                    if (data.status.code == "0000") {
                        alert(data.status.msg);
                        get()
                        $('#addCar').modal('hide');
                    }
                    alert(data.status.msg);
                })
        }
        //修改业务单
        $scope.updateOperation = function (index, item) {
            $scope.operationTitle = '修改业务单';
            $scope.chuShow=false;
            $scope.senderNumberShow=false;
            $scope.receiverShow=false;
            createOrder.confirmInCk({param: {query: {taskId: item.taskId}}}, '/personalOrder/initUpdatePersonalOrder')
                .then(function (data) {
                    $scope.newIndentModel.senderNumber = data.query.senderNumber;
                    $scope.newIndentModel.chuHuoName = data.query.chuHuoName;
                    $scope.newIndentModel.taskId = data.query.taskId;
                    $scope.newIndentModel.chuHTel = data.query.chuHTel;
                    $scope.newIndentModel.chuHAdd = data.query.chuHAdd;
                    $scope.newIndentModel.receiverName = data.query.receiverName;
                    $scope.newIndentModel.receTel = data.query.receTel;
                    $scope.newIndentModel.receAdd = data.query.receAdd;
                    $scope.newIndentModel.acceGoodCount = data.query.acceGoodCount;
                    $scope.newIndentModel.pay = data.query.pay;
                    $scope.newIndentModel.weight = data.query.weight;
                    $scope.newIndentModel.size = data.query.size;
                    $scope.newIndentModel.collectMoney = data.query.collectMoney;
                    $scope.newIndentModel.collectTimeliness = data.query.collectTimeliness;
                    $scope.newIndentModel.fee = data.query.fee;
                    $scope.newIndentModel.offerMoney = data.query.offerMoney;
                    $scope.newIndentModel.insuranceMoney = data.query.insuranceMoney;
                    $scope.newIndentModel.paySide = data.query.paySide + '';
                    $scope.newIndentModel.payType = data.query.payType + '';
                    $scope.newIndentModel.remarks = data.query.remarks;

                    $scope.address2Model.provinceSelected = data.query.receiverSheng;
                    $scope.addressModel.provinceSelected = data.query.chuHuoSheng;
                    //触发省选择
                    $scope.addressModel.provinceChange(function () {
                        $scope.addressModel.citySelected = data.query.chuHuoShi + '';
                        //触发市
                        $scope.addressModel.cityChange(function () {
                            $scope.addressModel.countySelected =data.query.chuHuoXian + '';
                        });
                    });
                    //触发省选择
                    $scope.address2Model.provinceChange(function () {
                        $scope.address2Model.citySelected = data.query.receiverShi + '';
                        //触发市
                        $scope.address2Model.cityChange(function () {
                            $scope.address2Model.countySelected =data.query.receiverXian + '';
                        });
                    });
                });
        }
        //查看
        $scope.lookCar = function (index, item) {
            createOrder.confirmInCk({param: {query: {taskId: item.taskId}}}, '/personalOrder/lookPersonalOrder')
                .then(function (data) {
                    $rootScope.taskId=data.banner.taskId;
                    $scope.newIndentModel.senderNumber = data.banner.senderNumber;
                    $scope.newIndentModel.chuHuoName2 = data.banner.chuHuoName;
                    $scope.newIndentModel.chuHTel2 = data.banner.chuHTel;
                    $scope.newIndentModel.chuHAdd2 = data.banner.chuHAdd;
                    $scope.newIndentModel.receiverName2 = data.banner.receiverName;
                    $scope.newIndentModel.receTel = data.banner.receTel;
                    $scope.newIndentModel.receAdd = data.banner.receAdd;
                    $scope.newIndentModel.acceGoodCount = data.banner.acceGoodCount;
                    $scope.newIndentModel.pay = data.banner.pay;
                    $scope.newIndentModel.weight = data.banner.weight;
                    $scope.newIndentModel.size = data.banner.size;
                    $scope.newIndentModel.collectMoney2 = data.banner.collectMoney;
                    $scope.newIndentModel.fee = data.banner.fee;
                    $scope.newIndentModel.offerMoney2 = data.banner.offerMoney;
                    $scope.newIndentModel.insuranceMoney = data.banner.insuranceMoney;
                    $scope.newIndentModel.paySide = data.banner.paySide;
                    $scope.newIndentModel.payType = data.banner.payType;
                    $scope.newIndentModel.remarks = data.banner.remarks;

                });
        }
        //外单修改
        $scope.modification=function(i, item){
            createOrder.confirmInCk({param: {query: {taskId: item.taskId}}}, '/personalOrder/toUpdatePersonalOrder')
                .then(function (data) {
                    alert(data.status.msg);
                    get(packStatus);
                })
        }
        //打印
        $scope.print= function (i,item) {
            $window.open("/print/createVehiclePartsOrderPrint.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+item.taskId);
        },
        $scope.printBox=function(i,item){
            $window.open("/print/boxSingle.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+item.taskId);
        }
        $scope.userList=[];
        $scope.chuShow=false;
        $scope.senderNumberShow=false;
        $scope.receiverShow=false;
        //监听发件人
        $scope.watchChuHuoName=function(){
            $scope.$watch('newIndentModel.chuHuoName',function(newValue,oldValue){
                if (newValue != oldValue){
                    $scope.getUserInfoByName(newValue,0);//发件方
                    $scope.chuShow=true;
                }
            });
        }

        //监听发件方编号
        //$scope.watchSenderNumber= function () {
        //    $scope.$watch('newIndentModel.senderNumber',function(newValue,oldValue){
        //        if (newValue != oldValue){
        //            newValue=(newValue!=undefined || newValue!=null) ? newValue :"";
        //            createOrder.confirmInCk({param: {query: {senderNumber:newValue}}}, '/deliveryPartyPay/getChuHuoNumber')
        //                .then(function (data) {
        //                    $scope.userList3=data.query.userList;
        //                    if($scope.userList3.length<=0){
        //                        $scope.senderNumberShow=false;
        //                        $scope.newIndentModel.collectTimeliness='T+0';
        //                        $scope.newIndentModel.chuHTel = '';
        //                        $scope.newIndentModel.chuHAdd = '';
        //                        $scope.addressModel.provinceSelected = -1;
        //                        $scope.addressModel.city = [{id: '-1', name: '请选择'}];
        //                        $scope.addressModel.citySelected = '-1';
        //                        $scope.addressModel.county = [{id: '-1', name: '请选择'}];
        //                        $scope.addressModel.countySelected = '-1';
        //                    }else if(!!$scope.newIndentModel.senderNumber){
        //                        $scope.senderNumberShow=true;
        //                    }
        //                    else{
        //                        $scope.senderNumberShow=false;
        //                        $scope.newIndentModel.collectTimeliness='T+0';
        //                        $scope.newIndentModel.chuHTel = '';
        //                        $scope.newIndentModel.chuHAdd = '';
        //                        $scope.addressModel.provinceSelected = -1;
        //                        $scope.addressModel.city = [{id: '-1', name: '请选择'}];
        //                        $scope.addressModel.citySelected = '-1';
        //                        $scope.addressModel.county = [{id: '-1', name: '请选择'}];
        //                        $scope.addressModel.countySelected = '-1';
        //                    }
        //                })
        //        }
        //    });
        //}
        $scope.watchSenderNumber= function (newValue) {
                    newValue=(newValue!=undefined || newValue!=null) ? newValue :"";
                    createOrder.confirmInCk({param: {query: {senderNumber:newValue}}}, '/deliveryPartyPay/getChuHuoNumber')
                        .then(function (data) {
                            $scope.userList3=data.query.userList;
                            if($scope.userList3.length<=0){
                                $scope.senderNumberShow=false;
                                $scope.newIndentModel.collectTimeliness='T+0';
                                $scope.newIndentModel.chuHTel = '';
                                $scope.newIndentModel.chuHAdd = '';
                                $scope.addressModel.provinceSelected = -1;
                                $scope.addressModel.city = [{id: '-1', name: '请选择'}];
                                $scope.addressModel.citySelected = '-1';
                                $scope.addressModel.county = [{id: '-1', name: '请选择'}];
                                $scope.addressModel.countySelected = '-1';
                            }else if(!!$scope.newIndentModel.senderNumber){
                                $scope.senderNumberShow=true;
                            }
                            else{
                                $scope.senderNumberShow=false;
                                $scope.newIndentModel.collectTimeliness='T+0';
                                $scope.newIndentModel.chuHTel = '';
                                $scope.newIndentModel.chuHAdd = '';
                                $scope.addressModel.provinceSelected = -1;
                                $scope.addressModel.city = [{id: '-1', name: '请选择'}];
                                $scope.addressModel.citySelected = '-1';
                                $scope.addressModel.county = [{id: '-1', name: '请选择'}];
                                $scope.addressModel.countySelected = '-1';
                            }
                        })
        }
        //监听收件人
        $scope.watchReceiverNamee=function(){
            $scope.$watch('newIndentModel.receiverName',function(newValue,oldValue){
                if (newValue != oldValue /**&& $scope.selectionMade == false*/) {

                    if (newValue != "" && !angular.isUndefined(newValue)) {
                        $scope.receiverShow=true;
                        $scope.getUserInfoByName(newValue,1);
                    }else{
                        $scope.receiverShow=false;

                        //$scope.receiverShow=false;
                        //$(".add-autoplete-ul2").css('display','none');
                        $scope.newIndentModel.receTel = '';
                        $scope.newIndentModel.receAdd = '';
                        $scope.address2Model.provinceSelected = -1;
                        $scope.address2Model.city = [{id: '-1', name: '请选择'}];
                        $scope.address2Model.citySelected = '-1';
                        $scope.address2Model.county = [{id: '-1', name: '请选择'}];
                        $scope.address2Model.countySelected = '-1';
                    }
                }

            })
        }


        /*根据名称联动对应的数据
        * newValue监听的用户名称
        * moduleObj //这个是数据模型
        * nametType 0:表示发件方信息 ； 1 ：表示收件方信息
        */

        $scope.getUserInfoByName = function(newValue,nametType){
            newValue=(newValue!=undefined || newValue!=null) ? newValue :"";
            if(nametType==0){
                var face=createOrder.confirmInCk({param: {query: {userName:newValue}}}, '/deliveryPartyPay/getShipperLists')
            }else {
                var face=createOrder.confirmInCk({param: {query: {userName:newValue}}}, '/deliveryPartyPay/getConsignerLists')
            }
            face.then(function (data) {
                    if(nametType==0){
                        $scope.userList=data.query.userList;
                        if($scope.userList.length<=0){
                            $scope.chuShow=false;
                            $scope.newIndentModel.collectTimeliness='T+0';
                            $scope.newIndentModel.chuHTel = '';
                            $scope.newIndentModel.chuHAdd = '';
                            $scope.addressModel.provinceSelected = -1;
                            $scope.addressModel.city = [{id: '-1', name: '请选择'}];
                            $scope.addressModel.citySelected = '-1';
                            $scope.addressModel.county = [{id: '-1', name: '请选择'}];
                            $scope.addressModel.countySelected = '-1';
                        }else if(!!$scope.newIndentModel.chuHuoName){
                            $scope.chuShow=true;
                        }else{
                            $scope.chuShow=false;
                            $scope.newIndentModel.collectTimeliness='T+0';
                            $scope.newIndentModel.chuHTel = '';
                            $scope.newIndentModel.chuHAdd = '';
                            $scope.addressModel.provinceSelected = -1;
                            $scope.addressModel.city = [{id: '-1', name: '请选择'}];
                            $scope.addressModel.citySelected = '-1';
                            $scope.addressModel.county = [{id: '-1', name: '请选择'}];
                            $scope.addressModel.countySelected = '-1';
                        }
                        if($scope.flag){
                            $scope.chuShow=false;
                            $scope.flag=false;
                        }
                    }
                    else if(nametType==1){
                        $scope.userList2=data.query.userList;
                        if($scope.userList2.length<=0){
                            $scope.receiverShow=false;
                            $scope.newIndentModel.receTel = '';
                            $scope.newIndentModel.receAdd = '';
                            $scope.address2Model.provinceSelected = -1;
                            $scope.address2Model.city = [{id: '-1', name: '请选择'}];
                            $scope.address2Model.citySelected = '-1';
                            $scope.address2Model.county = [{id: '-1', name: '请选择'}];
                            $scope.address2Model.countySelected = '-1';
                        }else if(!!$scope.newIndentModel.receiverName){
                            $scope.receiverShow=true;
                        }else {
                            $scope.receiverShow=false;
                            $scope.newIndentModel.receTel = '';
                            $scope.newIndentModel.receAdd = '';
                            $scope.address2Model.provinceSelected = -1;
                            $scope.address2Model.city = [{id: '-1', name: '请选择'}];
                            $scope.address2Model.citySelected = '-1';
                            $scope.address2Model.county = [{id: '-1', name: '请选择'}];
                            $scope.address2Model.countySelected = '-1';
                        }
                    }
                    if($scope.flag2){
                        $scope.receiverShow=false;
                        $scope.flag2=false;
                    }

                });

        }
        $scope.flag=false;
        $scope.flag2=false;
        $scope.tieModel=function(o,type){
            //$scope.receiverShow=false;
            //$scope.chuShow=false;
            //$scope.flag=true;
            //$scope.flag2=true;
            if(type==1){
                $scope.newIndentModel.chuHuoName= o.name;
            }else if(type==2){
                $scope.newIndentModel.receiverName= o.name;
            }
            $scope.flag=true;
            createOrder.confirmInCk({param: {query: {userName: o.name}}}, '/personalOrder/queryDisUserByName')
                .then(function (data) {
                    if(type==1){
                        $scope.chuShow=false;
                        $scope.flag=true;
                        $scope.newIndentModel.chuHTel = data.banner.tel;
                        $scope.newIndentModel.chuHAdd = data.banner.address;
                        $scope.newIndentModel.collectTimeliness = data.banner.collectTimeliness;
                        $scope.addressModel.provinceSelected = data.banner.provinceId;
                        $scope.addressModel.provinceChange(function () {
                            $scope.addressModel.citySelected = data.banner.cityId + '';
                            //触发市
                            $scope.addressModel.cityChange(function () {
                                $scope.addressModel.countySelected =data.banner.countyId + '';
                            });
                        });
                    }else if(type==2){
                        $scope.receiverShow=false;
                        $scope.newIndentModel.receTel = data.banner.tel;
                        $scope.newIndentModel.receAdd = data.banner.address;
                        $scope.address2Model.provinceSelected = data.banner.provinceId;
                        $scope.address2Model.provinceChange(function () {
                            $scope.address2Model.citySelected = data.banner.cityId + '';
                            //触发市
                            $scope.address2Model.cityChange(function () {
                                $scope.address2Model.countySelected =data.banner.countyId + '';
                            });
                        });
                    }
                });
        }
        $scope.tieModel2=function(o){
            $scope.senderNumberShow=false;
            $scope.newIndentModel.senderNumber= o.userId;
            createOrder.confirmInCk({param: {query: {senderNumber: o.userId}}}, '/personalOrder/queryDisUserByName')
                .then(function (data) {
                	 $scope.newIndentModel.chuHuoName = data.banner.userName;
                        $scope.newIndentModel.chuHTel = data.banner.tel;
                        $scope.newIndentModel.chuHAdd = data.banner.address;
                        $scope.newIndentModel.collectTimeliness = data.banner.collectTimeliness;
                        $scope.addressModel.provinceSelected = data.banner.provinceId;
                        $scope.addressModel.provinceChange(function () {
                            $scope.addressModel.citySelected = data.banner.cityId + '';
                            //触发市
                            $scope.addressModel.cityChange(function () {
                                $scope.addressModel.countySelected =data.banner.countyId + '';
                            });
                        });
                });
        }

        $scope.isDisabled=false;
        $scope.$watch('newIndentModel.collectTimeliness',function(newValue,oldValue){
            if (newValue != oldValue /**&& $scope.selectionMade == false*/) {
                if (newValue == 'T+0' || newValue=='') {
                    $scope.isDisabled = false;
                } else {
                    $scope.isDisabled = true;
                }
            }
        })

        //监听代收款金额

            $scope.$watch('newIndentModel.collectMoney',function(newValue,oldValue) {
                if (newValue != oldValue /**&& $scope.selectionMade == false*/) {
                    createOrder.confirmInCk({
                            param: {
                                query: {
                                    chuHuoName: $scope.newIndentModel.chuHuoName,
                                    chuHTel: $scope.newIndentModel.chuHTel,
                                    collectMoney: $scope.newIndentModel.collectMoney,
                                }
                            }
                        }, '/personalOrder/queryCollectMoney')
                        .then(function (data) {
                            $scope.newIndentModel.fee = data.query.fee;
                        });
                }
            })

        //$scope.$watch('newIndentModel.collectMoney',function(newValue,oldValue){
        //    if (newValue != oldValue /**&& $scope.selectionMade == false*/) {
        //        createOrder.confirmInCk({param: {
        //            query: {
        //                chuHuoName: $scope.newIndentModel.chuHuoName,
        //                chuHTel: $scope.newIndentModel.chuHTel,
        //                collectMoney: $scope.newIndentModel.collectMoney,
        //            }}}, '/personalOrder/queryCollectMoney')
        //            .then(function (data) {
        //               $scope.newIndentModel.fee=data.query.fee;
        //            });
        //    }
        //
        //})
        //监听保价费金额
        $scope.$watch('newIndentModel.offerMoney',function(newValue,oldValue){
            //console.log(2);
            if (newValue != oldValue /**&& $scope.selectionMade == false*/) {
                createOrder.confirmInCk({param: {
                        query: {
                            chuHuoName: $scope.newIndentModel.chuHuoName,
                            chuHTel: $scope.newIndentModel.chuHTel,
                            offerMoney: $scope.newIndentModel.offerMoney,
                        }}}, '/personalOrder/queryOfferMoney')
                    .then(function (data) {
                        $scope.newIndentModel.insuranceMoney=data.query.insuranceMoney;
                    });
            }

        })
    }])
});