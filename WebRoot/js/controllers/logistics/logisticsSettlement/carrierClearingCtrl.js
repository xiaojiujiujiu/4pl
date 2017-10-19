/**
 * 
 * @authors Hui Sun 
 * @date    2015-12-11 
 * @version $Id$
 */
'use strict';
define(['../../../app', '../../../services/logistics/logisticsSettlement/carrierClearingService'], function(app) {
     var app = angular.module('app');
    app.controller('carrierClearingCtrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window', 'carrierClearing', function($rootScope, $scope, $state, $sce, $filter, HOST, $window,carrierClearing) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '承接时间'
            }, {
                type: 'select',
                model: 'wlType',
                selectedModel: 'wlTypeSelect',
                // changeCallBack: 'changeSelectCall',
                title: '配送方式'
            }, {
                type: 'select',
                model: 'opUser',
                selectedModel: 'opUserSelect',
                title: '配送员'
            }, 
//            {
//                type: 'select',
//                model: 'wlComp',
//                selectedModel: 'wlCompSelect',
//                title: '承运商'
//            }, 
            {
                type: 'select',
                model: 'payType',
                selectedModel: 'payTypeSelect',
                title: '结算方式'
            }, {
                type: 'select',
                model: 'orderStatus',
                selectedModel: 'orderStatusSelect',
                title: '订单状态'
            }, {
                type: 'select',
                model: 'orderTypeId',
                selectedModel: 'oredrTypeIdSelect',
                title: '业务类型'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };

        //table头
        $scope.thHeader = carrierClearing.getThead();
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
        $scope.ifShowSelect=true;
        var pmsSearch = carrierClearing.getSearch('/shipBanlance/getDicLists');
        pmsSearch.then(function(data) {
            /*console.log(data)*/
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.wlTypeSelect = -1;
            $scope.searchModel.opUserSelect = -1;
            $scope.searchModel.payTypeSelect = -1;
//            $scope.searchModel.wlCompSelect = -1;
            $scope.searchModel.orderStatusSelect = -1;
            $scope.searchModel.oredrTypeIdSelect = -1;
            $scope.wlCompIdSelect = -1;
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
        }, function(error) {
            console.log(error)
        });

        //查询
        $scope.searchClick = function() {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows,
            };
            get();
        }
        /*$scope.changeSelectCall = function(){
            alert(11)
        }*/
        $scope.exParams = '';
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.wlType = $scope.searchModel.wlTypeSelect;
            opts.opUser = $scope.searchModel.opUserSelect;
//            opts.wlComp = $scope.searchModel.wlCompSelect;
            opts.payType = $scope.searchModel.payTypeSelect;
            opts.orderStatus = $scope.searchModel.orderStatusSelect;
            opts.orderTypeId = $scope.searchModel.oredrTypeIdSelect;
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
//            opts.wlCompId = $scope.wlCompIdSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exParams = $filter('json')({query: opts});
            var promise = carrierClearing.getDataTable('/shipBanlance/query_BanlanceList', {
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
            }, function(error) {
                console.log(error);
            });

        }

        //分页跳转回调
        $scope.goToPage = function() {
        	 get();
        }
//        //导出
//        $scope.impToExcel = function () {
//        	  //获取选中 设置对象参数
//            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
//            opts.wlType = $scope.searchModel.wlTypeSelect;
//            opts.opUser = $scope.searchModel.opUserSelect;
//            opts.payType = $scope.searchModel.payTypeSelect;
//            opts.orderStatus = $scope.searchModel.orderStatusSelect;
//            opts.oredrTypeId = $scope.searchModel.oredrTypeIdSelect;
//            opts.wlCompId = $scope.wlCompIdSelect;
//            opts.pageNo = $scope.paging.currentPage;
//            opts.pageSize = $scope.paging.showRows;
//             
//             var params=$filter('json')({query:opts});
//        	$window.open('/shipBanlance/impToExcel?param='+params)
//        	
//        }
    }])
});