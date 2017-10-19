/**
 * Created by xiaojiu on 2017/3/23.
 */
define(['../../../app','../../../services/platform/permission-manage/warehouseManageService'], function (app) {
    var app = angular.module('app');
    app.controller('warehouseManageCtrl', ['$scope','$sce','warehouseManage', function ($scope,$sce,warehouseManage) {
        $scope.searchModel={};
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'userName',
                title: '姓名'
            }, {
                type: 'text',
                model: 'tel',
                title: '手机'
            }, {
                type: 'select',
                model: 'userCaetgory',
                selectedModel:'userCaetgorySelect',
                title: '人员类别'
            }, {
                type: 'select',
                model: 'party',
                selectedModel:'partySelect',
                title: '所属运营',
                isNavShow:false
            }, {
                    type: 'select',
                    model: 'contract',
                    selectedModel:'contractSelect',
                    title: '合同期限'
                }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //theadr
        $scope.thHeader=warehouseManage.getThead();

        //查询
        $scope.searchClick= function () {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            get();
        }

        //初始化query
        warehouseManage.getDataTable({param:{}},'/user/getWarehouseUserQuery')
            .then(function (data) {
                $scope.searchModel=data.query;
                if(!!data.query.party){
                    $scope.querySeting.items[3].isNavShow=false;
                }else {
                    $scope.querySeting.items[3].isNavShow=true;
                }
                if(null !=data.query ){
                    $scope.searchModel.userCaetgorySelect='-1';
                    $scope.searchModel.partySelect='-1';
                    $scope.searchModel.contractSelect='-1';
                    $scope.storageRDC = data.query.rdcId;
                    $scope.storageCDC = data.query.cdcId;
                }

                get();
            });
        function get(){
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.userCaetgory=$scope.searchModel.userCaetgorySelect;
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.party=$scope.searchModel.partySelect;
            opts.contract=$scope.searchModel.contractSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            warehouseManage.getDataTable({param:{query:opts}})
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
                    $scope.result = data.grid;
                    //重置paging 解决分页指令不能监听对象问题
                    $scope.paging = {
                        totalPage: data.total,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };
                });
        }


        $scope.goToPage= function () {
            get();
        }

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
            showRows: 30,
        };
    }]);
});