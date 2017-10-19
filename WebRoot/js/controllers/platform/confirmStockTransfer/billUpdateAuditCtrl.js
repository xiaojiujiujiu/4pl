/**
 * Created by xiaojiu on 2017/4/21.
 */
define(['../../../app','../../../services/platform/confirmStockTransfer/billUpdateAuditService'], function (app) {
    var app = angular.module('app');
    app.controller('billUpdateAuditCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','billUpdateAudit', function ($rootScope, $scope, $state, $sce, $filter, HOST, $window,billUpdateAudit) {

        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
                //autocomplete: 'goodsName',
                //autoCallback: 'goodsNameAutocomplete',
                //automodel: 'goodsId'
            },{
                type: 'select',
                model: 'auditStatus',
                selectedModel: 'auditStatusSelect',
                title: '审核状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        $scope.thHeader=billUpdateAudit.getThead();
        var pmsSearch = billUpdateAudit.getQuery();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.auditStatusSelect = -1;
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            $scope.storageSelectedRDC = '-1';
            $scope.labelName = '发起配送选择';
            // $scope.storageSelectedCDC = '-1';
            //获取table数据
            getData(true);
        }, function (error) {
            console.log(error)
        });
        //查询
        $scope.searchClick= function () {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            getData();
        }
        function getData(){
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.auditStatus = $scope.searchModel.auditStatusSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = billUpdateAudit.getDataTable('/personalOrder/getYdAuditList',{
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
                };
                // $scope.paging.totalPage = data.total;
            }, function (error) {
                console.log(error);
            });
        }
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };
        //通过驳回
        $scope.getTaskid=function(i,item){
            $rootScope.taskId=item.taskId;
            $rootScope.id=item.id;
        }
        $scope.remarksModel={
            rejectRemarks:''
        };
        //确认通过
        $scope.confirmAdopt=function(){
            billUpdateAudit.getDataTable('/personalOrder/updateBillStatus',{
                    param: {
                        query: {'taskId':$rootScope.taskId,'auditStatus':2,'id':$rootScope.id}
                    }
                }
            ).then(function(data){
                if(data.status.code=='0000'){
                    alert(data.status.msg);
                    $("#adopt").modal("hide");
                    getData();
                }
            })
        }
        //确认驳回
        $scope.confirmReject=function(){
            billUpdateAudit.getDataTable('/personalOrder/updateBillStatus',{
                    param: {
                        query: {'taskId':$rootScope.taskId,'auditStatus':3,'id':$rootScope.id,'rejectRemarks':$scope.remarksModel.rejectRemarks}
                    }
                }
            ).then(function(data){
                if(data.status.code=='0000'){
                    alert(data.status.msg);
                    $("#reject").modal("hide");
                    getData();
                }
            })
        }

        $scope.goToPage = function(){
            getData();
        }

    }]);
});