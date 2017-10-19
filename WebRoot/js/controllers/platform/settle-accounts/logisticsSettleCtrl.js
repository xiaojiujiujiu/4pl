/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app', '../../../services/platform/settle-accounts/logisticsSettleService'], function (app) {
     var app = angular.module('app');
    app.controller('logisticsSettleCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window', 'logisticsSettle', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window, logisticsSettle) {
        // query moudle setting
        $scope.querySeting = {
            items: [
//                    {
//                type: 'select',
//                model: 'wlCompId',
//                selectedModel: 'wlCompIdSelect',
//                title: '物流中心'
//            },
                {
                    type: 'date',
                    model: ['startTime', 'endTime'],
                    title: '回执时间'
                }, {
                    type: 'select',
                    model: 'wlType',
                    selectedModel: 'wlTypeSelect',
                    title: '配送方式',
                    changeCallBack:'wlTypeChange'
                }, {
                    type: 'select',
                    model: 'opUser',
                    selectedModel: 'opUserSelect',
                    title: '配送员'
                },
                // {
                //     type: 'select',
                //     model: 'payWay',
                //     selectedModel: 'payWaySelect',
                //     title: '结算分类'
                // },
                {
                    type: 'select',
                    model: 'payType',
                    selectedModel: 'payTypeSelect',
                    title: '结算方式'
                },
                // {
                //     type: 'select',
                //     model: 'orderStatus',
                //     selectedModel: 'orderStatusSelect',
                //     title: '订单状态'
                // },
                {
                    type: 'select',
                    model: 'orderTypeId',
                    selectedModel: 'orderTypeIdSelect',
                    title: '业务类型'
                }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //theadr
        $scope.thHeader = logisticsSettle.getThead();
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
        var pmsSearch = logisticsSettle.getSearch();
        pmsSearch.then(function (data) {
            // console.log(data)
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.wlCompIdSelect = '-1';
            $scope.searchModel.wlTypeSelect = -1;
            $scope.searchModel.opUserSelect = -1;
            $scope.searchModel.payWaySelect = -1;
            $scope.searchModel.payTypeSelect = '-1';
            $scope.searchModel.orderStatusSelect = -1;
            $scope.searchModel.orderTypeIdSelect = '-1';
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            $scope.storageSelectedRDC = '-1';
            $scope.labelName = '配送选择';
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
        //承运方式 下拉框change
        // $scope.wlTypeChange = function () {
        //     var wlTypeSelect=$scope.searchModel.wlTypeSelect;
        //     logisticsSettle.getDataTable(
        //         HOST + '/payMent/transuser',
        //         {
        //             param: {
        //                 query: {deliveryMode:wlTypeSelect}
        //             }
        //         }
        //     ).then(function (data) {
        //         if(data.code!=-1){
        //             if(wlTypeSelect==1)
        //                 $scope.searchModel.opUser=data.query.carrierId;
        //             else if(wlTypeSelect==2||wlTypeSelect==3)
        //                 $scope.searchModel.opUser=data.query.driverId;
        //             $scope.searchModel.opUserSelect = -1;
        //         }else {
        //             alert(data.message);
        //         }
        //     });
        // }

        $scope.exParams = '';
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.wlCompId = $scope.searchModel.wlCompIdSelect;
            opts.wlType = $scope.searchModel.wlTypeSelect;
            opts.opUser = $scope.searchModel.opUserSelect;
            opts.payWay = $scope.searchModel.payWaySelect;
            opts.payType = $scope.searchModel.payTypeSelect;
            opts.orderStatus = $scope.searchModel.orderStatusSelect;
            opts.orderTypeId = $scope.searchModel.orderTypeIdSelect;

            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = logisticsSettle.getDataTable(
                HOST + '/payMent/query_BanlanceList',
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {
                if (data.code == -1) {
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

        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
//        //导出
//        $scope.impToExcel = function () {
//        	 //获取选中 设置对象参数
//            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
//            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
//            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
//            opts.wlCompId = $scope.searchModel.wlCompIdSelect;
//            opts.wlType = $scope.searchModel.wlTypeSelect;
//            opts.opUser = $scope.searchModel.opUserSelect;
//            opts.payWay = $scope.searchModel.payWaySelect;
//            opts.payType = $scope.searchModel.payTypeSelect;
//            opts.orderStatus = $scope.searchModel.orderStatusSelect;
//            opts.oredrTypeId = $scope.searchModel.orderTypeIdSelect;
//
//            opts.pageNo = $scope.paging.currentPage;
//            opts.pageSize = $scope.paging.showRows;
//             
//             var params=$filter('json')({query:opts});
//        	$window.open('/payMent/impToExcel?param='+params)
//        	
//        }
    }])
});