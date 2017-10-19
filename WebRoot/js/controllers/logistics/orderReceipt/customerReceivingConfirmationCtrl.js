/**
 * Created by xiaojiu on 2017/8/11.
 */
'use strict';
define(['../../../app','../../../services/logistics/orderReceipt/customerReceivingConfirmationService'], function (app) {
    var app = angular.module('app');
    app.controller('customerReceivingConfirmationCtrl',['$rootScope','$scope','$state','$sce','$interval','$stateParams','customerReceivingConfirmation', '$window', function ($rootScope,$scope,$state,$sce,$interval,$stateParams,customerReceivingConfirmation,$window) {
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '生成日期'
            },{
                type: 'text',
                model: 'chuHuoName',
                title: '发货方'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = customerReceivingConfirmation.getThead();
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
        var pmsSearch = customerReceivingConfirmation.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
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
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = customerReceivingConfirmation.getDataTable(
                {
                    param: {
                        query: opts
                    }
                }
            );
            promise.then(function (data) {

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
        //get();

        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
        $scope.payTitie='支付'
        //确认发货
        $scope.pay=function(i,item){
            $scope.payShow=false;
            $scope.successShow=false;
            $scope.defeatedShow=false;
        	if(item.pay==null){
        		$rootScope.pays=0;
        	}else{
        		$rootScope.pays=item.pay;
        	}
        	if(item.collectMoney==null){
        		$rootScope.collectMoney=0;
        	}else{
        		 $rootScope.collectMoney=item.collectMoney;
        	}
           
            var s=parseFloat($rootScope.pays)+parseFloat($rootScope.collectMoney);
            s.toFixed(2);
            $rootScope.amountTo=s;

            var opts={};
            opts.taskId=item.taskId;
            opts.chuHTel=item.chuHTel;
            opts.chuHuoName=item.chuHuoName;
            opts.paySide=item.paySide;
            opts.payType=item.payType;
            opts.collectMoney=item.collectMoney;
            opts.fee=item.fee;
            opts.pay=item.pay;
            opts.insuranceMoney=item.insuranceMoney;
            opts.receiverName=item.receiverName;
            opts.receTel=item.receTel;
            opts.payTypes='';
            $rootScope.opt=opts;
            customerReceivingConfirmation.confirmInCk({
                    param: {
                        query:opts
                    }
                }, '/vehicleParts/clientConfirmReceive')

                .then(function (data) {
                    if (data.status.code == "0000") {
                        if(data.query.payTypes===3){
                            $('#pay').modal('show');
                            $scope.payTitie='支付成功';
                            $scope.successShow=true;
                        }else {
                            if(data.query.lzfinance_code==="000000"){
                                $('#pay').modal('show');
                                $scope.payTitie='支付';
                                $scope.payShow=true;
                                $rootScope.merchant_no=data.query.merchant_no;
                                $scope.qrcode_url="http://www.gbtags.com/gb/qrcode?t="+data.query.qrcode_url;
                                setinsFun();
                            }else {
                                alert(data.query.lzfinance_msg);
                                $('#pay').modal('hide');
                            }

                        }
                    }
                })

        }
        //监控支付状态
        var timer=null;
        function setinsFun(){
            $interval.cancel(timer);
            timer = $interval(function(){
                $('.ui-view-loading').remove();
                customerReceivingConfirmation.confirmInCk({
                    param: {
                        query:{
                            merchant_no:$rootScope.merchant_no
                        }
                    }
                }, '/vehicleParts/queryPayStatus ')
                    .then(function(data){
                        $('.ui-view-loading').remove();
                        if(data.query.status==='2'){
                            $interval.cancel(timer);
                            $scope.payTitie='支付成功';
                            $scope.payShow=false;
                            $scope.successShow=true;
                            get();
                        }else if(data.query.status==='3'){
                            $interval.cancel(timer);
                            $scope.payTitie='支付失败';
                            $scope.payShow=false;
                            $scope.defeatedShow=true;
                        }
                    })
            },5000)
        }
        $scope.Get=function(){
            $interval.cancel(timer);
            $scope.payShow=true;
            $scope.successShow=false;
            $scope.defeatedShow=false;
            get();
            console.log(111)
        }
        //更新二维码
        $scope.getewm=function(payTypes){

            var k=$rootScope.opt;
            k.payTypes=payTypes;
            customerReceivingConfirmation.confirmInCk({
                param: {
                    query:k
                }
            }, '/vehicleParts/clientConfirmReceive')
                .then(function(data){
                    if(data.status.code == "0000"){
                        if(data.query.lzfinance_code==="000000"){
                            $rootScope.merchant_no=data.query.merchant_no;
                            $scope.qrcode_url="http://www.gbtags.com/gb/qrcode?t="+data.query.qrcode_url;
                            setinsFun();
                        }else {
                            alert(data.query.lzfinance_msg);
                            $('#pay').modal('hide');
                        }

                    }
                })
        }
        //重新支付
        $scope.returns=function(){
            $scope.payTitie='支付';
            $scope.payShow=true;
            $scope.defeatedShow=false;
            setinsFun();
        }
    }]);
});