/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/platform/integral-mall/giftManagementService','../../../services/uploadFileService'], function (app) {
     var app = angular.module('app');
    app.controller('giftManagementCtrl', ['$rootScope', '$scope','$timeout', '$state', '$sce', '$filter', 'HOST', '$window','giftManagement','uploadFileService',
        function ($rootScope, $scope,$timeout, $state, $sce, $filter, HOST, $window,giftManagement,uploadFileService) {

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
        //table头
        $scope.thHeader = giftManagement.getThead();
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
        var pmsSearch = giftManagement.getSearch();
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
        //导入是调用公用的services 只需要改controller 和页面 需在页面注入uploadFileService
        //导入
        $scope.isShow=true;
        $scope.impUploadFiles= function (files) {
            if(files.length==0) return false;
            //多文件上传
            var count=0;
            function upFiles(){
                uploadFileService.upload('/gift/importGiftExcel',files[count],function(evt){
                    //进度回调
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.impUploadFilesProgress=evt.config.data.file.name+'的进度:'+progressPercentage+'%';
                }).then(function (resp) {
                    //上传成功
                    $scope.impUploadFilesProgress='上传完成!';
                    get();
                    alert( resp.data.message);
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
        $scope.exParams = '';
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.giftType=$scope.searchModel.giftTypeSelect;//设置下拉框数据
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;

            $scope.exParams ={query: opts};
            var promise = giftManagement.getDataTable(
                '/gift/queryGiftList',//请求表格的数据接口
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
        $scope.giftTtle='添加礼品';
        // 添加礼品
        $scope.addGift = function () {
            $scope.giftTtle = "添加礼品";
            $scope.skuDisabled=false;
            //设置清空表单
            $scope.giftModel.sku= '';
            $scope.giftModel.giftName= '';
            $scope.giftModel.brand='';
            $scope.giftModel.giftType.id=-1;
            $('#createGift').modal('show');
           // $scope.confirmBtn = 0;
        }
        //sku编辑状态
        $scope.skuDisabled=false;
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
        //初始化添加礼品下拉框的数据
        giftManagement.getDataTable('/gift/getGiftTypeLists', {param:{}})
            .then(function (data) {
                $scope.giftModel.giftType.select=data.query.giftType;
                $scope.query =data.query;
            })
        // 确认新增
        $scope.enterAdd = function () {
            if($scope.giftModel.giftType.id==-1){
                alert('请选择礼品分类');
                return;
            }
            var opts = angular.extend({},  $scope.giftModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.giftType= $scope.giftModel.giftType.id;
            var sendParams = {
                param: {
                    query:opts
                }
            }
            //如果gifttitle==添加礼品，走的是添加接口 否就走修改接口
                giftManagement.getDataTable( $scope.giftTtle=='添加礼品'?'/gift/insertGift':'/gift/updateGift', sendParams)
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
            $scope.giftTtle = "修改礼品";
            $scope.skuDisabled=true;
            //配置的是初始化接口从服务器获取数据
            giftManagement.getDataTable('/gift/initUpdateGift', {param: {query: {id: item.id}}})
                .then(function (data) {
                    //服务器通过id返回数据并绑定到修改的表单中
                    $scope.giftModel.id= data.query.id;
                    $scope.giftModel.sku= data.query.sku;
                    $scope.giftModel.giftName= data.query.giftName;
                    $scope.giftModel.brand= data.query.brand;
                    $scope.giftModel.giftType.id=data.query.giftType;
                })

        }
    }])
});