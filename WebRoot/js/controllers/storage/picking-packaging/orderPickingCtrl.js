/**
 * Created by hui.sun on 15/12/13.
 */
'use strict';
define(['../../../app', '../../../services/storage/picking-packaging/orderPickingService'], function (app) {
     var app = angular.module('app');     app.controller('orderPickingCtrl', ['$rootScope', '$scope', '$state', '$sce', '$window', 'orderPicking', function ($rootScope, $scope, $state, $sce, $window, orderPicking) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            }, {
                type: 'select',
                model: 'orderTypeId',
                title: '业务类型',
                selectedModel: 'orderTypeSelected'
            }/*, {
                type: 'text',
                model: 'orderID',
                title: '客户单号'
            }*/, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '订单日期'
            }/*,{
                type: 'select',
                model: 'printState',
                title: '状态',
                selectedModel: 'printStateSelected'
            }*/],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //$scope.verify=true;
        //table头
        $scope.thHeader = orderPicking.getThead();
        $scope.openModelThHeader = orderPicking.getOpenModelThHeader();
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
        var printStateSelected = 1;
        var pmsSearch = orderPicking.getDataTable({
            param: {
                query: {
                    printState: printStateSelected
                }
            }
        }, '/pickGoodsTask/getDicLists');
        pmsSearch.then(function (data) {
            if (data.code == -1) {
                alert(data.message);
                return false;
            }
            $scope.searchModel = data.query;
            // Query select default value
            //$scope.searchModel.printStateSelected = -1;
            $scope.searchModel.printStateSelected = 1;
            $scope.searchModel.orderTypeSelected = -1;
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
            //            $scope.searchModel.taskId = '';
        };
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象

            opts.printState = printStateSelected;
            opts.orderTypeId = $scope.searchModel.orderTypeSelected;

            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = orderPicking.getDataTable({
                param: {
                    query: opts
                }
            });
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
            }, function (error) {
                console.log(error);
            });
            $scope.tackGoods = function (obj) {
                $location.path('/checkstorage');
            }
        };
        //分页跳转回调
        $scope.goToPage = function () {
            get();
        };
        //拣货登记
        $scope.registerCall = function (index, item) {
            var promise = orderPicking.getBatchDataTable('/pickGoodsTaskZdDetail/registerPickGoodsZdDetailList', {
                param: {
                    query: {
                        taskId: item.taskId
                    }
                }
            });
            promise.then(function (data) {
                $scope.modalBanner = data.banner;
                $scope.openModelResult = data.grid;
            })
            $('#register').modal('show');

        }
        //确认登记
        $scope.addRegister = function () {
            var isTrue=true;
            var reg = new RegExp("^[0-9]*$");
           angular.forEach($scope.openModelResult, function (item,index){
               if(item.goodsCount<=0 ){
                   alert("拣货数量最小为1");
                    isTrue=false
               }
               if(item.goodsCount>item.orderCount){
                   alert("拣货数量不能大于商品数量");
                   isTrue=false
               }
               if(!reg.test(item.goodsCount)){
                   alert("请输入正确的拣货数量！")
                   isTrue=false
               }
           });
            if(isTrue==false){
                return false
            }
            var ids=[];
            var temp={};
            //获取选中
            angular.forEach($scope.openModelResult, function (item,index) {
                    temp={};
                    temp.id=item.id;
                    temp.count=item.goodsCount;
                    ids.push(temp);

            });

            var opts = {
                query:{}
            }
            opts.query.list=ids;
            var promise = orderPicking.getBatchDataTable('/pickGoodsTaskZdDetail/completeRegisterPickGoodsZdDetailList', {
                param: opts
            });
            promise.then(function (data) {
                alert(data.status.msg);
                if(data.status.code="0000"){
                    $('#register').modal('hide');
                    get();
                }

            })

        }
        // 打印选择
        $scope.taskIds = ''
        $scope.printChoice = function () {
            var taskIds = '';
            angular.forEach($scope.result, function (val, index, arr) {
                if (val.pl4GridCheckbox.checked == true) {
                    taskIds += val.taskId + ',';
                }
            })
            if (taskIds != '') {
                taskIds = taskIds.slice(0, taskIds.length - 1);
                $('#enterPrint').modal('show');
                // 打开拣货清单打印预览页面
                $window.open("/print/orderPickingList.html?tokenId=" + $rootScope.userInfo.token + "&sessionid=" + $rootScope.userInfo.sessionId + "&taskIds=" + taskIds);
                $scope.taskIds = taskIds;
            } else {
                alert('当前没有勾选打印项！')
            }
        }
        // 单个打印
        $scope.itemPrintCall = function (index, item) {
            $window.open("/print/orderPickingList.html?tokenId=" + $rootScope.userInfo.token + "&sessionid=" + $rootScope.userInfo.sessionId + "&taskIds=" + item.taskId);
            $('#enterPrint').modal('show');
            $scope.taskIds = item.taskId;
        }

        $scope.printConfirm = function () {
            var taskIds = '';
            angular.forEach($scope.result, function (val, index, arr) {
                if (val.pl4GridCheckbox.checked == true) {
                    taskIds += val.taskId + ',';
                }
            })
            if (taskIds == '') {
                alert('请勾选业务单号！');
                return;
            };
            var printPromise = orderPicking.printCongirm({
                param: {
                    query: {
                        taskIds: taskIds
                    }
                }
            });
            printPromise.then(function (data) {
                $('#enterPrint').modal('hide');
                if (data.status.code == "0000") {
                    //alert(data.status.msg);
                    get();
                    // orderPicking.getDataTable({param:{
                    //             query:{
                    //                 taskIds: $scope.taskIds
                    //         }
                    // }} )
                    //     .then(function (data) {
                    //
                    //         alert(data.status.msg);
                    //     })

                } else {
                    alert(data.status.msg);
                }
            })
        }
        //tab切换
        $scope.isConfirmBtnShow=true;
        $scope.tabChange = function (i) {
           // $('#dt_0,#dt_1').datepicker({defaultDate:'',reset:true});
            printStateSelected = i;
            if(printStateSelected==1){
                $scope.isConfirmBtnShow=true;
            }else if(printStateSelected==2){
                $scope.isConfirmBtnShow=false;
            }
            orderPicking.getDataTable({
                param: {
                    query: {
                        printState: printStateSelected
                    }
                }
            }, '/pickGoodsTask/getDicLists')
                .then(function (data) {
                    $scope.searchModel = data.query;
                    // Query select default value
                    //$scope.searchModel.printStateSelected = -1;
                    $scope.searchModel.printStateSelected = 1;
                    $scope.searchModel.orderTypeSelected = -1;
                    //获取table数据
                    get();

                }, function (error) {
                    console.log(error)
                });
        }
    }])
});