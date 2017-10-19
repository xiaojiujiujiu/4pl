/**
 * Created by xiaojiu on 2017/4/20.
 */
'use strict';
define(['../../../app', '../../../services/logistics/orderReceipt/monadAmendService'], function(app) {
    var app = angular.module('app');
    app.controller('monadAmendCtrl', ['$rootScope','$scope', '$state', '$sce', 'monadAmend', function($rootScope,$scope, $state, $sce, monadAmend) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            },{
                type: 'select',
                model: 'auditStatus',
                selectedModel:'auditStatusSelect',
                title: '审核状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = monadAmend.getThead();


        //分页下拉框
        $scope.pagingSelect = [{
            value: 5,
            text: 5
        }, {
            value: 10,
            text: 10,
            selected: true
        }, {
            value: 20,
            text: 20
        }, {
            value: 30,
            text: 30
        }, {
            value: 50,
            text: 50
        }];
        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 10
        };
        var pmsSearch = monadAmend.getSearch();
        pmsSearch.then(function(data) {

            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.auditStatusSelect=-1;
            $scope.newCar.refuseReasonModel=-1;
            $scope.newCar.paySideModel=-1;
            $scope.newCar.payTypeModel=-1;
            $scope.newCar.refuseReason=data.query.refuseReason;
            $scope.newCar.paySide=data.query.paySide;
            $scope.newCar.payType=data.query.payType;
            //获取table数据
            get();
        }, function(error) {
            console.log(error)
        });
        //拒收model
        $scope.newCar={
            refuseReason:null,
            payType:null,
            paySide:null,
            refuseReasonModel:-1,
            paySideModel:-1,
            payTypeModel:-1,
            remarks:''
        };

        //查询
        $scope.searchClick = function() {
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
            opts.auditStatus = $scope.searchModel.auditStatusSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = monadAmend.getDataTable({
                param: {query:opts}
            });
            promise.then(function(data) {
                if (data.code == -1) {
                    alert(data.message);
                    $scope.result = [];
                    $scope.paging = {
                        totalPage: 1,
                        currentPage: 1,
                        showRows: $scope.paging.showRows
                    };
                    return false;
                }
                $scope.result = data.grid;
                $scope.banner=data.banner;
                //重置paging 解决分页指令不能监听对象问题
                $scope.paging = {
                    totalPage: data.total,
                    currentPage: $scope.paging.currentPage,
                    showRows: $scope.paging.showRows,
                };
            }, function(error) {
                console.log(error);
            });
        }
        //删除
        $scope.deleteData=function(i,item){
            $rootScope.taskId=item.taskId;
        }
        $scope.deleteDetermine=function(){
            monadAmend.getData({param: {query: {
                    taskId:$rootScope.taskId
                }}},'/personalOrder/deleteMonad')
                .then(function (data) {
                    alert(data.status.msg);
                    $('#deleteData').modal('hide');
                    get();
                },function (error) {
                    console.log(error);
                });
        }
        //修改modal
        $scope.newIndentModel={
            senderNumber: '',
            chuHuoName: '',
            chuHTel:'',
            chuHAdd: '',
            receiverName: '',
            receTel: '',
            receAdd: '',
            acceGoodCount: '',
            pay: '',
            weight: '',
            size: '',
            collectMoney: '',
            collectTimeliness: '',
            fee: '',
            offerMoney: '',
            insuranceMoney: '',
            paySide: '',
            payType: '',
            remarks: '',
            frequency:'',
            chuHAdds:'',
            receAdds:''
        }
        $scope.modifyCar=function(i,item){
            monadAmend.getData({param: {query: {taskId: item.taskId}}}, '/personalOrder/initUpdatePersonalOrder')
                .then(function (data) {
                    $scope.newIndentModel.senderNumber = data.query.senderNumber;
                    $scope.newIndentModel.chuHuoName = data.query.chuHuoName;
                    $scope.newIndentModel.taskId = data.query.taskId;
                    $scope.newIndentModel.chuHTel = data.query.chuHTel;
                    $scope.newIndentModel.chuHAdd = data.query.chuHAdd;
                    $scope.newIndentModel.receiverName = data.query.receiverName;
                    $scope.newIndentModel.receTel = data.query.receTel;
                    $scope.newIndentModel.receAdd = data.query.receAdd;
                    $scope.newIndentModel.acceGoodCount = data.query.acceGoodCount;
                    $scope.newIndentModel.pay = data.query.pay;
                    $scope.newIndentModel.weight = data.query.weight;
                    $scope.newIndentModel.size = data.query.size;
                    $scope.newIndentModel.collectMoney = data.query.collectMoney;
                    $scope.newIndentModel.collectTimeliness = data.query.collectTimeliness;
                    $scope.newIndentModel.fee = data.query.fee;
                    $scope.newIndentModel.offerMoney = data.query.offerMoney;
                    $scope.newIndentModel.insuranceMoney = data.query.insuranceMoney;
                    $scope.newIndentModel.paySide = data.query.paySide + '';
                    $scope.newIndentModel.payType = data.query.payType + '';
                    $scope.newIndentModel.remarks = data.query.remarks;
                    $scope.newIndentModel.chuHAdds = data.query.chuHAdds;
                    $scope.newIndentModel.receAdds = data.query.receAdds;

                });
        }
        //修改确定
        $scope.modifyDetermine=function(){
            monadAmend.getData({param: {query: $scope.newIndentModel}}, '/personalOrder/updatePersonalOrderYd')
                .then(function(data){
                    if(data.status.code==="0000"){
                        alert(data.status.msg);
                        $("#modifyCar").modal("hide");
                        get();
                    }
                })
        }
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
    }])
});