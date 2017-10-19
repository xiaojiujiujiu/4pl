/**
 * Created by xiaojiu on 2017/2/6.
 */
'use strict';
define(['../../../app', '../../../services/storage/storage/badUpshelfService'], function(app) {
    var app = angular.module('app');
    app.controller('badUpshelfCtrl', ['$rootScope','$scope', '$state', '$sce','$window', 'badUpshelf', function($rootScope,$scope, $state, $sce,$window, badUpshelf) {
        //$state.go('checkstorage',{taskId:123});  跳转

        //查询配置 注意(查询返回对象必须设置为$scope.searchModel)
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            },{
                type: 'text',
                model: 'orderID',
                title: '客户单号'
            }, {
                type: 'select',
                model: 'customerID',
                title: '客户',
                selectedModel: 'customerIDSelect'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '收货日期'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };

        //table头
        $scope.thHeader = badUpshelf.getThead();
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
        var pmsSearch = badUpshelf.getSearch();
        pmsSearch.then(function(data) {
            // console.log(data)
            $scope.searchModel = data.query;
            //下拉框model
            $scope.searchModel.customerIDSelect = -1;
            $scope.searchModel.putGoodsStateSelect = -1;
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
                showRows: $scope.paging.showRows
            };
            get();
//            $scope.searchModel.taskId = '';
        }
        //任务类型 下拉框change
        $scope.orderTypeIdChange = function() {
            //  console.log($scope.searchModel.orderTypeIdSelect)
        }
        var putState=-1;
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.putState=putState;
            opts.customerID = $scope.searchModel.customerIDSelect;
            opts.putGoodsState = $scope.searchModel.putGoodsStateSelect;

            // opts.customerId = $scope.searchModel.customerIdSelect;
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = badUpshelf.getDataTable({param: {query:opts}});
            promise.then(function(data) {
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
                    showRows: $scope.paging.showRows
                };
            }, function(error) {
                console.log(error);
            });
        }
        $scope.navClick= function (i) {
            $scope.searchModel.taskId='';
            $scope.searchModel.orderID='';
            $scope.searchModel.startTime='';
            $scope.searchModel.endTime='';
            $scope.searchModel.customerIDSelect=-1;
            if(i==0){
                putState=-1;
                $scope.querySeting.items[3].title='收货日期';
                $scope.thHeader[3].name='收货日期';
            }else {
                putState=1;
                $scope.querySeting.items[3].title='上架日期';
                $scope.thHeader[3].name='上架日期';
            }
            $scope.paging.currentPage=1;
            get();
           // $('#dt_0,#dt_1').datepicker({defaultDate:'',reset:true});
        }
        //打印
        $scope.print= function (i,item) {
            $window.open("../print/itemDamageUpShel.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskId="+item.taskId+"&outFlag="+item.outFlag);

        }
        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
    }])
});