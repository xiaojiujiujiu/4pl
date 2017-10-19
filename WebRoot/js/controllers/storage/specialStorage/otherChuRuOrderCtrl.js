/**
 * Created by xiaojiu on 2016/11/28.
 */
define(['../../../app','../../../services/storage/specialStorage/otherChuRuOrderService'], function (app) {
     var app = angular.module('app');
    app.controller('otherChuRuOrderCtrl', ['$rootScope','$scope', '$sce','$filter', '$timeout', 'otherChuRuOrder','$stateParams', function ($rootScope,$scope, $sce,$filter, $timeout, otherChuRuOrder,$stateParams) {


        // query moudle setting
        $scope.querySeting = {
            items: [ {
                type: 'text',
                model: 'taskId',
                title: '申请编号'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '制单日期'
            },{
                type: 'select',
                model: 'typeList',
                selectedModel: 'typeListSelect',
                title: '内部出库类型'
            },{
                type: 'select',
                model: 'statusList',
                selectedModel: 'statusListSelect',
                title: '审批状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //theadr
        $scope.thHeader = otherChuRuOrder.getThead();
        $scope.allTHeader = otherChuRuOrder.getAllTHeader();
        $scope.compileTHeader = otherChuRuOrder.compileTHeader();
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
        var pmsQuery = otherChuRuOrder.getQuery();
        pmsQuery.then(function (data) {
            $scope.searchModel = data.query;//设置当前作用域的查询对象
            //下拉框model
            $scope.searchModel.typeListSelect = -1;
            $scope.searchModel.statusListSelect = -1;
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
        function get(){
            //获取选中 设置对象参数

            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.type = $scope.searchModel.typeListSelect;
            opts.examineStatus = $scope.searchModel.statusListSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = otherChuRuOrder.getDataTable('/ckOtherChuRuOrder/ckOtherChuRuOrderList',{param: {query:opts}});
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
                //重置paging 解决分页指令不能监听对象问题
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function (error) {
                console.log(error);
            });
        }
        //查看
        $scope.checkDetail= function (i,item) {
            otherChuRuOrder.getDataTable('/ckOtherChuRuOrder/ckOtherChuRuOrderDetailView',{param: {query: {
                    taskId:item.taskId
                }}})
                .then(function (data) {
                    $scope.exParams = $filter('json')({query:{taskId:data.banner.taskId}});
                    if(data.status.code=="0000") {
                        $scope.alloResult = data.grid;
                        $scope.banner = data.banner;
                        $('#alloModal').modal();
                    }else {
                        alert(data.status.msg);
                    }
                },function (error) {
                    console.log(error);
                });
        }
        $scope.compileDataModel={
            typeList:{
                id:-1,
                select:[],
            },
            personList:{
                id:-1,
                select:[]
            },
            userRemarks:'',
            type:0,
            user:0,
            oldTaskId:''
        }
        //编辑
        $scope.compileData= function (i,item) {
            otherChuRuOrder.getDataTable('/ckOtherChuRuOrder/editCkOtherChuRuOrder',{param: {query: {
                    taskId:item.taskId
                }}})
                .then(function (data) {
                    if(data.status.code=="0000") {
                        $scope.compileResult = data.grid;
                        $scope.compileDataModel.typeList.select=data.banner.typeList;
                        $scope.compileDataModel.personList.select=data.banner.personList;

                        $scope.compileDataModel.typeList.id=data.banner.type;
                        $scope.compileDataModel.personList.id=data.banner.person;
                        $scope.compileDataModel.userRemarks=data.banner.userRemarks;
                        $scope.compileDataModel.oldTaskId=data.banner.taskId;
                        $('#compileData').modal();
                    }else {
                        alert(data.status.msg);
                    }
                },function (error) {
                    console.log(error);
                });
        }
        //删除
        $scope.delete= function (i,item) {
            otherChuRuOrder.getDataTable('/ckOtherChuRuOrder/deleteCkOtherChuRuOrderDetail',{param: {query: {
                    id:item.detailId
                }}})
                .then(function (data) {
                    if(data.status.code=="0000") {
                        $scope.compileResult.splice(i,1);
                    }else {
                        alert(data.status.msg);
                    }
                },function (error) {
                    console.log(error);
                });
        }
        //确定
        $scope.confirmCompile= function (item) {
            var opts = angular.extend([],  $scope.compileResult, []);//克隆出新的对象，防止影响scope中的对象
            var banner = angular.extend({},  $scope.compileDataModel, {});//克隆出新的对象，防止影响scope中的对象
            banner.list=opts;
            banner.type=banner.typeList.id;
            banner.user=banner.personList.id;
            var sendParams = {
                param: {
                    query:banner
                }
            }
            otherChuRuOrder.getDataTable('/ckOtherChuRuOrder/createOrEditCkOtherChuRuOrder',sendParams)
                .then(function (data) {
                    alert(data.status.msg)
                    if (data.status.code == "0000") {
                        $('#compileData').modal('hide');
                        get();
                    }
                })
        }
        $scope.goToPage= function () {
            get();
        }
        //打印
        $scope.print=function(i,item){
            if(item.type==="特殊出库" || item.type==="报损"){
                window.open("/print/otherChuOrderPrint.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+ item.taskId);
            }else{
                window.open("/print/otherRuOrderPrint.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+ item.taskId);
            }

        }
    }]);
});