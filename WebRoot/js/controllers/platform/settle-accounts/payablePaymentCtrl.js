/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/platform/settle-accounts/payablePaymentService'], function (app) {
     var app = angular.module('app');
    app.controller('payablePaymentCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','payablePayment', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window,payablePayment) {
    	
        // query moudle setting
        $scope.querySeting = {
            items: [ {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '统计日期'
            }, {
                type: 'select',
                model: 'jointType',
                selectedModel: 'jointTypeSelect',
                title: '合作形式'
            }, {
                type: 'select',
                model: 'state',
                selectedModel: 'payStateSelect',
                title: '支付状态'
            },{
                type: 'text',
                model: 'taskId',
                selectedModel: 'payStateSelect',
                title: '结算单号'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = payablePayment.getThead();
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
        var pmsSearch = payablePayment.getSearch();
        pmsSearch.then(function (data) {
            // console.log(data.query);
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.jointTypeSelect = '-1';
            $scope.searchModel.payStateSelect = -1;
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
        $scope.exParams = '';
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.jointType = $scope.searchModel.jointTypeSelect;
            opts.state = $scope.searchModel.payStateSelect;

            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = payablePayment.getDataTable(
            	'/payMent/query_PayList',
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
                // $scope.paging.totalPage = data.total;
            }, function (error) {
                console.log(error);
            });
        }

        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
        // 确认已付
        $scope.sendItem = {};
        $scope.confirmPayment = function(index, item){
            $('#confirmModal').modal('show');
            $scope.deptName = item.wlDeptName;
            $scope.money=item.money;
            $scope.sendItem.receiptId = item.receiptId;
        }
        //驳回
        $scope.cancelPayment = function(index, item){
            $('#cancelModal').modal('show');
            $scope.sendItem.receiptId = item.receiptId;
        }
        //确认支付完成
        $scope.confirmSend = function(){
            var promise = payablePayment.getDataTable(
                '/payMent/update_PayState',
                {
                    param: {
                        query: {
                            'receiptId': $scope.sendItem.receiptId
                        }
                    }
                }
            );
            promise.then(function (data) {
                if(data.status.code == "0000"){
                    $('#confirmModal').modal('hide');
                    alert(data.status.msg);
                    get();

                }else{
                    alert(data.status.msg)
                }
            }, function (error) {
                console.log(error);
            });
        }

        //驳回完成
        $scope.cancelSend = function(){
            var promise = payablePayment.getDataTable(
                '/payMent/reject_PayState',
                {
                    param: {
                        query: {
                            'receiptId': $scope.sendItem.receiptId
                        }
                    }
                }
            );
            promise.then(function (data) {
                if(data.status.code == "0000"){
                    $('#cancelModal').modal('hide');
                    alert(data.status.msg);
                    get();

                }else{
                    alert(data.status.msg)
                }
            }, function (error) {
                console.log(error);
            });
        }
        // 查看明细
        $scope.getDetailThead = payablePayment.getDetailThead();
        $scope.lookDetails = function(index, item){
            var promise = payablePayment.getDataTable(
                '/payMent/query_PayDetail',
                {
                    param: {
                        query: {
                            'receiptId': item.receiptId
                        }
                    }
                }
            );
            promise.then(function (data) {
                if(data.status.code == "0000"){
                     $('#logModal').modal('show');
                     $scope.logBanner = data.banner;
                     $scope.detailresult = data.grid;
                }
            })
        }
    }])
});