/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/platform/settle-accounts/brokenSearchService'], function (app) {
     var app = angular.module('app');
    app.controller('brokenSearchCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','brokenSearch', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window,brokenSearch) {

        // query moudle setting
        $scope.querySeting = {
            items: [ {
                type: 'text',
                model: 'recordId',
                title: '登记单号'
            },{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            },{
                type: 'text',
                model: 'custTaskId',
                title: '客户单号'
            }, {
                type: 'select',
                model: 'distributype',
                selectedModel: 'distributypeSelect',
                changeCallBack:'wlTypeChange',
                title: '配送方式'
            },
            //     {
            //     type: 'select',
            //     model: 'wlComp',
            //     selectedModel: 'wlCompSelect',
            //     title: '承运商'
            // },
                {
                type: 'select',
                model: 'distributName',
                selectedModel: 'distributNameSelect',
                title: '配送员'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '登记日期'
            }, {
                type: 'select',
                model: 'payState',
                selectedModel: 'payStateSelect',
                title: '支付状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //theadr
        $scope.thHeader=brokenSearch.getThead();
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
        var pmsSearch = brokenSearch.getSearch();
        pmsSearch.then(function (data) {
            $scope.labelName = '配送选择';
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.distributypeSelect = -1;
            $scope.searchModel.distributNameSelect = -1;
            $scope.searchModel.payStateSelect = -1;
            // $scope.searchModel.wlCompSelect = -1;
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            $scope.storageSelectedRDC = '-1';
            //获取table数据
            get();
        }, function (error) {
            console.log(error)
        });
        //承运方式 下拉框change
        // $scope.wlTypeChange = function () {
        //     var wlTypeSelect=$scope.searchModel.distributypeSelect;
        //     brokenSearch.getDataTable(
        //         HOST + '/payMent/transuser',
        //         {
        //             param: {
        //                 query: {deliveryMode:wlTypeSelect}
        //             }
        //         }
        //     ).then(function (data) {
        //         if(data.code!=-1){
        //             if(wlTypeSelect==1)
        //                 $scope.searchModel.distributName=data.query.carrierId;
        //             else if(wlTypeSelect==2||wlTypeSelect==3)
        //                 $scope.searchModel.distributName=data.query.driverId;
        //             $scope.searchModel.distributNameSelect = -1;
        //         }else {
        //             alert(data.message);
        //         }
        //     });
        // }
        //查询
        $scope.searchClick = function () {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            get();
           // $scope.searchModel.taskId = '';
        }
        $scope.exParams = '';
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.distributype = $scope.searchModel.distributypeSelect;
            opts.distributName = $scope.searchModel.distributNameSelect;
            opts.payState = $scope.searchModel.payStateSelect;
            // opts.wlComp=$scope.searchModel.wlCompSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = brokenSearch.getDataTable(
            		HOST+ '/compensateMonitor/query_ShenHeList',
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
            opts.distributype = $scope.searchModel.distributypeSelect;
            opts.distributName = $scope.searchModel.distributNameSelect;
            opts.payState = $scope.searchModel.payStateSelect;
            // opts.wlComp=$scope.searchModel.wlCompSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
             
             var params=$filter('json')({query:opts});
        	$window.open('../compensateMonitor/impToExcel?tokenId='+$rootScope.userInfo.token+'&sessionid='+$rootScope.userInfo.sessionId+'&param='+params)
        	
        }
        // 支付登记
        $scope.payThHeader = brokenSearch.getPayThead();
        $scope.payRegistration = function(index, item){
        	$('#payRegistration').modal('show');
        	var sendParam = {
        		param: {
        			query: {
        				recordId: item.recordId,
						taskId: item.taskId,
						custTaskId: item.customerId,
						list: ''
        			}
        		}
        	}
        	$scope.universalSendParam = angular.extend({},{},sendParam);
        	var promise = brokenSearch.getDataTable(HOST+ '/compensateMonitor/payRecord', sendParam);
            promise.then(function (data) {
                $scope.payResult = data.grid;
                $scope.payBanner = data.banner;
                //$scope.universalSendParam.param = JSON.parse($scope.universalSendParam.param);
                //$scope.universalSendParam.param.query.list = data;
                
            }, function (error) {
                console.log(error);
            });
        }
        // 确认收款
        $scope.confirmReceipt = function(){
        	// console.log( $scope.universalSendParam );
        	var promise = brokenSearch.getDataTable(HOST+ '/compensateMonitor/update_ShenDetail', $scope.universalSendParam);
            promise.then(function (data) {
            	if(data.status.code == '0000'){
            		$('#payRegistration').modal('hide');
            		alert('收款成功');
            		get();
            	}
            }, function (error) {
                console.log(error);
            });
        }
        // 查看
        $scope.lookThHeader = brokenSearch.getLookThead();
        $scope.inspect = function(index, item){
        	$('#inspect').modal('show');
        	var sendParam = {
        		param: {
        			query: {
        				'recordId': item.recordId,
						'taskId': item.taskId,
						'custTaskId': item.customerId
        			}
        		}
        	}
        	var promise = brokenSearch.getDataTable(HOST+ '/compensateMonitor/payRecord', sendParam);
            promise.then(function (data) {
                $scope.lookResult = data.grid;
                $scope.lookBanner = data.banner;
            }, function (error) {
                console.log(error);
            });
        }
    }])
});