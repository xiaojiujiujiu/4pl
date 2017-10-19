/**
 * Created by hui.sun on 15/12/12.
 */
define(['../../../app','../../../services/logistics/permissionSettings/carriersManageService'], function (app) {
     var app = angular.module('app');
    app.controller('lsCarriersManageCtrl', ['$scope','$sce','carriersManage', function ($scope,$sce,carriersManage) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'carrierMan',
                title: '配送服务商联系人'
            }, {
                type: 'text',
                model: 'mobilephone',
                title: '联系人手机号'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        $scope.searchModel = {
        	carrierMan : '',
        	mobilephone: ''
        }
        //theadr
        $scope.thHeader=carriersManage.getThead();
        //查询
        $scope.searchClick= function () {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows,
            };
			get();
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
        function get() {
        	var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = carriersManage.getDataTable({
                param: {
                    query: opts
                }
            }, '/wlComp/queryWlComp');
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
        }
        get();
        $scope.goToPage= function () {
        	get();
        }
        //添加岗位
        $scope.addStationClick= function () {
            $scope.isAddStation=true;
        }
        $scope.addCarrier = {
        	carrierId: '',      // 承运商编号
        	carrierName: '',    // 承运商名称
        	carrierMan: '',     // 承运商联系人
        	mobilephone: '',    // 联系人手机号
        	carrierAddress: {	// 承运商所在地
	            province: [],
	            city: [{
	            	id: '-1', 
	            	name: '请选择'
	            }],
	            county: [{
	            	id: '-1', 
	            	name: '请选择'
	            }]
        	}, 
        	carrierRange: ''   // 承运范围
//        	mobilephone: '',	// 账号
//        	sysPassword: ''		// 密码
        }
        // 获取省
        carriersManage.getDataTable({
        	"param":{
        		"query":{
        			"isAllFlag":2,
        			"parentId":0
        		}
        	}
        }, '/areaInfo/getAreaInfoList')
        	.then(function(data){
        		$scope.addCarrier.carrierAddress.province=data.query.areaInfo;
                $scope.addCarrier.carrierAddress.provinceSelected=-1;
                $scope.addCarrier.carrierAddress.citySelected = -1;
                $scope.addCarrier.carrierAddress.countySelected = -1;
        	}, function (error) {
                console.log(error);
            })
        	
        //省 选择事件
        $scope.addCarrier.carrierAddress.provinceChange = function (call) {
            var opt = {
                query: {parentId: $scope.addCarrier.carrierAddress.provinceSelected,isAllFlag:2}
            }
            //获取市
            carriersManage.getDataTable({param:opt}, '/areaInfo/getAreaInfoList')
                .then(function (data) {
                	// console.log(data)
                    $scope.addCarrier.carrierAddress.city = data.query.areaInfo;
                    if(!(call instanceof Function))
                        $scope.addCarrier.carrierAddress.citySelected = -1;
                    else
                        call();
                }, function (error) {
                    console.log(error)
                });
            //初始化区
            $scope.addCarrier.carrierAddress.county=[{id: -1, name: '全部'}];
            $scope.addCarrier.carrierAddress.countySelected = -1;
        }
        
        //市 选择事件
        $scope.addCarrier.carrierAddress.cityChange = function (call) {
            var opt = {
                query: {parentId: $scope.addCarrier.carrierAddress.citySelected,isAllFlag:2}
            }
            //获取市
            carriersManage.getDataTable({param:opt}, '/areaInfo/getAreaInfoList')
                .then(function (data) {
                	// console.log(data)
                    $scope.addCarrier.carrierAddress.county = data.query.areaInfo;
                    if(!(call instanceof Function))
                        $scope.addCarrier.carrierAddress.countySelected = -1;
                    else
                        call();
                }, function (error) {
                    console.log(error)
                });
        }
        // 点击添加承运商按钮重置添加表单
        $scope.addCarriersBtn = function(){
        	$scope.addCarrierTitle='添加配送服务商';
        	$scope.addCarrier.carrierId = '';
        	$scope.addCarrier.carrierName = '';
        	$scope.addCarrier.carrierMan = '';
        	$scope.addCarrier.mobilephone = '';
        	$scope.addCarrier.carrierRange = '';
//        	$scope.addCarrier.sysPassword = '';
            $scope.addCarrier.carrierAddress.provinceSelected=-1;
            $scope.addCarrier.carrierAddress.city=[{id: '-1', name: '请选择'}];
            $scope.addCarrier.carrierAddress.citySelected = '-1';
            $scope.addCarrier.carrierAddress.county=[{id: '-1', name: '请选择'}];
            $scope.addCarrier.carrierAddress.countySelected = '-1';
        }

        
        $scope.addCarrierTitle='添加配送服务商';
        var customID=0;
        //修改
        $scope.updateCustom= function (i,item) {
        	//console.log(item)
            $scope.addCarrierTitle='修改配送服务商';
            $scope.addCarrier.carrierId = item.carrierId;
        	$scope.addCarrier.carrierName = item.carrierName;
        	$scope.addCarrier.carrierMan = item.carrierMan;
        	$scope.addCarrier.mobilephone = item.mobilephone;
        	if(item.carrierRange == '本市'){
        		$scope.addCarrier.carrierRange = 2
        	}else if(item.carrierRange == '本省'){
        		$scope.addCarrier.carrierRange = 1
        	}else{
        		$scope.addCarrier.carrierRange = 3
        	}
//        	$scope.addCarrier.sysPassword = item.sysPassword;
            customID=item.id;
            $scope.addCarrier.carrierAddress.provinceSelected=item.sheng;
            //触发省选择
            $scope.addCarrier.carrierAddress.provinceChange(function () {
                $scope.addCarrier.carrierAddress.citySelected = item.shi;
                //触发市
                $scope.addCarrier.carrierAddress.cityChange(function () {
                    $scope.addCarrier.carrierAddress.countySelected=item.xian;
                });
            });
        }
        $scope.removeCustom = function(index, item){
        	carriersManage.getDataTable({param:{query:{id: item.id}}}, '/wlComp/delWlComp')
				.then(function (data) {
                    alert(data.status.msg);
					get();
				}, function (error) {
				    console.log(error)
				});
        }
        //冻结
        $scope.cmFreeze= function (i,item) {
            if(confirm('确定冻结吗?')){
                carriersManage.getDataTable({param:{query:{id: item.id}}}, '/wlComp/lockWlComp')
                    .then(function (data) {
                        alert(data.status.msg);
                        if(data.status.code=="0000")
                            get();
                    }, function (error) {
                        console.log(error)
                    });
            }
        }
        //恢复
        $scope.cmResume= function (i,item) {
            if(confirm('确定恢复吗?')){
                carriersManage.getDataTable({param:{query:{id: item.id}}}, '/wlComp/unlockWlComp')
                    .then(function (data) {
                        alert(data.status.msg);
                        if(data.status.code=="0000")
                            get();
                    }, function (error) {
                        console.log(error)
                    });
            }
        }
        // 手机号码验证
        	function validateMobile (mobile, str){
				var myreg = /^1[34578][0-9]{9}$/;
				if(mobile.length != 11){
					// alert(str);
					return false;
				}else if(!myreg.test(mobile)){
					//	alert(str);
					return false;
				}else{
					return true;
				}
			};
        // 确认添加
        $scope.enterAddCarrier = function(){
            var provinceSelectedId=parseInt($scope.addCarrier.carrierAddress.provinceSelected);
            // console.log($scope.addCarrier);
            if($scope.addCarrier.carrierName == ''){
                alert('请添加配送服务商名称！');
                return false;
            }else if($scope.addCarrier.carrierId == '' || $scope.addCarrier.carrierId == 0){
                alert('请添加配送服务商编号！');
                return false;
            }else if($scope.addCarrier.carrierMan == ''){
                alert('请添加配送服务商联系人！');
                return false;
            }else if($scope.addCarrier.mobilephone == ''){
                alert('请添加联系人手机号！');
                return false;
            }else if($scope.addCarrier.carrierAddress.provinceSelected == -1){
                alert('请选择省！');
                return false;
            }else if($scope.addCarrier.carrierAddress.citySelected == -1){
                alert('请选择市！');
                return false;
                //台湾.香港.澳门carrierAddress
            }
            //else if( ($scope.addCarrier.carrierAddress.countySelected == -1 ) && (provinceSelectedId!=420000&&provinceSelectedId!=430000&&provinceSelectedId!=440000)){
            //           alert('请选择区县!');
            //}
            if($scope.addCarrier.carrierAddress.county.length>1){
                if($scope.addCarrier.carrierAddress.countySelected == -1){
                    alert('请选择区县!');
                    return false;
                }
            }
            if ($scope.addCarrier.carrierRange == ''){
                alert('请添加配送范围！');
                return false;
            }else if(!validateMobile($scope.addCarrier.mobilephone)){
                alert('请填写正确的手机号码');
                return false;
            }else if(isNaN($scope.addCarrier.carrierId)){
                alert('请填写正确的配送服务商编号！');
                return false;
            }
         
            var opts = {
                carrierId: parseInt($scope.addCarrier.carrierId),
                carrierName: $scope.addCarrier.carrierName,
                carrierMan: $scope.addCarrier.carrierMan,
                mobilephone: $scope.addCarrier.mobilephone,
                carrierRange: parseInt($scope.addCarrier.carrierRange),
                sheng: $scope.addCarrier.carrierAddress.provinceSelected,
                shi: $scope.addCarrier.carrierAddress.citySelected,
                xian: $scope.addCarrier.carrierAddress.countySelected
            };
            if($scope.addCarrierTitle == '修改配送服务商'){
                opts['id'] = customID;
            }
            /*return;*/
            carriersManage.getDataTable({param:{grid:[opts]}}, $scope.addCarrierTitle=='添加配送服务商'?'/wlComp/saveWlComp':'/wlComp/updateWlComp')
                .then(function (data) {
                    alert(data.status.msg)
                    if(data.status.code == "0000"){
                        $('#orderLogModal').modal('hide');
                        get();
                    }
                }, function (error) {
                    console.log(error)
                });
        };
    }]);
});