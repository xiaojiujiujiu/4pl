/**
 * Created by xiaojiu on 2017/5/3.
 */
define(['../../../app','../../../services/logistics/personalQuery/personalQueryService'], function (app) {
    var app = angular.module('app');
    app.controller('personalQueryCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','$timeout','personalQuery', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window,$timeout, personalQuery) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '订单时间'
            },{
                type: 'text',
                model: 'chuHuoName',
                title: '发件方'
            }, {
                type: 'text',
                model: 'receiverName',
                title: '收件方'
            },  {
                type: 'select',
                model: 'clearType',
                selectedModel: 'taskStateSelect',
                title: '结算方式'
            }, {
                type: 'select',
                model: 'paySide',
                selectedModel: 'taskTypeSelect',
                title: '运费付费方'
            },{
                type: 'text',
                model: 'wlName',
                title: '配送点'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = personalQuery.getThead();
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
        var pmsSearch = personalQuery.getSearch();
        pmsSearch.then(function (data) {

            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.taskStateSelect = -1;
            $scope.searchModel.taskTypeSelect = -1;
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
//            $scope.searchModel.taskId = '';
        }
        $scope.exParams = '';
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.clearType = $scope.searchModel.taskStateSelect;
            opts.paySide = $scope.searchModel.taskTypeSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = personalQuery.getDataTable(
                '/personalMonitor/queryPersonalList',
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
                };;
            }, function (error) {
                console.log(error);
            });
        }
        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
        // 详情弹出框table头
        $scope.getLogThead = personalQuery.getLogThead();
        // 日志分页下拉框
        $scope.detailPagingSelect = [
            {value: 5, text: 5},
            {value: 10, text: 10, selected: true},
            {value: 20, text: 20},
            {value: 30, text: 30},
            {value: 50, text: 50}
        ];
        //分页对象
        $scope.detailPaging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        $scope.logPagingSelect = [
            {value: 5, text: 5},
            {value: 10, text: 10, selected: true},
            {value: 20, text: 20},
            {value: 30, text: 30},
            {value: 50, text: 50}
        ];
        //分页对象
        $scope.logPaging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        // 获取日志table数据
        $scope.getOpenModelData = function (index, item){

            var sendParam = {
                param: {
                    query: {
                        taskId: item.taskId
                    }
                }
            }
            $('#workLogModal').modal('show');
            var promise = personalQuery.getDataTable('/personalMonitor/queryPersonalLog', sendParam);
            promise.then(function(data){
                $scope.banner = data.banner;
                $scope.logResult =  data.grid;
            })
        }

    }])
});