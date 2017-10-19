/**
 * Created by xiaojiu on 2016/11/21.
 */
define(['../../../app','../../../services/platform/monitor-manage/personalMonitorService'], function (app) {
     var app = angular.module('app');
    app.controller('personalMonitorCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','$timeout','personalMonitor', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window,$timeout, personalMonitor) {
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
        $scope.thHeader = personalMonitor.getThead();
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
        var pmsSearch = personalMonitor.getSearch();
        pmsSearch.then(function (data) {

            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.taskStateSelect = -1;
            $scope.searchModel.taskTypeSelect = -1;
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            $scope.storageSelectedRDC = '-1';
            $scope.labelName = '收货点';
            $scope.storageRDCVi = data.query.rdcId;
            $scope.selectStorageCDC = data.query.cdcId;
            //获取table数据
            get();
        }, function (error) {
            console.log(error)
        });
        //第二个联动
        $scope.selectHide=true;
        $scope.selectRDCId = '-1';
        $scope.selectCDC = '-1';
        $scope.selectedRDCVal = '全部';
        $scope.selectedCDCVal = '全部';
        $scope.selectedToggUl = function () {
            $scope.selectHide = false;
        }
        if ($scope.selectStorageCDC) {
            $scope.selectStorageCDCVi = $scope.selectStorageCDC;
        }
        //RDC下拉框li click事件
        $scope.selectedRDCOptionClick = function (id, name) {
            $scope.selectRDCId = id;
            $scope.selectedRDCVal = name;
            $scope.selectedCDCVal = '全部';
            $scope.selectedFirstValue(id);
            $scope.storageRDCVi = storageRDCTemp2;
            $scope.selectHide = true;
        }
        var storageRDCTemp2, storageCDCTemp2, storageRDCKeyTimer2, storageCDCKeyTimer2;
        var watch = $scope.$watch('storageRDCVi', function () {
            if (!$scope.storageRDCVi) return false;

            storageRDCTemp2 = angular.copy($scope.storageRDCVi);

            watch();

        });
        $scope.selectedRDCBlur = function () {
            $timeout(function () {
                if ($scope.selectRDCId == '-1') {
                    $scope.selectedRDCVal = '全部';
                }
                $scope.storageRDCVi = storageRDCTemp2;
               $scope.selectedFirstValue($scope.selectRDCId);
                $scope.selectHide = true;
            }, 300);

        }
        $scope.selectedCDCBlur = function () {
            $timeout(function () {
                if ($scope.selectCDC.toString() == '-1') {
                    $scope.selectedCDCVal = '全部';
                }
                $scope.selectStorageCDCVi = storageCDCTemp2;
            }, 300);

        }
        //RDC输入框keyup 事件
        $scope.selectedRDCKeyup = function () {
            if (storageRDCKeyTimer2) $timeout.cancel(storageRDCKeyTimer2);

            var tempArr = $scope.storageRDCVi;

            storageRDCKeyTimer2 = $timeout(function () {
                $scope.selectRDCId = '-1';
                var drcTemp = [];
                if ($scope.selectedRDCVal == '') {
                    $scope.storageRDCVi = storageRDCTemp2;
                } else if ($scope.selectedRDCVal != '全部') {
                    var val = $scope.selectedRDCVal.toLowerCase();
                    angular.forEach(storageRDCTemp2, function (item) {
                        var name = item.name.toLowerCase();
                        if (name.indexOf(val) >= 0) {
                            drcTemp.push(item);
                            if (name == val) {
                                $scope.selectRDCId = item.id;
                            }
                        }

                    })
                    $scope.storageRDCVi = drcTemp;
                }
            }, 300);

        }
        //CDC输入框keyup 事件
        $scope.selectedCDCKeyup = function () {
            if (storageCDCKeyTimer2) $timeout.cancel(storageCDCKeyTimer2);
            storageCDCKeyTimer2 = $timeout(function () {
                $scope.selectCDC = '-1';
                var cdcTemp = [];

                if ($scope.selectedCDCVal == '') {

                    $scope.selectStorageCDCVi = storageCDCTemp2;
                } else if ($scope.selectedCDCVal != '全部') {


                    var val = $scope.selectedCDCVal.toLowerCase();
                    angular.forEach($scope.selectStorageCDCVi, function (item) {
                        var name = item.name.toLowerCase();
                        if (name.indexOf(val) >= 0) {
                            cdcTemp.push(item);
                            if (name == val) {
                                $scope.selectCDC = item.id;
                            }
                        }
                    })
                    $scope.selectStorageCDCVi = cdcTemp.length > 0 ? cdcTemp : storageCDCTemp2;
                }
            }, 300);

        }
        //CDC下拉框li click事件
        $scope.selectedCDCOptionClick = function (id, name) {
            $scope.selectCDC = id;
            $scope.selectCDC = id;
            $scope.selectedCDCVal = name;
            console.log($scope.selectedCDCVal)
        }
        $scope.selectedFirstValue = function (selectRDCId) {
            console.log(selectRDCId);
            if (selectRDCId.toString() == '-1') {
                $scope.selectCDC = '-1';
                $scope.selectStorageCDCVi = [];
                storageCDCTemp2 = [];
                return false;
            }
            //初始化
            $scope.selectStorageCDCVi = [{ id: '-1', name: '全部' }];
            angular.forEach($scope.selectStorageCDC, function (item) {
                if ($scope.selectRDCId == item.parentId) {
                    $scope.selectStorageCDCVi.push(item);
                }
            });
            $scope.storageCDC = '-1';
            storageCDCTemp2 = angular.copy($scope.selectStorageCDCVi);
            return false;
        }
        $scope.storageSelectedCDCChange = function (selectCDC) {
            $scope.storageCDC = selectCDC;
        }
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
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.rdcId2 = $scope.selectRDCId;//获取仓储选择第一个下拉框
            opts.cdcId2 = $scope.selectCDC;//获取仓储选择第二个下拉框
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = personalMonitor.getDataTable(
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
        $scope.getLogThead = personalMonitor.getLogThead();
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
            var promise = personalMonitor.getDataTable('/personalMonitor/queryPersonalLog', sendParam);
            promise.then(function(data){
                $scope.banner = data.banner;
                $scope.logResult =  data.grid;
            })
        }

    }])
});