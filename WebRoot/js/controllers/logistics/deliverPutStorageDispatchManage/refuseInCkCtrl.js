/**
 * Created by hui.sun on 15/12/13.
 */
'use strict';
define(['../../../app', '../../../services/logistics/deliverPutStorageDispatchManage/refuseInCkService'], function(app) {
     var app = angular.module('app');
    app.controller('refuseInCkCtrl', ['$scope', '$state', '$sce', 'refuseInCk', function($scope, $state, $sce, refuseInCk) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            }, {
                type: 'text',
                model: 'chuHuoName',
                title: '发件人名称'
            }, {
                type: 'text',
                model: 'chuTel',
                title: '发件人电话'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '订单时间'
            } ],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = refuseInCk.getThead();
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
        var pmsSearch = refuseInCk.getSearch();
        pmsSearch.then(function(data) {

            $scope.searchModel = data.query; //设置当前作用域的查询对象
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

        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = refuseInCk.getDataTable({
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
        $scope.confirmInCk= function () {
        	  var ids='';
              angular.forEach($scope.result, function (item) {
                  if (item.pl4GridCheckbox.checked) {
                      ids+=item.taskId+',';
                  }
              });
              if(ids!=''){
            if(confirm('确定入库吗?')){
              

              	  ids=ids.substr(0,ids.length-1);
              	  var promise = refuseInCk.deliverOrderConfrim('/personalOrder/confirmRefuseInGoods', {
                        param: {
                            query: {
                  				taskIds:ids
                            }
                        }
                    }
                );
              	  promise.then(function(data){
                		if(data.status.code != "0000"){
                			alert(data.status.msg);
                			
                		}else{
                			alert(data.status.msg);
                			get();
                			
              		       // $("#orderLogModal,.modal-backdrop.in").hide();
                		}
                		 $scope.isShow=false;
           		        $scope.isShow1=false;
           		        $scope.isShow2=false;
                	})
              }
            }else {
                alert('请勾选后再进行入库!');
                return false;
            }
        }
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
    }])
});