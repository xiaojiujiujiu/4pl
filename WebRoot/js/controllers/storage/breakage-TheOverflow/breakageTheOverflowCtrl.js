/**
 * Created by xiaojiu on 2016/11/8.
 */
define(['../../../app','../../../services/storage/breakage-TheOverflow/breakageTheOverflowService'], function (app) {
     var app = angular.module('app');
    app.controller('breakageTheOverflowCtrl', ['$scope', '$sce', '$timeout', 'breakageTheOverflow','$stateParams', function ($scope, $sce, $timeout, breakageTheOverflow,$stateParams) {


        // query moudle setting
        $scope.querySeting = {
            items: [ {
                type: 'text',
                model: 'taskId',
                title: '损溢单号'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '制单日期'
            },{
                type: 'select',
                model: 'status',
                selectedModel: 'customerIDSelect',
                title: '状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //theadr
        $scope.thHeader = breakageTheOverflow.getThead();
        $scope.allTHeader = breakageTheOverflow.getAllTHeader();
        $scope.compileTHeader = breakageTheOverflow.compileTHeader();
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
        var pmsQuery = breakageTheOverflow.getQuery();
        pmsQuery.then(function (data) {
            $scope.searchModel = data.query;//设置当前作用域的查询对象
            //下拉框model
            $scope.searchModel.customerIDSelect = -1;
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
       // $scope.exGoodsAlloParam={};
        function get(){
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.status = $scope.searchModel.customerIDSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            opts.taskId=$stateParams['taskId'];
           // $scope.exGoodsAlloParam={query:opts};
           // console.log(opts);
           // var promise = breakageTheOverflow.getDataTable({param: {query:opts}},'lossAndOverflowReport/queryReportList');
            var promise = breakageTheOverflow.getDataTable({param: {query:opts}});
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
            breakageTheOverflow.getDataTable({param: {query: {
                    taskId:item.taskId
                }}},'/lossAndOverflowReport/queryReportDetailList')
                .then(function (data) {

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
        //编辑
        $scope.compileData= function (i,item) {
            breakageTheOverflow.getDataTable({param: {query: {
                    taskId:item.taskId
                }}},'/lossAndOverflowReport/queryReportDetailList')
                .then(function (data) {

                    if(data.status.code=="0000") {
                        $scope.compileResult = data.grid;
                        $scope.banner=data.banner;
                        $('#compileData').modal();
                    }else {
                        alert(data.status.msg);
                    }
                },function (error) {
                    console.log(error);
                });
        }
        //删除
        $scope.deleteCustom= function (i,item) {
            $scope.compileResult.splice(i,1);

        }
        //确定
        $scope.confirmCompile= function (item) {
            var opts = angular.extend([],  $scope.compileResult, []);//克隆出新的对象，防止影响scope中的对象
            var banner = angular.extend({},  $scope.banner, {});//克隆出新的对象，防止影响scope中的对象

            var sendParams = {
                param: {
                    grid:opts,
                    query:{taskId:banner.taskId}
                }
            }
            breakageTheOverflow.getDataTable(sendParams,'/lossAndOverflowReport/confirmCkLossAndOverflowReport')
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
    }]);
});