/**
 * Created by xiaojiu on 2017/3/28.
 */

'use strict';
define(['../../../app', '../../../services/platform/information/platformExpenseAuditService'], function (app) {
    var app = angular.module('app');
    app.controller('platformExpenseAuditCtrl', ['$rootScope', '$scope', '$state', '$sce', '$window', 'platformExpenseAudit', function ($rootScope, $scope, $state, $sce, $window, platformExpenseAudit) {
        $scope.navShow = true;
        $scope.pageModel = {
            receiptId:'',
            waybill:'',
            taskId:'',
        }
        $scope.examinestatu={
            examinestatuSelect:[],
            id:"1"
        }

        //table头
        $scope.thHeader = platformExpenseAudit.getThead();
        //分页下拉框
        $scope.pagingSelect = [
            { value: 5, text: 5 },
            { value: 10, text: 10, selected: true },
            { value: 20, text: 20 },
            { value: 30, text: 30 },
            { value: 50, text: 50 }
        ];
        //日志分页下拉框
        $scope.pagingSelect = [
            { value: 5, text: 5 },
            { value: 10, text: 10, selected: true },
            { value: 20, text: 20 },
            { value: 30, text: 30 },
            { value: 50, text: 50 }
        ];
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        var pmsSearch = platformExpenseAudit.getSearch();
        pmsSearch.then(function (data) {
            $scope.pageModel = data.query;//设置当前作用域的查询对象
            $scope.examinestatu.examinestatuSelect = data.query.examinestatu;
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            //获取table数据
            get(inGoodsState);
        }, function (error) {
            console.log(error)
        });

        //查询
        $scope.searchClick = function (inGoodsState) {
            //设置默认第一页
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            get(inGoodsState);
            //            $scope.searchModel.taskId = '';
        }
        //任务类型 下拉框change
        $scope.orderTypeIdChange = function () {
            //console.log($scope.searchModel.orderTypeIdSelect)
        }
        var inGoodsState = 2;
        function get(inGoodsState) {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.pageModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.examinestatu = $scope.examinestatu.id;
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.inGoodsState = inGoodsState;
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            if(inGoodsState===2){
                var promise = platformExpenseAudit.getDataTable('/operatingexpense/queryPfExpenseList',{ param: { query: opts } });
                promise.then(function (data) {
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
            }else if(inGoodsState===1){
                var promise = platformExpenseAudit.getDataTable('/operatingexpense/queryPfDeliverCostsList',{ param: { query: opts } });
                promise.then(function (data) {
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
        }
        $scope.navClick = function (i) {
        	  $scope.pageModel.receiptId='';
        $scope.pageModel.waybill='';
        $scope.pageModel.taskId='';
            $scope.storageSelectedCDC = '-1';
            $scope.storageSelectedRDC = '-1';
            $scope.$storageSelectedRDCVal = '全部';
            $scope.storageCDCVi=0;
            $scope.examinestatu.id="1"
            if (i == 2) {
                $scope.navShow = true;
                $scope.thHeader = platformExpenseAudit.getThead();
            } else if (i == 1) {
                $scope.thHeader = platformExpenseAudit.getThead2();
                $scope.navShow = false;
            }
            inGoodsState = i;
            get(inGoodsState);

            //$("#dt_0").datepicker.defaults.onRender(new Date())
            var date = new Date();
            $('#dt_0').datepicker('setValue', new Date(date.getFullYear(), date.getMonth(), 1));
        }
        //通过
        $scope.adopt=function(i,item){
            $rootScope.id=item.id;
        }
        //确认审核
        $scope.examinationAdd=function(){
            var opts={};
            opts.id=$rootScope.id;
            opts.str=1;
            if(inGoodsState===2){
                 platformExpenseAudit.getDataTable('/operatingexpense/updateExaminestatu',{ param: { query: opts } })
               .then(function (data) {
            	   $scope.pageModel.receiptId=''
//            	   $scope.pageModel.taskId='';
            	   get(inGoodsState);
                   alert(data.status.msg);
                   $("#examination").modal("hide");
                });
                 //get(inGoodsState);
            }else if(inGoodsState===1){
                platformExpenseAudit.getDataTable('/operatingexpense/updateDcExaminestatu',{ param: { query: opts } })
                    .then(function (data) {
                    	 $scope.pageModel.taskId='';
                    	 $scope.pageModel.waybill='';
                    	 get(inGoodsState);
                        alert(data.status.msg);
                        $("#examination").modal("hide");
                    });
                //get(inGoodsState);
            }
        }
        //驳回审核
        $scope.rejectAdd=function(){
            var opts={};
            opts.id=$rootScope.id;
            opts.str=0;
            if(inGoodsState===2){
                platformExpenseAudit.getDataTable('/operatingexpense/updateExaminestatu',{ param: { query: opts } })
                    .then(function (data) {
                    	 $scope.pageModel.receiptId='';
 //                   	 $scope.pageModel.taskId='';
                    	 get(inGoodsState);
                        alert(data.status.msg);
                        $("#reject").modal("hide");
                    });
               
            }else if(inGoodsState===1){
                platformExpenseAudit.getDataTable('/operatingexpense/updateDcExaminestatu',{ param: { query: opts } })
                    .then(function (data) {
                    	 $scope.pageModel.taskId='';
                    	 $scope.pageModel.waybill='';
                    	get(inGoodsState);
                        alert(data.status.msg);
                        $("#reject").modal("hide");
                    });
                
            }
        }


        //分页跳转回调
        $scope.goToPage = function () {
            get(inGoodsState);
        }


    }])
});