/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/platform/integral-mall/giftReplenishmentConfirmService'], function (app) {
     var app = angular.module('app');
    app.controller('giftReplenishmentConfirmCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','giftReplenishmentConfirm','uploadFileService', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window,giftReplenishmentConfirm,uploadFileService) {
        // 配置查询
        $scope.querySeting = {
            items: [  {
                type: 'text',
                model: 'giftName',
                title: '礼品名称'
            }, {
                type: 'text',
                model: 'sku',
                title: '礼品编码'
            }, {
                type: 'select',
                model: 'giftType',//下拉框数组
                selectedModel: 'giftTypeSelect',//设置下拉框选中状态id
                title: '礼品分类'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //tableͷ
        $scope.thHeader = giftReplenishmentConfirm.getThead0();
        $scope.addThHeader = giftReplenishmentConfirm.getThead1();
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
        var pmsSearch = giftReplenishmentConfirm.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query;
            $scope.searchModel.giftTypeSelect=-1;//设置下拉框默认选中
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
        $scope.giftReplenishmentConfirmModel={
            party:{
                name:'',
                id:0
            },
            rdcId:{
                id:'-1',
                select:[],
            },
            wlCompId:{
                id:-1,
                select:[]
            },
            expressNo:''
        }
       //初始化添加礼品下拉框的数据
        giftReplenishmentConfirm.getDataTable('/giftReplenishment/getReplenishmentStore', {param:{}})
            .then(function (data) {
                $scope.giftReplenishmentConfirmModel.rdcId.select=data.query.rdcList;
                $scope.giftReplenishmentConfirmModel.wlCompId.select=data.query.wlCompList;
                $scope.giftReplenishmentConfirmModel.party=data.query.party;
                $scope.query =data.query;
            })
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.giftType=$scope.searchModel.giftTypeSelect;//设置下拉框数据
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = giftReplenishmentConfirm.getDataTable(
                '/giftReplenishment/queryGiftList',
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
                if(data.code==-1){
                    alert(data.message);
                    $scope.result2 = [];
                    $scope.paging = {
                        totalPage: 1,
                        currentPage: 1,
                        showRows: $scope.paging.showRows,
                    };
                    return false;
                }
                $scope.result2 = data.grid;
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
        //确认补货
        $scope.confirmReplenishment= function () {
            if($scope.giftReplenishmentConfirmModel.rdcId.id=='-1'){
                alert('请选择收货仓库！');
                return;
            }
            if($scope.giftReplenishmentConfirmModel.wlCompId.id=='-1'){
                alert('请选择承运快递！');
                return;
            }
            if(!$scope.result1){
                alert('补货礼品不能为空!');
                return;
            }
            var isChecked=true;
            angular.forEach($scope.result1, function (item) {
                if(!item.price||!item.count){
                    alert('礼品单价或补货数量不能为空!');
                    isChecked=false;
                    return false;
                }
            });
            if(!isChecked) return;
            //确认补货的时候传给后台的数据
            var opts = {
                query:{ giftList: $scope.result1,
                    partyId: $scope.giftReplenishmentConfirmModel.party.id,
                    rdcId: $scope.giftReplenishmentConfirmModel.rdcId.id,
                    wlCompId: $scope.giftReplenishmentConfirmModel.wlCompId.id,
                    expressNo: $scope.giftReplenishmentConfirmModel.expressNo,

                },
            }
            giftReplenishmentConfirm.getDataTable('/giftReplenishment/confirmReplenishment', {param: opts})
                .then(function (data) {
                     if(data.status.code=="0000") {
                        alert(data.status.msg, function () {
                            $state.go('main.giftReplenishment');
                        });
                    }else
                        alert(data.status.msg);
                });
        }
        //添加补货礼品
        $scope.addReplenishmentGift = function () {
            $scope.giftTtle = "添加补货礼品";
            //设置清空表单
            $scope.giftModel.sku= '';
            $scope.giftModel.giftName= '';
            $scope.giftModel.brand='';
            $scope.giftModel.giftType.id=-1;
            $('#createReplenishmentGift').modal('show');
        }
        //定义表单模型
        $scope.giftModel={
            sku:'',
            giftName:'',
            brand:'',
            giftType:{
                id:-1,//下拉框选中id
                select:[] //下拉框数组，格式{id:-1,name:'请选择'}
            }
        }
        //删除
        $scope.deleteGift= function (i,item) {
            $scope.result1.splice(i,1);
        }
        //添加选择
        $scope.addSelected= function () {
            var results = [];
            angular.forEach($scope.result2, function (item) {
                if (item.pl4GridCheckbox.checked) {
                    results.push(item);
                }
            });
            if(results.length==0){
                alert('请选择！');
                return;
            }
            $scope.result1=results;
            $("#createReplenishmentGift").modal('hide');
        }
        //初始化添加礼品下拉框的数据
        giftReplenishmentConfirm.getDataTable('/gift/getGiftTypeLists', {param:{}})
            .then(function (data) {
                $scope.giftModel.giftType.select=data.query.giftType;
            })
    }])
});