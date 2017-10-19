/**
 * Created by xiaojiu on 2017/3/13.
 */
'use strict';
define(['../../../app', '../../../services/logistics/deliverPutStorageDispatchManage/orderStorageService'], function(app) {
    var app = angular.module('app');
    app.controller('orderStorageCtrl', ['$scope', '$state', '$sce', 'orderStorage','$window','$rootScope', function($scope, $state, $sce, orderStorage,$window,$rootScope) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '条码',
                maxlength:25,
            }],
            btns: [{
                text: $sce.trustAsHtml('确定'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = orderStorage.getThead();
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
        var pmsSearch = orderStorage.getSearch();
        pmsSearch.then(function(data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
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
            $scope.searchModel.taskId="";
        }
        $scope.result=[];
        $scope.list =[];
        var output = [], keys = [];
        //获取数组的下标
        $scope.getIndexWithArr = function (_arr,_obj) {
            var len = _arr.length;
            for(var i = 0; i < len; i++)
            {
                if(_arr[i] == _obj)
                {
                    return parseInt(i);
                }
            }
            return -1;
        };
        function get() {
            //获取选中 设置对象参数
            //var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            var opts ={};
            opts.boxNo=$scope.searchModel.taskId;
            var promise = orderStorage.getDataTable({
                param: {query:opts}
            });
            promise.then(function(data) {

                //var isResult=false;
                //angular.forEach($scope.result, function (item,i) {
                //    if(item.taskId==data.grid[0].taskId){
                //        $scope.result[i]=data.grid[0];
                //        isResult=true;
                //        return false;
                //    }
                //});
                //if(!isResult){
                //    $scope.result.push(data.grid[0]);
                //    $scope.list = $scope.result;
                //}
                if(data.status.code==="0000") {
                    angular.forEach(data.grid, function (item) {
                        var key = item['taskId'];
                        if(keys.indexOf(key) ==-1){
                            keys.push(key);
                            output.push(item);
                        }else{
                            var thisIndex=$scope.getIndexWithArr(keys,key);
                            keys.splice(thisIndex,1,key);
                            output.splice(thisIndex,1,item);
                        }
                    });
                    $scope.result = output;
                    $scope.list=output;
                }

            }, function (error) {
                console.log(error);
            });
        }
        //订单入库
        $scope.confirmInCk= function () {
            if($scope.result==null){
                alert("本界面无业务单，请扫描业务单或箱单！");
                return false;
            }
            if($scope.result.length>0){
                angular.forEach($scope.result, function (item,i){
                    $("#equalModal").modal("show");
                    if(item.acceGoodCount===item.realcount){
                        $scope.confirmTitle="是否对订单进行入库操作？";
                    }else {
                        $scope.confirmTitle="【业务单号】实收件数与应收件数不符，是否确认入库？";
                    }
                });
            }else {
                alert("本界面无业务单，请扫描业务单或箱单！");
            }
        }
        //确认入库
        $scope.enterAddCarrier=function(){
            var opts={};
            opts.list=$scope.list
            var promise = orderStorage.deliverOrderConfrim('/personalOrder/OrderconfirmInCk',{
                param: {query:opts}
            });
            promise.then(function(data){
               if(data.status.code=="0000"){
                   alert('入库成功！分拨入库单号为：'+data.banner.stockTaskId+'是否确认打印？',function(){
                       $window.open('../print/orderStoragePrint.html?tokenId=' + $rootScope.userInfo.token + '&sessionid=' + $rootScope.userInfo.sessionId + '&stockTaskId=' + data.banner.stockTaskId);
                   });
                   $("#equalModal").modal("hide");
                   $scope.result=[];
               }
            })
        }
        //删除行
        $scope.deleteCall = function (index,item) {
            orderStorage.deliverOrderConfrim('/personalOrder/deletePrintByTaskId',{
                param: {
                    query: {
                        taskId:item.taskId
                    }
                }
            }).then(function(data){
                if(data.status.code=="0000"){
                    alert(data.status.msg);
                    $scope.result.splice(index,1);
                }
            })
        }
        //返回
        $scope.back= function () {
            $window.history.back();
        }
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
    }])
});