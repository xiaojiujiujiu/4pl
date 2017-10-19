/**
 * Created by xiaojiu on 2017/5/26.
 */
define(['../../../app','../../../services/platform/administrationUnmannedWarehouse/locationInformationService'], function (app) {
    var app = angular.module('app');
    app.controller('locationInformationCtrl', ['$rootScope', '$scope','$timeout', '$state', '$sce', '$filter', 'HOST', '$window','locationInformation',
        function ($rootScope, $scope,$timeout, $state, $sce, $filter, HOST, $window,locationInformation) {

            // 配置查询
            $scope.querySeting = {
                items: [  {
                    type: 'text',
                    model: 'ckCode',
                    title: '查找无人仓',
                    autocomplete: 'ckCode',
                    autoCallback: 'ckCodeAutocomplete',
                    automodel: 'ckCode'
                }, {
                    type: 'select',
                    model: 'cargoLocation',
                    selectedModel: 'cargoLocationSelect',
                    title: '选择货位'
                },{
                    type: 'text',
                    model: 'model',
                    title: '规格型号'
                }, {
                    type: 'text',
                    model: 'factoryCode',
                    title: '出厂编码'
                }, {
                    type: 'text',
                    model: 'goodsName',
                    title: '商品名称'
                }, {
                    type: 'text',
                    model: 'goodsTypeName',
                    title: '商品品类'
                }, {
                    type: 'text',
                    model: 'brandName',
                    title: '商品品牌'
                }],
                btns: [{
                    text: $sce.trustAsHtml('查询'),
                    click: 'searchClick'
                }]
            };
            //table头
            $scope.thHeader = locationInformation.getThead();
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
            //自动补全无人仓
            $scope.dropDownList = [];
            $scope.ckCodeAutocomplete= function (newValue) {
                var opts = angular.extend({}, $scope.searchModel, {});
                opts.ckCode=newValue;
                //opts.cooperationState = $scope.searchModel.cooperationStateSelect;
                return locationInformation.autoCompletion({
                    param: {
                        query: opts
                    }
                });
            };
            //监听无人仓获取货位信息 自动补全指令暴露的callback方法
            $scope.callback= function (item) {
                locationInformation.getDataTable(
                    '/huoWeiManager/getHuoWeiLists',
                    {
                        param: {
                            query: {
                                ckCode:item.name
                            }
                        }
                    }
                ).then(function(data){
                    $scope.searchModel.cargoLocation=data.query.cargoLocation;
                    $rootScope.benchCount=data.query.benchCount;
                    $scope.callback.sign=data.query.sign;//
                    $scope.callback.ckState=data.query.ckState;
                    $rootScope.ckCode=$scope.searchModel.ckCode;
                    if(data.query.benchCount==2){
                        $scope.isCabinetTwoShow=true;
                    }else if(data.query.benchCount==3){
                        $scope.isCabinetTwoShow=true;
                        $scope.isCabinetThreeShow=true;
                    }else if(data.query.benchCount==4){
                        $scope.isCabinetTwoShow=true;
                        $scope.isCabinetThreeShow=true;
                        $scope.isCabinetFourShow=true;
                    }else {
                        $scope.isCabinetTwoShow=false;
                        $scope.isCabinetThreeShow=false;
                        $scope.isCabinetFourShow=false;
                    }
                })
            };
            $scope.isCabinetTwoShow=false;
            $scope.isCabinetThreeShow=false;
            $scope.isCabinetFourShow=false;
            //初始化查询
            var pmsSearch = locationInformation.getSearch();
            pmsSearch.then(function (data) {
                $scope.searchModel = data.query;
                $scope.searchModel.cargoLocation=[{id:-1,name:'选择货位编号'}]
                $scope.searchModel.cargoLocationSelect=-1;//设置下拉框默认选中
                //获取table数据

                get();
            }, function (error) {
                console.log(error)
            });
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
                opts.cargoLocation=$scope.searchModel.cargoLocationSelect;//设置下拉框数据
                opts.pageNo = $scope.paging.currentPage;
                opts.pageSize = $scope.paging.showRows;
                var promise = locationInformation.getDataTable(
                    '/huoWeiManager/queryHuoWeiManagerList',//请求表格的数据接口
                    {
                        param: {
                            query: opts
                        }
                    }
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
            //定义标题
            $scope.giftTtle='设置无人仓货位';
            // 新建货位
            $scope.addGift = function () {
            	if($scope.callback.ckState==2){
            		alert("此无人仓已经冻结不允许进行操作！");
            	}
               else if($scope.callback.sign==1){
                   	 alert("此无人仓已经新建货位不允许再次设置！");
                    }
            	 else if(!!$scope.searchModel.ckCode){
                    $('#createGift').modal('show');
                }else{
                	 alert("请先选择无人仓！");
                }

            }
            //定义表单模型
            $scope.giftModel={
                column11:'', length11:'', width11:'', height11:'', column12:'', length12:'', width12:'', height12:'', column13:'', length13:'', height13:'', column14:'', length14:'', width14:'', height14:'', column15:'', length15:'', width15:'', height15:'', column16:'', length16:'', width16:'', height16:'', column17:'', length17:'', width17:'', height17:'',
                column21:'', length21:'', width21:'', height21:'', column22:'', length22:'', width22:'', height22:'', column23:'', length23:'', height23:'', column24:'', length24:'', width24:'', height24:'', column25:'', length25:'', width25:'', height25:'', column26:'', length26:'', width26:'', height26:'', column27:'', length27:'', width27:'', height27:'',
                column31:'', length31:'', width31:'', height31:'', column32:'', length32:'', width32:'', height32:'', column33:'', length33:'', height33:'', column34:'', length34:'', width34:'', height34:'', column35:'', length35:'', width35:'', height35:'', column36:'', length36:'', width36:'', height36:'', column37:'', length37:'', width37:'', height37:'',
                column41:'', length41:'', width41:'', height41:'', column42:'', length42:'', width42:'', height42:'', column43:'', length43:'', height43:'', column44:'', length44:'', width44:'', height44:'', column45:'', length45:'', width45:'', height45:'', column46:'', length46:'', width46:'', height46:'', column47:'', length47:'', width47:'', height47:'',
            }

            // 确认新增
            $scope.enterAdd = function () {
                var opts = angular.extend({},  $scope.giftModel, {});//克隆出新的对象，防止影响scope中的对象
                console.log(opts)
                opts.ckCode=$rootScope.ckCode;
                opts.benchCount=$rootScope.benchCount;
                opts.sign=$rootScope.sign;
                var sendParams = {
                    param: {
                        query:opts
                    }
                }
                locationInformation.getDataTable( '/huoWeiManager/insertHuoWeiManager', sendParams)
                    .then(function (data) {
                        alert(data.status.msg)
                        if (data.status.code == "0000") {
                            $('#createGift').modal('hide');
                            get();
                        }
                    })
            }
            
               
            
          //调回
            $scope.recall=function(){
//             if(confirm('确认调回该商品？')){
                var ids='';
                //获取选中
                angular.forEach($scope.result, function (item) {
                    if (item.pl4GridCheckbox.checked) {
                        ids+=item.id+',';
                    }
                });
                if($scope.searchModel.ckCode==''){
                	 alert("请先选择无人仓！");
                }
                else if($scope.callback.ckState==2){
            		alert("此无人仓已经冻结不允许进行操作！");
            	}
                else if(ids!='') {
                    ids = ids.slice(0, ids.length - 1);
                    locationInformation.getDataTable(
                        '/huoWeiManager/recallGoods',
                        {
                            param: {
                                query: {
                                    ids:ids,
                                    ckCode:$rootScope.ckCode
                                }
                            }
                        }
                    ).then(function(data){
                        alert(data.status.msg);
                        get();
                    })
                }else {
                    alert('请选择需要调回的货位信息!');
                }
//            }
           }
            //更换货位
            $scope.renewal=function(){
//            	if(confirm('确认调回该商品？')){
                var ids='';
                //获取选中
                angular.forEach($scope.result, function (item) {
                    if (item.pl4GridCheckbox.checked) {
                        ids+=item.id+',';
                    }
                });
                if($scope.searchModel.ckCode==''){
               	 alert("请先选择无人仓！");
               }
                else if($scope.callback.ckState==2){
            		alert("此无人仓已经冻结不允许进行操作！");
            	}
                else if(ids!='') {
                    ids = ids.slice(0, ids.length - 1);
                    locationInformation.getDataTable(
                        '/huoWeiManager/exchangeGoods',
                        {
                            param: {
                                query: {
                                    ids:ids,
                                    ckCode:$rootScope.ckCode
                                }
                            }
                        }
                    ).then(function(data){
                        alert(data.status.msg);
                        get();
                    })
                }else {
                    alert('请选择需要更换的货位信息!');
                }
 //             }
            }
        }])
});