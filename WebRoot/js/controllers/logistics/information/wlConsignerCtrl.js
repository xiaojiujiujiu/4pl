/**
 * Created by xiaojiu on 2016/11/22.
 */
define(['../../../app','../../../services/logistics/information/wlConsignerService','../../../services/uploadFileService', '../../../services/addressLinkageService'], function (app) {
     var app = angular.module('app');
    app.controller('wlConsignerCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','wlConsigner','uploadFileService','addressLinkage',
        function ($rootScope, $scope, $state, $sce, $filter, HOST, $window, wlConsigner,uploadFileService,addressLinkage) {
            // query moudle setting
            $scope.querySeting = {
                items: [{
                    type: 'text',
                    model: 'userName',
                    title: '收件方名称',
                    autocomplete: 'userName',
                    autoCallback: 'userNameAutocomplete',
                    automodel: 'goodsId'
                }, {
                    type: 'text',
                    model: 'tel',
                    title: '手机号码'
                }, {
                    type: 'date',
                    model: ['startTime', 'endTime'],
                    title: '创建时间'
                },{
                    type: 'text',
                    model: 'address',
                    title: '收件方地址'
                }],
                btns: [{
                    text: $sce.trustAsHtml('查询'),
                    click: 'searchClick'
                }]
            };
            //table头
            $scope.thHeader = wlConsigner.getThead();
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
            var pmsSearch = wlConsigner.getSearch();
            pmsSearch.then(function (data) {
                $scope.searchModel = data.query; //设置当前作用域的查询对象
                //获取table数据
                //get();
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
                opts.cooperationState='';
                opts.pageNo = $scope.paging.currentPage;
                opts.pageSize = $scope.paging.showRows;
                $scope.exParams = $filter('json')({query: opts});
                var promise = wlConsigner.getDataTable(
                    '/distributionUser/getRecDistributionUserList',
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

            //定义添加modal
            $scope.addModel = {
                province: [],
                city: [{id: '-1', name: '全部'}],
                county: [{id: '-1', name: '全部'}],
                userName: '',
                tel: '',
                id:'',
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

            //新增
            $scope.addParty= function () {
                $scope.giftTtle = "添加收件方";
                $('#workLogModal').modal('show');
                
                $scope.addModel.provinceSelected=-1;
                $scope.addModel.city=[{id: '-1', name: '请选择'}];
                $scope.addModel.citySelected = '-1';
                $scope.addModel.county=[{id: '-1', name: '请选择'}];
                $scope.addModel.countySelected = '-1';
                $scope.addModel.userName='';
                $scope.addModel.tel='';
            }
            // 确认新增
            $scope.enterAdd = function () {
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
                var opts=$scope.addModel;
                //opts['provinceId']=$scope.addModel.provinceSelected;
                //opts['cityId']=parseInt($scope.addModel.citySelected);
                //opts['countyId']=parseInt($scope.addModel.countySelected);
                var opts = angular.extend({},  $scope.addModel, {});//克隆出新的对象，防止影响scope中的对象
                var sendParams = {
                    param: {
                        query:opts
                    }
                }
                wlConsigner.getDataTable( $scope.giftTtle=='添加收件方'?'/distributionUser/addRecDistributionUser':'/distributionUser/updateRecDistributionUser', sendParams)
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
                $scope.giftTtle = "编辑收件方信息";
                wlConsigner.getDataTable('/distributionUser/initRecDistributionUser', {param: {query: {id: item.ID}}})
                    .then(function (data) {
                        $scope.addModel.id= data.banner.userInfo.id;
                        $scope.addModel.userName=data.banner.userInfo.userName;
                        $scope.addModel.tel=data.banner.userInfo.tel;
                        $scope.addModel.address=data.banner.userInfo.address;
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
                    wlConsigner.getDataTable(
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

            //导入
            $scope.isShow=true;
            $scope.impUploadFiles= function (files) {
                if(files.length==0) return false;
                //多文件上传
                var count=0;
                function upFiles(){
                    uploadFileService.upload('/distributionUser/importRecDistributionUser',files[count],function(evt){
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
            get()
            $scope.dropDownList = [];
            $scope.userNameAutocomplete= function (newValue) {
                var opts = angular.extend({}, $scope.searchModel, {});
                opts.userName=newValue;
                opts.cooperationState = $scope.searchModel.cooperationStateSelect;
                return wlConsigner.autoCompletion({
                    param: {
                        query: opts
                    }
                });
            };
        }])
});