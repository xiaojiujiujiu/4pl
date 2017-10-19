/**
 * Created by xiaojiu on 2016/11/21.
 */
define(['../../../app','../../../services/logistics/information/wlShipperService','../../../services/uploadFileService', '../../../services/addressLinkageService'], function (app) {
     var app = angular.module('app');
    app.controller('wlShipperCtrl', ['$rootScope', '$scope', '$state', '$sce','$timeout', '$filter', 'HOST', '$window','wlShipper','uploadFileService','addressLinkage',
        function ($rootScope, $scope, $state, $sce, $timeout,$filter, HOST, $window, wlShipper,uploadFileService,addressLinkage) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'userName',
                title: '发件方名称',
                autocomplete: 'userName',
                autoCallback: 'userNameAutocomplete',
                automodel: 'goodsId'
            }, {
                type: 'text',
                model: 'tel',
                title: '手机号码'
            },{
                type: 'select',
                model: 'cooperationState',
                selectedModel: 'cooperationStateSelect',
                title: '合作状态'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '创建时间'
            },{
                type: 'text',
                model: 'address',
                title: '发件方地址'
            },{
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
        $scope.thHeader = wlShipper.getThead();


            //定义添加modal
            $scope.addModel = {
                province: [],
                city: [{id: '-1', name: '全部'}],
                county: [{id: '-1', name: '全部'}],
                userName: '',
                id:'',
                tel: '',
                qq: '',
                address: '',
                bankTel: '',
                cardName: '',
                collectTimeliness:{
                    id:"-1",
                    select:[]
                },
                papersNumber: '',
                bankCardNumber: '',
                premiumRate: '',
                cooperationState:{
                    id:"-1",
                    select:[]
                },
                papersType:{
                    id:"-1",
                    select:[]
                },
                collectionRate:'',
                collectionRates: '',
                freightdiscount:'',
                bank_name:'',

            }
            $scope.addModel2={
                collectionRate1:'',
                collectionRate2:'',
                collectionRate3:'',
                collectionRate4:'',
                collectionRate5:'',
                collectionRate6:'',
                collectionRate7:'',
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

            //模拟下拉自动补全
            $scope.isHide =false;
            $scope.showListFun =function(){
                $scope.isHide =!$scope.isHide;
            }
            $scope.listSelect = function(item){
                $scope.isHide =!$scope.isHide;
                $scope.addModel.bank_name=item.bank_name;
            }
            //筛选银行
            var timer;
            $scope.getBankInfoList=function(){
                $timeout.cancel(timer);
                timer=$timeout(function(){
                    wlShipper.getDataTable('/distributionUser/queryBankInfo', {param: {query: {bank_name: $scope.addModel.bank_name}}})
                        .then(function(data){
                            $scope.bankInfoList=data.query.bankInfoList;
                            !!$scope.bankInfoLis?$scope.isHide =false: $scope.isHide =true
                        })
                },1000)

            }
            //新增
            $scope.addParty= function () {
                //初始化新增model数据
                wlShipper.getDataTable('/distributionUser/getCooperationState', {param:{}})
                    .then(function (data) {
                        $scope.addModel.cooperationState.select=data.query.cooperationState;
                        $scope.addModel.collectTimeliness.select=data.query.collectTimeliness;
                        $scope.addModel.collectionRate=data.query.collectionRate;
                        $scope.addModel.papersType.select=data.query.papersType;
                        $scope.bankInfoList=data.query.bankInfoList;
                    })
                $scope.isShow=false;
                $scope.giftTtle = "添加发件方";
                $('#workLogModal').modal('show');
                $scope.addModel.provinceSelected=-1;
                $scope.addModel.city=[{id: '-1', name: '请选择'}];
                $scope.addModel.citySelected = '-1';
                $scope.addModel.county=[{id: '-1', name: '请选择'}];
                $scope.addModel.countySelected = '-1';
                $scope.addModel.userName='';
                $scope.addModel.tel='';
                $scope.addModel.qq='';
                $scope.addModel.address='';
                $scope.addModel.bankTel='';
                $scope.addModel.papersNumber='';
                $scope.addModel.bankCardNumber='';
                $scope.addModel.freightdiscount='';
                //$scope.addModel.collectTimeliness='';
                $scope.addModel.premiumRate='';
                $scope.addModel.bank_name='';
                $scope.addModel.cooperationState.id='1';
                $scope.addModel.collectTimeliness.id='1';
                $scope.addModel.papersType.id='1';
                $scope.addModel2.collectionRate1='';
                $scope.addModel2.collectionRate2='';
                $scope.addModel2.collectionRate3='';
                $scope.addModel2.collectionRate4='';
                $scope.addModel2.collectionRate5='';
                $scope.addModel2.collectionRate6='';
                $scope.addModel2.collectionRate7='';

            }
            // 确认新增
            $scope.enterAdd = function () {
                var  arr=[];
                arr.push($scope.addModel2.collectionRate1);
                arr.push($scope.addModel2.collectionRate2);
                arr.push($scope.addModel2.collectionRate3);
                arr.push($scope.addModel2.collectionRate4);
                arr.push($scope.addModel2.collectionRate5);
                arr.push($scope.addModel2.collectionRate6);
                arr.push($scope.addModel2.collectionRate7);
                //if($scope.addModel.cooperationState.id=='-1'){
                //    alert('请选择合作状态');
                //    return;
                //}
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

                var opts = angular.extend({},  $scope.addModel, {});//克隆出新的对象，防止影响scope中的对象
                opts.collectionRate = arr.toString();

                opts.cooperationState=  $scope.addModel.cooperationState.id;
                opts.collectTimeliness=  $scope.addModel.collectTimeliness.id;
                opts.papersType=  $scope.addModel.papersType.id;
                delete opts.province;
                delete opts.city;
                delete opts.county;
                var sendParams = {
                    param: {
                        query:opts
                    }
                }
                var reg = new RegExp("^[0-9]+(.[0-9]+)?");
                //if(!reg.test($scope.addModel.collectionRate)){
                //    alert("请输入正确的代收货款费率数字！")
                //    return false;
                //}
                if(!reg.test($scope.addModel.premiumRate)){
                    alert("请输入正确的保险费率数字！")
                    return false;
                }
                wlShipper.getDataTable( $scope.giftTtle=='添加发件方'?'/distributionUser/addDistributionUser':'/distributionUser/updateDistributionUser', sendParams)
                    .then(function (data) {
                        alert(data.status.msg)
                        if (data.status.code == "0000") {
                            $('#workLogModal').modal('hide');
                            get();
                        }
                    })

            }

            //编辑
            $scope.updateGift= function (i,item) {
                $scope.giftTtle = "编辑发件方信息";
                $scope.isShow=true;
                wlShipper.getDataTable('/distributionUser/initDistributionUser', {param: {query: {id: item.ID}}})
                    .then(function (data) {
                        $scope.addModel.id= data.query.userInfo.id;
                        $scope.addModel.userName=data.query.userInfo.userName;
                        $scope.addModel.tel=data.query.userInfo.tel;
                        $scope.addModel.qq=data.query.userInfo.qq;
                        $scope.addModel.address=data.query.userInfo.address;
                        $scope.addModel.bankTel=data.query.userInfo.bankTel;
                        $scope.addModel.cardName=data.query.userInfo.cardName;
                        $scope.addModel.collectionRate=data.query.userInfo.collectionRate;
                        $scope.addModel.premiumRate=data.query.userInfo.premiumRate;
                        $scope.addModel.papersNumber=data.query.userInfo.papersNumber;
                        $scope.addModel.bankCardNumber=data.query.userInfo.bankCardNumber;
                        $scope.addModel.freightdiscount=data.query.userInfo.freightdiscount;
                        $scope.addModel.collectTimeliness.id=data.query.userInfo.collectTimeliness;
                        $scope.addModel.collectTimeliness.select=data.query.collectTimeliness;
                        $scope.addModel.cooperationState.id=data.query.userInfo.cooperationState;
                        $scope.addModel.cooperationState.select=data.query.cooperationState;
                        $scope.addModel.papersType.select=data.query.papersType;
                        $scope.addModel.papersType.id=data.query.userInfo.papersType;
                        $scope.addModel.collectionRates=data.query.userInfo.collectionRates;
                        $scope.addModel.provinceSelected=item.provinceId;

                        //触发省选择
                        $scope.addModel.provinceChange(function () {
                            $scope.addModel.citySelected = item.cityId+'';
                            //触发市
                            $scope.addModel.cityChange(function () {
                                $scope.addModel.countySelected=item.countyId+'';
                            });
                        });
                    })

            }
            //删除
            $scope.deleteCustom= function (i,item) {
                if(confirm('确定删除吗?')){
                    wlShipper.getDataTable(
                        '/distributionUser/deleteDistributionUser',
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
            //验证
            $scope.verifyModal={
                check_amount:''
            }
            $scope.verify=function(i,item){
                $rootScope.company_id=item.id;
                $rootScope.company_name=item.userName;
                wlShipper.getDataTable(
                    '/vehicleParts/verifyAddresserStatus',
                    {
                        param: {
                            query: {company_id:$rootScope.company_id}
                        }
                    }
                ).then(function (data){
                  if(data.query.status===0){
                      $("#verifyModal").modal('show');
                  }else {
                      alert(data.query.message);
                  }
                });

            }
            //验证确认
            $scope.verifyAdd=function(){
                var reg = new RegExp("^[0-9]+(.[0-9]+)?");
                if(!reg.test($scope.verifyModal.check_amount)){
                    alert("请输入正确的验证信息数字！")
                    return false;
                }
                wlShipper.getDataTable(
                    '/vehicleParts/verifyAddresser',
                    {
                        param: {
                            query: {company_id:$rootScope.company_id,company_name:$rootScope.company_name,check_amount:$scope.verifyModal.check_amount}
                        }
                    }
                ).then(function (data) {
                    alert(data.query.message);
                    if(data.status.code=="0000"){
                        get();
                        $('#verifyModal').modal('hide');
                    }
                }, function (error) {
                    console.log(error);
                });
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
        var pmsSearch = wlShipper.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.cooperationStateSelect = "-1";
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
        $scope.exParams = '';
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.cooperationState = $scope.searchModel.cooperationStateSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = wlShipper.getDataTable(
                '/distributionUser/getDistributionUserList',
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
        //导入
        $scope.isShow=true;
        $scope.impUploadFiles= function (files) {
            if(files.length==0) return false;
            //多文件上传
            var count=0;
            function upFiles(){
                uploadFileService.upload('/distributionUser/importDistributionUser',files[count],function(evt){
                    //进度回调
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.impUploadFilesProgress=evt.config.data.file.name+'的进度:'+progressPercentage+'%';
                }).then(function (resp) {
                	alert(resp.status.msg);

                    //上传成功
                    $scope.impUploadFilesProgress='上传完成!';
                    get();
                    alert(resp.data.status.msg);
                    count++;
                    $timeout(function(){
                        $scope.isShow = false;
                    },3000);
                    if(files.length>count)
                        upFiles();
                });

            }
            upFiles();

        }
        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
            $scope.dropDownList = [];
            $scope.userNameAutocomplete= function (newValue) {
                var opts = angular.extend({}, $scope.searchModel, {});
                opts.userName=newValue;
                opts.cooperationState = $scope.searchModel.cooperationStateSelect;
                return wlShipper.autoCompletion({
                    param: {
                        query: opts
                    }
                });
            };
    }])
});