/**
 * 
 * @authors Hui Sun 
 * @date    2015-12-11 
 * @version $Id$
 */
'use strict';
define(['../../../app', '../../../services/logistics/dismantleNotePrint/dismantleNotePrintService'], function(app) {
     var app = angular.module('app');
    app.controller('dismantleNotePrintCtrl', ['$rootScope','$scope', '$state', '$sce','$window', 'dismantleNotePrint', function($rootScope,$scope, $state, $sce,$window, dismantleNotePrint) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '取货单号'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '订单生成日期'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        $scope.tabFlag = true;
        //table头
        $scope.thHeader = dismantleNotePrint.getThead();
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
        var pmsSearch = dismantleNotePrint.getSearch();
        pmsSearch.then(function(data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            //$scope.searchModel.printStateSelect=-1;
//            $scope.searchModel.orderTypeIdSelect=-1;
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
          //  $scope.searchModel.taskId = '';
        }
            //任务类型 下拉框change
//        $scope.orderTypeIdChange = function() {
//            //  console.log($scope.searchModel.orderTypeIdSelect)
//        }

        function get(printStatu) {
        	 //获取选中 设置对象参数
      	  if(!printStatu){
                if($scope.tabFlag){
              	  printStatu = 0;
                }else{
              	  printStatu = 1;
                }
            }
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.printState = printStatu;
//          opts.orderTypeId = $scope.searchModel.orderTypeIdSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = dismantleNotePrint.getDataTable('/returnPickQuery/getDismantleList', {
                param: {query:opts}
            });
            promise.then(function(data) {
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
//            $scope.tackGoods = function(obj) {
//                $location.path('/checkstorage');
//            }
        }
        //实收数量blur事件
//        $scope.actualQuantityBlur = function(item) {
//            alert('实际数量: ' + item)
//        }
//        $scope.remarksBlur = function(cont) {
//            alert(cont)
//        }
        $scope.printFlag = '';
        //打印
        $scope.print= function () {
            var ids='';
            //获取选中
            angular.forEach($scope.result, function (item) {
                if (item.pl4GridCheckbox.checked) {
                    ids+=item.taskId+',';
                }
            });
            if(ids!='') {
                ids = ids.slice(0, ids.length - 1);
                $window.open("/print/dismantleNotePrint.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskIds="+ids);
            	$('#enterPrint').modal('show');
            	$scope.printFlag = ids;
            }else {
                alert('请选择需要打印的业务单!');
            }

        }
        $scope.singlePrint = function(index, item){
        	$window.open("/print/dismantleNotePrint.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskIds="+item.taskId);
        	$('#enterPrint').modal('show');
        	$scope.printFlag = item.taskId;
        }
        $scope.printConfirm = function(){
        	var printConfirmPromise = dismantleNotePrint.getDataTable('/returnPickQuery/updatePrintStatus',{
        		param: {
        			query:{
        				taskIds: $scope.printFlag
        			}
        		}
        	});
        	printConfirmPromise.then(function(data){
        		if(data.code != 0){
        			alert(data.message);
        			$('#enterPrint').modal('hide');
        		}else{
        			get();
        			$('#enterPrint').modal('hide');
        		}
        	})
        	
        }
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
        $scope.tabChange = function(index){
            if(index == 0){
                    $scope.tabFlag = true;
            }else{
                $scope.tabFlag = false;
            }
            get(index);
            //get(index);
        }
    }])
});