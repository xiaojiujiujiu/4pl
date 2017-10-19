/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/platform/settle-accounts/tackGoodsDifferenceService'], function (app) {
     var app = angular.module('app');
    app.controller('tackGoodsDifferenceCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','tackGoodsDifference', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window,tackGoodsDifference) {
        // query moudle setting
        $scope.querySeting = {
            items: [ {
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            },{
                type: 'text',
                model: 'custTaskId',
                title: '客户单号'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '收货日期'
            }, {
                type: 'select',
                model: 'taskType',
                selectedModel: 'taskTypeSelect',
                title: '业务类型'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //theadr
        $scope.thHeader=tackGoodsDifference.getThead();
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
        var pmsSearch = tackGoodsDifference.getSearch();
        pmsSearch.then(function (data) {
            // console.log(data)
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.taskTypeSelect = -1;
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            $scope.storageSelectedRDC = '-1';
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
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.taskType = $scope.searchModel.taskTypeSelect;

            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = tackGoodsDifference.getDataTable(
            		HOST + '/differentMonitor/adminQuery_different',
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
            }, function (error) {
                console.log(error);
            });
        }

        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }              
        //导出
        $scope.impToExcel = function () {
        	 //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.taskType = $scope.searchModel.taskTypeSelect;

            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
             
             var params=$filter('json')({query:opts});
        	$window.open('../differentMonitor/adminImpToExcel?param='+params)
        	
        }
    }])
});