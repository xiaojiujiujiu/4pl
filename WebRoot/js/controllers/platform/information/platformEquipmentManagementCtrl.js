/**
 * Created by xiaojiu on 2017/3/25.
 */
define(['../../../app','../../../services/platform/information/platformEquipmentManagementService'], function (app) {
    var app = angular.module('app');
    app.controller('platformEquipmentManagementCtrl', ['$scope','$sce','platformEquipmentManagement', function ($scope,$sce,platformEquipmentManagement) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
   
//                type: 'select',
//                model: 'partyId',
//                selectedModel:'partyIdSelect',
//                title: '所属运营'
            	 type: 'text',
                 model: 'equipmentName',
                 title: '设备名称'
            }],
        	
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //theadr
        $scope.thHeader=platformEquipmentManagement.getThead();
        //初始化查询数据
        var pmsSearch = platformEquipmentManagement.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel=data.query;
            $scope.searchModel.partyIdSelect = -1;
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            getTable();
        });
        //获取table
        function getTable(){
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            console.log(opts);
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.partyId=$scope.searchModel.partyIdSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            platformEquipmentManagement.getDataTable({param:{query:opts}},'/Ckequipment/queryPfEquipmentList')
                .then(function (data) {
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
                    $scope.result=data.grid;
                    $scope.paging = {
                        totalPage: data.total,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };
                });
        }
        //查询
        $scope.searchClick= function () {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            getTable();
        }

        $scope.goToPage= function () {
            getTable();
        }

        //分页对象
        $scope.paging = {
            totalPage: 1,
            currentPage: 1,
            showRows: 30,
        };


    }]);
});