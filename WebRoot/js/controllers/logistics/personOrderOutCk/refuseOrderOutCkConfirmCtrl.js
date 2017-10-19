
'use strict';
define(['../../../app', '../../../services/logistics/personOrderOutCk/refuseOrderOutCkConfirmService'], function (app) {
     var app = angular.module('app');
    app.controller('refuseOrderOutCkConfirmCtrl', ['$rootScope','$scope', '$state', '$sce','$window', 'refuseOrderOutCkConfirm', function ($rootScope,$scope, $state, $sce,$window, refuseOrderOutCkConfirm) {
        $scope.taskId = '';
        // query moudle setting
        $scope.querySeting = {
                items: [{
                    type: 'text',
                    model: 'taskId',
                    title: '业务单号',
                    maxlength:25,
                }],
                btns: [{
                    text: $sce.trustAsHtml('确定'),
                    click: 'searchClick'
                }]

            };
        $scope.pageModel = {
                distributionSelect: {
                    select1: {
                        data: [{id:-1,name:'全部'}],
                        id: -1,
                        change: function () {}
                    }
                }
            };

        //table头
        $scope.thHeader = refuseOrderOutCkConfirm.getThead();

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
        var pmsSearch = refuseOrderOutCkConfirm.getSearch();
        pmsSearch.then(function(data) {

            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.pageModel.distributionSelect.select1.data = data.query.wlDeptId;
         
        }, function(error) {
            console.log(error)
        });
        //查询
        $scope.searchClick = function () {
//        	 var reg = new RegExp("^[0-9+\-\a-zA-Z]*$");
//         	if(!reg.test($scope.taskId)){
//         		  alert("请输入正确的业务单号！")
//           		return false;
//         	}
        		get();
            
        }
        $scope.result=[];
        $scope.list =[];
        function get() {
            //获取选中 设置对象参数
            var opts ={};
            opts.boxNo=$scope.searchModel.taskId;
            var promise = refuseOrderOutCkConfirm.getDataTable({
                param: {query:opts}
            });
            promise.then(function(data) {
                var isResult=false;
                angular.forEach($scope.result, function (item,i) {
                    if(item.taskId==data.grid[0].taskId){
                        $scope.result[i]=data.grid[0];
                        isResult=true;
                        return false;
                    }
                });
                if(!isResult){
                    $scope.result.push(data.grid[0]);
                    $scope.list = $scope.result;
                }
            }, function(error) {
                console.log(error);
            });
        }
        //订单出库
        $scope.confirmInCk= function () {
            angular.forEach($scope.result, function (item,i){
               if($scope.result.length>0){
                   $("#equalModal").modal("show");
                   if(item.acceGoodCount===item.realcount){
                       $scope.confirmTitle="确认对订单进行出库操作？";
                   }else {
                       $scope.confirmTitle="【业务单号】实出件数与应出件数不符，是否确认退货出库？";
                   }
               }else {
                   alert("没有数据！");
               }
            });
        }
        //确认退货出库
        $scope.enterAddCarrier=function(){
            if($scope.pageModel.distributionSelect.select1.id==null){
                alert("请选择目的地！");
                return false;
            }
            var opts=$scope.list;
            var promise = refuseOrderOutCkConfirm.deliverOrderConfrim('/personalOrder/confirmQueryRefuseOutGoods', {
                    param: {
                        query: {
                            list:opts,
                            wlDeptId: $scope.pageModel.distributionSelect.select1.id
                        }
                    }
                }
            );
            promise.then(function(data){
                alert(data.status.msg);
                $("#equalModal").modal("hide");
                //get();
                $scope.result=[];
            })
        }

        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
        //返回
        $scope.back= function () {
            $window.history.back();
        }
        //删除行
        $scope.deleteCall = function (index,item) {
            if(confirm('确定删除吗?')){
                $scope.result.splice(index,1);
            }
        }
    }])
});