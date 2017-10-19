/**
 * 
 * @authors Hui Sun 
 * @date    2015-12-11 
 * @version $Id$
 */
'use strict';
define(['../../../app', '../../../services/logistics/logisticsSettlement/paymentForGoodsService'], function(app) {
     var app = angular.module('app');
    app.controller('paymentForGoodsCtrl', ['$scope', '$state', '$sce', 'paymentForGoods','HOST', function($scope, $state, $sce, paymentForGoods,HOST) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'select',
                model: 'opUser',
                selectedModel: 'opUserSelect',
                title: '配送员 '
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '回执时间'
            }, {
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            }, {
                type: 'text',
                model: 'orderId',
                title: '客户单号'
            },{
                type: 'select',
                model: 'receiptPayType',
                selectedModel: 'receiptPayTypeSelect',
                title: '支付方式 ',
                isNavShow:true
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };

        //table头
//        $scope.thHeader = paymentForGoods.getThead();
        $scope.tabFlag = true;
        function getTableHeader(){
            if($scope.tabFlag){
                $scope.thHeader = paymentForGoods.getThead();
            }else{
                $scope.thHeader = paymentForGoods.getTheadChange();
            }
        }
        getTableHeader();
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
        $scope.ifShowSelect=true;
        var pmsSearch = paymentForGoods.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.opUserSelect = -1;
            $scope.searchModel.receiptPayTypeSelect = -1;
            $scope.labelName = '配送选择';
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            if(data.query.flag==1){
                $scope.ifShowSelect=false;
            }else {
                $scope.ifShowSelect=true;
            }
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
                showRows: $scope.paging.showRows,
            };
            get();
        }

        function get(packStatus) {
        	 if(!packStatus){
                 if($scope.tabFlag){
                     packStatus = 1;
                 }else{
                     packStatus = 2;
                 }
             };
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.opUser = $scope.searchModel.opUserSelect;
            opts.receiptPayType = $scope.searchModel.receiptPayTypeSelect;
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            opts.packStatus = packStatus;
            var promise = paymentForGoods.getDataTable(
            		HOST + '/payMent/query_receiptList',
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
        $scope.navShow = true;
        $scope.tabChange = function(index){
            var date = new Date();
            $('#dt_0').datepicker('setValue', new Date(date.getFullYear(), date.getMonth(), date.getDate()));
            $('#dt_1').datepicker('setValue', new Date(date.getFullYear(), date.getMonth(), date.getDate()));
            $('#dt_0,#dt_1').val('');
            $scope.paging.currentPage= 1;
            $scope.searchModel.opUserSelect = -1;
            $scope.searchModel.receiptPayTypeSelect = -1;
            $scope.searchModel.taskId='';
            $scope.searchModel.orderId='';
            $scope.searchModel.startTime='';
            $scope.searchModel.endTime='';


            if(index == 1){
                $scope.querySeting.items[4].isNavShow=true;
            	  $scope.navShow = true;
                $scope.tabFlag = true;
            }else{
                $scope.querySeting.items[4].isNavShow=false;
            	 $scope.navShow = false;
                $scope.tabFlag = false;
            }
            //getQuery(index);
            getTableHeader(index);
            get(index);

        };

        //收款
        $scope.confirmMoney= function (){
            var ids='';
            var money= 0,payTypes=[],isResutl=false;
            angular.forEach($scope.result, function (item){
                if(item.pl4GridCheckbox.checked){
                    payTypes.push(item);
                }
            });
            for(var i=0;i<payTypes.length;i++){
                money +=+payTypes[i].collectMoney;
                ids+=payTypes[i].taskId+";"+payTypes[i].receiptPayType+',';
            }
            for(var j=0;j<payTypes.length-1;j++){
                if(payTypes[j].receiptPayType!=payTypes[j+1].receiptPayType){
                    isResutl=true;
                }
            }
            if (payTypes.length == 0) {
                alert('请选择需要收款的订单！')
                return;
            }
            if(isResutl){
                alert('请选择相同的结算方式');
                return false;
            }else{

            }
            //money=money.toFixed(2);
            money = Number(money).toFixed(2);
            if(ids!='' && isResutl!=true) {
                if (confirm('当前勾选的业务单合计代收款【' + money + '】元，是否确认收款并生成结算单号?')) {
                    if (ids != '') {
                        ids = ids.substr(0, ids.length - 1);
                        var promise = paymentForGoods.confirmMoney(HOST + '/payMent/confirmMoney', {
                                param: {
                                    query: {
                                        taskIds: ids,
                                        money: money
                                    }
                                }
                            }
                        );
                        promise.then(function (data) {
                            if (data.status.code != "0000") {
                                alert(data.status.msg);
                                get();
                            } else {
                                alert(data.status.msg);
                                get();
                            }
                        })
                    }
                }
            }
        }
        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
       }])
});