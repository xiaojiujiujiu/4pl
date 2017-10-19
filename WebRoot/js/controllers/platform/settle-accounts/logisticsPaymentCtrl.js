/**
 * Created by xuwusheng on 15/12/18.
 */
define(['../../../app','../../../services/platform/settle-accounts/logisticsPaymentService'], function (app) {
     var app = angular.module('app');
    app.controller('logisticsPaymentCtrl', ['$scope','$sce','logisticsPayment','HOST', function ($scope,$sce,logisticsPayment,HOST) {
        // query moudle setting
        $scope.querySeting = {
            items: [ {
                type: 'select',
                model: 'wlCompId',
                selectedModel: 'wlCompIdSelect',
                title: '配送中心'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '结算时间'
            }, {
                type: 'select',
                model: 'wlType',
                selectedModel: 'wlTypeSelect',
                title: '物流类型'
            }, {
                type: 'select',
                model: 'state',
                selectedModel: 'stateSelect',
                title: '应付状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //theadr
        $scope.thHeader=logisticsPayment.getThead();
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
        var pmsSearch = logisticsPayment.getSearch();
        pmsSearch.then(function (data) {
            // console.log(data)
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.wlCompIdSelect = -1;
            $scope.searchModel.wlTypeSelect = -1;
            $scope.searchModel.stateSelect = -1;
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
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.wlCompId = $scope.searchModel.wlCompIdSelect;
            opts.wlType = $scope.searchModel.wlTypeSelect;
            opts.state = $scope.searchModel.stateSelect;

            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = logisticsPayment.getDataTable(
            		HOST + '/payMent/query_paymentList',
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
        $scope.sendReceiptId = '';
        $scope.confirmPayment = function(index, item){
        	$('#confirmModal').modal('show');
            $scope.deptName = item.wlDeptName;
        	$scope.amount = {
        		cashCount: item.cashCount,
        		posCount: item.posCount
        	};
        	$scope.sendReceiptId = item.receiptId;
        }
        $scope.confirmSend = function(){
        	var promise = logisticsPayment.getDataTable(
            	HOST + '/payMent/update_paymentList',
                {
                    param: {
                        query: {
                        	'receiptId': $scope.sendReceiptId
                        }
                    }
                }
            );
            promise.then(function (data) {
                if(data.code == 0){
                	$('#confirmModal').modal('hide');
                	alert('确认成功');
                	get();
                }
            }, function (error) {
                console.log(error);
            });
        }
    }])
});