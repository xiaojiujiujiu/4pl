/**
 * Created by xuwusheng on 15/12/18.
 */
define([ '../../../app','../../../services/platform/deliverFee-set/provincesAndCitiesSetService' ],function(app) {
			 var app = angular.module('app');
	app.controller('provincesAndCitiesSetCtrl',['$rootScope','$scope','$state','$sce','$filter','HOST','$window','provincesAndCitiesSet',

				function($rootScope, $scope, $state, $sce,$filter, HOST, $window,provincesAndCitiesSet) {
					// table头
					$scope.thHeader = provincesAndCitiesSet.getThead();

					// 分页下拉框
					$scope.pagingSelect = [ {
						value : 5,
						text : 5
					}, {
						value : 10,
						text : 10,
						selected : true
					}, {
						value : 20,
						text : 20
					}, {
						value : 30,
						text : 30
					}, {
						value : 50,
						text : 50
					} ];

					// 分页对象
					$scope.paging = {
						totalPage : 1,
						currentPage : 1,
						showRows : 10,
					};

					// 查询
					$scope.searchClick = function() {
						$scope.paging = {
							totalPage : 1,
							currentPage : 1,
							showRows : $scope.paging.showRows
						};
						get();
					}
					$scope.exParams = '';
					//获取对象
					function get() {
						// 获取选中 设置对象参数
						var opts = angular.extend({},
							$scope.searchModel, {}); // 克隆出新的对象，防止影响scope中的对象
						opts.pageNo = $scope.paging.currentPage;
						opts.pageSize = $scope.paging.showRows;
						opts.feeType=3;
						$scope.exParams = $filter('json')({
							query : opts
						});
						var promise = provincesAndCitiesSet.getDataTable('/deliverFee/queryDeliverFeeList',
							{param : {query : opts}});
						promise.then(
							function(data) {
								if (data.code == -1) {
									alert(data.message);
									// $scope.result
									// = [];
									$scope.paging = {
										totalPage : 1,
										currentPage : 1,
										showRows : $scope.paging.showRows,
									};
									return false;
								}

								$scope.result = data.grid;

								$scope.paging = {
									totalPage : data.total,
									currentPage : $scope.paging.currentPage,
									showRows : $scope.paging.showRows,
								};
								// $scope.paging.totalPage
								// = data.total;
							},
							function(error) {
								console.log(error);
							});
					}
					get();
					// 分页跳转回调
					$scope.goToPage = function() {
						get();
					}
					//初始化实体对象
					function cleanRuleModel(){
						// 规则实体
						$scope.ruleModel = {
							id:0,
							depProvince : '',
							depCity : '',
							depArea : '',
							firstHeavy : '',
							firstHeavyPrice :'',
							continuedHeavyPrice :'',
							length :'',
							width :'',
							height :'',
							volume :'',
							volumePrice :'',
							overVolumePrice :'',
							feeType:0
						}
						// 省内容
						$scope.depProvince = {
							id : -1,
							select : []
						}
						// 市内容
						$scope.depCity = {
							id : -1,
							select : []
						}
						// 区内容
						$scope.depArea = {
							id : -1,
							select : []
						}
						//初始化市
						result = [];
						num;
						cityStr = '';
						$scope.city = '';
						//初始化区
						result2 = [];
						num2;
						areaStr = '';
						$scope.area = '';
					}


					//获取省数据
					function getProvince(item){

						// 获取选中 设置对象参数
						var opts = angular.extend({},$scope.searchModel, {}); // 克隆出新的对象，防止影响scope中的对象
						opts.isAllFlag=2;
						opts.parentId=0;
						$scope.exParams = $filter('json')({
							query : opts
						});
						var promise = provincesAndCitiesSet.getDataTable(
							'/areaInfo/getAreaInfoList',
							{param : {query : opts}});
						promise.then(function(data) {
								if (data.code == -1) {
									alert(data.message);
									return false;
								}
								$scope.depProvince.select=data.query.areaInfo;
								if(item!=null){
									angular.forEach($scope.depProvince.select, function (dp) {
										if(dp.name==item.depProvince){
											$scope.ruleModel.depProvince=dp.id;
											getCity(dp.id,item);
										}
									});



								}else{
									angular.forEach($scope.depProvince.select, function (dp) {
										if(dp.name=='全部'){
											$scope.ruleModel.depProvince=dp.id;

										}
									});
								}
							},
							function(error) {
								console.log(error);
							});
					}
					var result = [];
					var num;
					var cityStr = '';
					$scope.city = '';
					//获取市数据
					function getCity(parentId,item){
						// 获取选中 设置对象参数
						var opts = angular.extend({},$scope.searchModel, {}); // 克隆出新的对象，防止影响scope中的对象
						opts.parentId=parentId;
						$scope.exParams = $filter('json')({
							query : opts
						});
						var promise = provincesAndCitiesSet.getDataTable('/areaInfo/getAreaInfoList',
							{param : {query : opts}
							});
						promise.then(function(data) {
								if (data.code == -1) {
									alert(data.message);
									return false;
								}
								$scope.depCity.select=[];
								angular.forEach(data.query.areaInfo, function (dc) {
									$scope.depCity.select.push({id:dc.id,name:dc.name,checked:false});
								})
								// 区内容
								$scope.depArea = {
									id : -1,
									select : []
								}
								if(item!=null){

									if($scope.depCity.select!=null && $scope.depCity.select.length>0){
										var array1=item.depCity.split(',');
										angular.forEach($scope.depCity.select, function (dc) {
											angular.forEach(array1, function (arr) {
												if(dc.name==arr){

													dc.checked=true;
													if(result.indexOf(arr)==-1){
														result.push(dc.name);
														getArea(dc.id,item);
													}


												}
											})
										})
									}
									cityStr = result.join(',');
									$scope.city = cityStr;
								}
							},
							function(error) {
								console.log(error);
							});
					}
					//删除区域
					function removeArea(parentId){
						// 获取选中 设置对象参数
						var opts = angular.extend({},$scope.searchModel, {}); // 克隆出新的对象，防止影响scope中的对象
						opts.parentId=parentId;
						$scope.exParams = $filter('json')({
							query : opts
						});
						var promise = provincesAndCitiesSet.getDataTable('/areaInfo/getAreaInfoList',
							{param : {query : opts}
							});
						promise.then(function(data) {
								if (data.code == -1) {
									alert(data.message);
									return false;
								}
								var arr1=$scope.depArea.select;
								var arr2=data.query.areaInfo;
								for(var i=0;i<arr1.length;i++){
									for(var j=0;j<arr2.length;j++){
										if(arr1[i]!=null &&  arr2[j] !=null && arr1[i].id==arr2[j].id){
											arr1.splice(i--,1);
											//console.log("遍历。。。。。"+arr2[j].name);
											if((num2 = result2.indexOf(arr2[j].name))>-1){
												result2.splice(num2, 1);
												//console.log("删除文本框后。。。。"+result2);
											}

										}
									}
								}
								areaStr = result2.join(',');
								$scope.area = areaStr;



							},
							function(error) {
								console.log(error);
							});
					}
					//获取区内容
					var result2 = [];
					var num2;
					var areaStr = '';
					$scope.area = '';
					function getArea(parentId,item){

						// 获取选中 设置对象参数
						var opts = angular.extend({},$scope.searchModel, {}); // 克隆出新的对象，防止影响scope中的对象
						opts.parentId=parentId;
						$scope.exParams = $filter('json')({
							query : opts
						});
						var promise = provincesAndCitiesSet.getDataTable('/areaInfo/getAreaInfoList',
							{param : {query : opts}
							});
						promise.then(function(data) {
								if (data.code == -1) {
									alert(data.message);
									return false;
								}
								angular.forEach(data.query.areaInfo, function (dc) {
									$scope.depArea.select.push({id:dc.id,name:dc.name,checked:false});
								})
								if(item!=null){
									if($scope.depArea.select!=null&&$scope.depArea.select.length>0){
										var array2=item.depArea.split(',');

										angular.forEach($scope.depArea.select, function (dc) {
											angular.forEach(array2, function (arr) {

												if(dc.name==arr){
													if(result2.indexOf(arr)==-1){
														result2.push(arr);
														dc.checked=true;
													}

												}

											})
										})

									}
									areaStr = result2.join(',');
									$scope.area = areaStr;
								}
							},
							function(error) {
								console.log(error);
							});
					}

					$scope.cutZero=function(num){
						var arr=num.split('');
						var startPos=0;
						var flag=true;
						for(var i=0;i<arr.length;i++) {
							if (arr[i] == '0' && flag) {
								startPos = i;
								flag = false;
							} else if (arr[i] != '0' && arr[i] != '.') {
								startPos = -1;
								flag = true;
							}
						}

						if(!flag){
							arr.splice(startPos,arr.length-startPos);
						}
						if(arr.length == 0){
							return '0';
						}
						if(arr[arr.length-1] === '.'){
							arr.splice(arr.length-1,1);
						}
						return arr.join('');
					}
					// 计算体积
					$scope.getVolume = function() {
						var num=parseFloat($scope.ruleModel.length)
							* parseFloat($scope.ruleModel.width)
							* parseFloat($scope.ruleModel.height);
						if(!isNaN(num)){
							//var numNew=(num/1000000).toFixed(1);
							//var smNew=numNew.split('.')[1];
							//var numNew=num==0?parseInt(num):num;
							//numNew/=1000000;
							//console.log((num/1000000));
							var numNew=(num/1000000).toFixed(6);
							numNew=$scope.cutZero(numNew);
							$scope.ruleModel.volume =numNew;
						}else{
							$scope.ruleModel.volume=0;
						}
					}


					// 添加规则按钮
					$scope.addStationClick = function() {
						cleanRuleModel();
						$scope.stationTitle = '区域规则设置';
						$('#addStation').modal();
						getProvince();


					}

					//根据省联动市
					$scope.changeCity=function(){
						getCity($scope.ruleModel.depProvince);
						result = [];
						result2 = [];
						$scope.city="";
						$scope.area="";
					}
					//市的显示隐藏
					$scope.cityShow={show: false};
					$scope.toggleCity=function(){
						$scope.cityShow.show=!$scope.cityShow.show;
					}
					$scope.multipleAddConfirm=function(){
						$scope.cityShow={show: false};
						return
					}
					//区的显示隐藏
					$scope.areaShow={show: false};
					$scope.toggleArea=function(){
						$scope.areaShow.show=!$scope.areaShow.show;
					}
					$scope.depAreaAddConfirm=function(){
						$scope.areaShow={show: false};
						return
					}
					$scope.closeCityCheck= function (e) {
						if(!$(e.target).hasClass('des-province')&&!$(e.target).hasClass('des-province-check')){
							$scope.cityShow.show=false;
						}
						if(!$(e.target).hasClass('des-province2')&&!$(e.target).hasClass('des-province-check2')) {
							$scope.areaShow.show = false;
						}
					}
					//区点击添加
					$scope.addArea=function(obj){
						obj.checked=!obj.checked;
						if(obj.checked){
							result2.push(obj.name);
						}else{
							num2 = result2.indexOf(obj.name);
							result2.splice(num2, 1);
						}
						areaStr = result2.join(',');
						$scope.area = areaStr;

					}
					//判断是否是整数
					/*$scope.invNumber=function(){
						if(parseInt($scope.ruleModel.firstHeavy)!=$scope.ruleModel.firstHeavy){
							alert("只能输入整数");
							return false;
						}
					}*/
					//根据市联动区域

					$scope.changeArea=function(obj){
						obj.checked=!obj.checked;
						if(obj.checked){
							result.push(obj.name);
							getArea(obj.id);
						}else{
							num = result.indexOf(obj.name);
							result.splice(num, 1);
							removeArea(obj.id);
							//num2 = result2.indexOf(obj.name);
							//result2.splice(num2, 1);
						}
						cityStr = result.join(',');
						//console.log(cityStr);
						$scope.city = cityStr;
						//areaStr = result2.join(',');
						//$scope.area = areaStr;

					}

					////改变选中状态
					//$scope.changeClick=function(obj){
					//
					//	obj.checked=!obj.checked;
					//	//console.log(obj.checked);
					//}
					// 添加规则或者修改规则 确认
					$scope.enterAddStation = function() {
						if($scope.ruleModel.depProvince==-1){
							alert("请选择省份！");
							return
						}
						//if($scope.city==""){
						//	alert("请选择市！");
						//	return
						//}
						$scope.ruleModel.feeType=3;
						$scope.ruleModel.depCity='';

						angular.forEach($scope.depCity.select, function (city) {
							if(city.checked){
								$scope.ruleModel.depCity+=city.id+',';
							}
						});
						if($scope.ruleModel.depCity!=''){
							$scope.ruleModel.depCity=$scope.ruleModel.depCity.substr(0,$scope.ruleModel.depCity.length-1);
						}
						$scope.ruleModel.depArea='';
						angular.forEach($scope.depArea.select, function (area) {
							if(area.checked){
								$scope.ruleModel.depArea+=area.id+',';
							}
						});
						if($scope.ruleModel.depArea!=''){
							$scope.ruleModel.depArea=$scope.ruleModel.depArea.substr(0,$scope.ruleModel.depArea.length-1);
						}



						var url=$scope.stationTitle == '区域规则设置'?'/deliverFee/insertDeliverFee'
							:'/deliverFee/updateDeliverFee';

						provincesAndCitiesSet.getDataTable(
							url,
							{param : {
								query : $scope.ruleModel
							}
							}).then(
							function(data) {
								alert(data.status.msg);
								if (data.status.code == "0000") {
									get();
									$('#addStation').modal('hide');
								}
							});

					}
					//初始化修改规则
					$scope.updateStation = function(i, item) {
						cleanRuleModel();

						// 获取选中 设置对象参数
						var opts = angular.extend({},$scope.searchModel, {}); // 克隆出新的对象，防止影响scope中的对象
						opts.id=item.id;
						$scope.exParams = $filter('json')({
							query : opts
						});
						var promise = provincesAndCitiesSet.getDataTable('/deliverFee/initUpdateDeliverFee',
							{param : {query : opts}
							});
						promise.then(function(data) {
								if (data.code == -1) {
									alert(data.message);
									return false;
								}

								$scope.ruleModel=data.query;
								$scope.stationTitle = '修改规则';
								$('#addStation').modal();
								getProvince(item);

							},
							function(error) {
								console.log(error);
							});


					}


				} ]);
});
