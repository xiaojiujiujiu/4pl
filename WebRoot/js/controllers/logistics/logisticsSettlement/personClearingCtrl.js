/**
 * Created by hui.sun on 15/12/13.
 */
'use strict';
define(['../../../app', '../../../services/logistics/logisticsSettlement/personClearingService'], function(app) {
     var app = angular.module('app');
    app.controller('personClearingCtrl', ['$rootScope','$scope', '$state', '$sce','$window', 'personClearing', function($rootScope,$scope, $state, $sce,$window, personClearing) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            }, {
                type: 'select',
                model: 'opUser',
                selectedModel:'opUserSelect',
                title: '配送员'
            },{
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '创建时间'
            } ],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = personClearing.getThead();
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
        $scope.addModel={
            collectMoney:'',
            clearType:{
                id:-1,
                select:[]
            }
        }
        var pmsSearch = personClearing.getSearch();
        pmsSearch.then(function(data) {

            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.opUserSelect=-1;
            $scope.addModel.clearType.select=data.query.clearType;
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
        }

        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.opUser = $scope.searchModel.opUserSelect;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = personClearing.getDataTable({
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
                    showRows: $scope.paging.showRows
                };
            }, function(error) {
                console.log(error);
            });
        }
//        $scope.isShow=false;
        $scope.taskIds='';
        //$scope.collectMoney='';
        $scope.btnAddCar= function () {
        	 var ids='';
        	 var money=0;
             angular.forEach($scope.result, function (item) {
                 if (item.pl4GridCheckbox.checked) {
                     ids+=item.taskId+',';
                     money = Number(money) + Number(item.collectMoney)
                     $scope.addModel.collectMoney=money.toFixed(2);
                 }
             });
             $scope.taskIds=ids.substr(0,ids.length-1);
             //$scope.collectMoney=money;
             if(ids!=''){
            		$('#addCar').modal('show');
//            	 $scope.isShow=true;
           }else {
               alert('请先勾选后再点击收款!');
               return false;
           }
        }

        //收款
        $scope.enterAdd= function () {
//        	 ids=ids.substr(0,ids.length-1);
            var opts = angular.extend({}, $scope.addModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.clearType= $scope.addModel.clearType.id;
            opts.taskIds=$scope.taskIds;
            opts.money= $scope.addModel.collectMoney;
       	  var promise = personClearing.receiptOrder('/personalOrder/confirmBalance', {
                 param: {
                     query: opts
                 }
             }
         );
       	  promise.then(function(data){
         		if(data.status.code != "0000"){
         			alert(data.status.msg);

         		}else{
         			$('#addCar').modal('hide');
         			alert(data.status.msg);
         			get();

       		       // $("#orderLogModal,.modal-backdrop.in").hide();
         		}
         	})
        }
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
    }])
});