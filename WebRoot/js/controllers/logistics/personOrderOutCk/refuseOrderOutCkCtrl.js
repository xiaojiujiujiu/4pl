/**
 *
 * @authors Hui Sun
 * @date    2015-12-11
 * @version $Id$
 */
'use strict';
define(['../../../app', '../../../services/logistics/personOrderOutCk/refuseOrderOutCkService', '../../../services/addressLinkageService'], function (app) {
     var app = angular.module('app');
    app.controller('refuseOrderOutCkCtrl', ['$rootScope','$scope', '$state', '$sce','$window', 'refuseOrderOutCk','addressLinkage', function ($rootScope,$scope, $state, $sce,$window, refuseOrderOutCk,addressLinkage) {
        $scope.taskId = '';
        // query moudle setting
        $scope.querySeting = {
                items: [{
                    type: 'text',
                    model: 'taskId',
                    title: '业务单号'
                }, {
                    type: 'date',
                    model: ['startTime', 'endTime'],
                    title: '订单时间'
                }, {
                    type: 'address',
                    model: 'addressModel',
                    title: '区域选择'
                } ],
                btns: [{
                    text: $sce.trustAsHtml('查询'),
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
        $scope.thHeader = refuseOrderOutCk.getThead();
        $('select').on('click', function () {
            $('[disabled].form-control, fieldset[disabled] .form-control').css('cursor', 'default');
        }).on('change', function () {
            $('[disabled].form-control, fieldset[disabled] .form-control').css('cursor', 'not-allowed');
        }).on('blur', function () {
            $('[disabled].form-control, fieldset[disabled] .form-control').css('cursor', 'not-allowed');
        })
        //获取省
        addressLinkage.getProvince({"param": {"query": {"isAllFlag": 2, "parentId": 0}}})
            .then(function (data) {
                $scope.addressModel.province = data.query.areaInfo;
            }, function (error) {
                console.log(error);
            });
        //省 选择事件
        var provinceChange = function (call) {
            var opt = {
                    query: {parentId: this.provinceSelected}
                },
                _this = this;
            //获取市
            addressLinkage.getCity({param: opt})
                .then(function (data) {
                    _this.city = data.query.city;
                    if (!(call instanceof Function))
                        _this.citySelected = '-1';
                    else
                        call();
                }, function (error) {
                    console.log(error)
                });
            //初始化区
            if (this.county) {
                this.county = [{id: '-1', name: '请选择'}];
                this.countySelected = '-1';
            }
        }
        //市 选择事件
        var cityChange = function (call) {
            var opt = {
                    query: {parentId: this.citySelected}
                },
                _this = this;
            //获取市
            addressLinkage.getCounty({param: opt})
                .then(function (data) {
                    if (_this.county){
                        _this.county = data.query.city;
                    }
                    else {
                        angular.forEach(data.query.city, function (item, i) {
                            if (item.id == '-1') {
                                data.query.city.splice(i, 1);
                                return false;
                            }
                        })
                        _this.countyCheckbox = data.query.city;
                    }
                    if (!(call instanceof Function))
                        _this.countySelected = '-1';
                    else
                        call();
                }, function (error) {
                    console.log(error)
                });
        }
        //地址联动model
        $scope.addressModel = {
            province: [{id: -1, name: '全部'}],
            provinceSelected: -1,
            city: [{id: '-1', name: '全部'}],
            citySelected: '-1',
            county: [{id: '-1', name: '全部'}],
            countySelected: '-1',
            provinceChange: provinceChange,
            cityChange: cityChange
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
        var pmsSearch = refuseOrderOutCk.getSearch();
        pmsSearch.then(function(data) {

            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.pageModel.distributionSelect.select1.data = data.query.wlDeptId;
            //获取table数据
            get();
        }, function(error) {
            console.log(error)
        });
        //查询
        $scope.searchClick = function () {
        	 var reg = new RegExp("^[0-9+\-\a-zA-Z]*$");
         	if(!reg.test($scope.taskId)){
         		  alert("请输入正确的业务单号！")
           		return false;
         	}
        	
        		get();
        	
            
        }
        $scope.result=[];
        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.citySelected=$scope.addressModel.citySelected;
            opts.countySelected=$scope.addressModel.countySelected;
            opts.provinceSelected=$scope.addressModel.provinceSelected;
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = refuseOrderOutCk.getDataTable({
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
        $scope.btnDistribution= function () {
        	if($scope.pageModel.distributionSelect.select1.id==null){
        		alert("请选择目的地！");
        		return false;
        	}
        	  var ids='';
              angular.forEach($scope.result, function (item) {
                  if (item.pl4GridCheckbox.checked) {
                      ids+=item.taskId+',';
                  }
              });
              if(ids!=''){
       	 if(confirm('确定出库吗?')){
             
             
             	  ids=ids.substr(0,ids.length-1);
             	  var promise = refuseOrderOutCk.deliverOrderConfrim('/personalOrder/confirmQueryRefuseOutGoods', {
                       param: {
                           query: {
                 				taskIds:ids,
                 				wlDeptId: $scope.pageModel.distributionSelect.select1.id
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
            	  alert('请勾选后再进行出库!');
                  return false;
              }
       }
        //分页跳转回调
        $scope.goToPage = function () {
            get();
        }
        //打印
    }])
});