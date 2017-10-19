/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/platform/customer-manage/addCustomerService', '../../../services/addressLinkageService'], function (app) {
     var app = angular.module('app');
    app.controller('addCustomerCtrl', ['$scope','$sce','addCustomer','addressLinkage', function ($scope,$sce,addCustomer,addressLinkage) {
        $scope.customerModel= {
            customerName:'',
            bossMan:'',
            bossTel:'',
            address:''
        };
        $scope.searchModel = {
            province: [],
            city: [{id: '-1', name: '全部'}],
            county: [{id: '-1', name: '全部'}],
            startTime: '',
            endTime: ''
        }
        //获取省
        addressLinkage.getProvince({"param":{"query":{"isAllFlag":2,"parentId":0}}})
            .then(function (data) {
                $scope.searchModel.province=data.query.areaInfo;
                $scope.searchModel.provinceSelected=-1;
                $scope.searchModel.citySelected = '-1';
                $scope.searchModel.countySelected = '-1';
            }, function (error) {
                console.log(error);
            });
        $scope.isShow=true;

        //省 选择事件
        $scope.searchModel.provinceChange = function (call) {
            var opt = {
                query: {parentId: $scope.searchModel.provinceSelected}
            }
            //获取市
            addressLinkage.getCity({param:opt})
                .then(function (data) {
                    $scope.searchModel.city = data.query.city;
                    if(!(call instanceof Function))
                        $scope.searchModel.citySelected = '-1';
                    else
                        call();
                }, function (error) {
                    console.log(error)
                });
            //初始化区
            $scope.searchModel.county=[{id: '-1', name: '全部'}];
            $scope.searchModel.countySelected = '-1';
            //台湾.香港.澳门
            if(parseInt($scope.searchModel.provinceSelected) === 420000||parseInt($scope.searchModel.provinceSelected) === 430000||parseInt($scope.searchModel.provinceSelected) === 440000 || parseInt($scope.searchModel.provinceSelected) === 450000) {
                $scope.isShow=false;
            }else{
                $scope.isShow=true;
            }
        }
        //市 选择事件
        $scope.searchModel.cityChange = function (call) {
            var opt = {
                query: {parentId: $scope.searchModel.citySelected}
            }
            //获取市
            addressLinkage.getCounty({param:opt})
                .then(function (data) {
                    $scope.searchModel.county = data.query.city;
                    if(!(call instanceof Function))
                        $scope.searchModel.countySelected = '-1';
                    else
                        call();
                }, function (error) {
                    console.log(error)
                });
        }
        //区 选择事件
        $scope.searchModel.countyChange = function () {

        }
    	 //查询配置 注意(查询返回对象必须设置为$scope.searchModel)
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'customerName',
                title: '客户名称'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };

        //table头
        $scope.thHeader = addCustomer.getThead();
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
        /*var pmsSearch = addCustomer.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query;//设置当前作用域的查询对象
            //获取table数据
            get();
        }, function (error) {
            console.log(error)
        });*/
        // 客户名称
        $scope.searchName = '';
        //查询
        $scope.searchClick = function () {
            //设置默认第一页

            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            get($scope.searchName);
        }
        function get(searchName) {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            if( searchName != undefined ){
                opts.customerName = searchName;
            }
            var promise = addCustomer.getDataTable(
                '/customer/queryCustomerList',
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
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
                $scope.result = data.grid;
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
                // console.log($scope.paging)

                // $scope.paging.totalPage = data.total;
            }, function (error) {
                console.log(error);
            });
        }

        //添加地址
        $scope.enterAdd= function () {
            if($scope.searchModel.provinceSelected==-1){
                alert('请选择省!');
                return;
            }
            if($scope.searchModel.citySelected == '-1'){
                alert('请选择市!');
                return;
            }
            if($scope.searchModel.county.length>1){
                if ($scope.searchModel.countySelected == '-1') {
                    alert('请选择区县!');
                    return;
                }
            }
            //台湾.香港.澳门
            //if(parseInt($scope.searchModel.provinceSelected)!=420000&&parseInt($scope.searchModel.provinceSelected)!=430000&&parseInt($scope.searchModel.provinceSelected)!=440000) {
            //
            //}
            var opts=$scope.customerModel;
            opts['sheng']=$scope.searchModel.provinceSelected;
            opts['shi']=parseInt($scope.searchModel.citySelected);
            opts['xian']=parseInt($scope.searchModel.countySelected);
            opts['id']=$scope.addCustomTitle=='添加客户'?0:customID;

            addCustomer.getDataTable(
                $scope.addCustomTitle=='添加客户'?'/customer/insertCustomer':'/customer/updateCustomer',
                {
                    param: {
                        query: {customer:opts}
                    }
                }
            ).then(function (data) {
                alert(data.status.msg);
                if(data.status.code=="0000"){
                    get();
                    $('#addCustomerModal').modal('hide');
                }
            }, function (error) {
                console.log(error);
            });
        }
        $scope.addCustomTitle='添加客户';
        var customID=0;
        //修改
        $scope.updateCustom= function (i,item) {
            $scope.addCustomTitle='修改客户';
            $scope.customerModel= {
                customerName:item.customerName,
                bossMan:item.bossMan,
                bossTel:item.bossTel,
                address:item.address
            };
            customID=item.id;
            $scope.searchModel.provinceSelected=item.sheng;
            //触发省选择
            $scope.searchModel.provinceChange(function () {
                $scope.searchModel.citySelected = item.shi+'';
                //触发市
                $scope.searchModel.cityChange(function () {
                    $scope.searchModel.countySelected=item.xian+'';
                });
            });
        }

        //删除
        $scope.deleteCustom= function (i,item) {
            if(confirm('确定删除吗?')){
                addCustomer.getDataTable(
                    '/customer/deleteCustomer',
                    {
                        param: {
                            query: {id:item.id}
                        }
                    }
                ).then(function (data) {
                    alert(data.status.msg);
                    if(data.status.code=="0000"){
                        get();
                        $('#addCustomerModal').modal('hide');
                    }
                }, function (error) {
                    console.log(error);
                });
            }
        }
        //添加按钮
        $scope.btnAddCutom= function () {
            $scope.addCustomTitle='添加客户';
            $scope.customerModel= {
                customerName:'',
                bossMan:'',
                bossTel:'',
                address:''
            };
            $scope.searchModel.provinceSelected=-1;
            $scope.searchModel.city=[{id: '-1', name: '全部'}];
            $scope.searchModel.citySelected = '-1';
            $scope.searchModel.county=[{id: '-1', name: '全部'}];
            $scope.searchModel.countySelected = '-1';

        }
        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
        get();
       // $('#addCustomerModal').modal({backdrop: 'static', keyboard: false});
        //$('#addCustomerModal').modal({backdrop:"static",show:true})
    }]);
});
