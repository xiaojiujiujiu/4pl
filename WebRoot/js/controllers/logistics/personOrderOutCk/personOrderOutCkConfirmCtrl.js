
'use strict';
define(['../../../app', '../../../services/logistics/personOrderOutCk/personOrderOutCkConfirmService'], function (app) {
     var app = angular.module('app');
    app.controller('personOrderOutCkConfirmCtrl', ['$rootScope','$scope', '$state', '$sce','$window', 'personOrderOutCkConfirm', function ($rootScope,$scope, $state, $sce,$window, personOrderOutCkConfirm) {
        //$scope.taskId = '';
        // query moudle setting
        $scope.querySeting = {
                items: [{
                    type: 'text',
                    model: 'boxNo',
                    title: '条码',
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
                        id: -1
                    },
                    select2: {
                        data: [{id:-1,name:'请选择'}],
                        id: -1,
                        change: function () {}
                    }
                }
            };

        //table头
        $scope.thHeader = personOrderOutCkConfirm.getThead();

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
        $scope.ifWlFlag=true;
        var pmsSearch = personOrderOutCkConfirm.getSearch();
        pmsSearch.then(function(data) {

            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.orderLogModal=data.query;
            $scope.orderLogModal.distributionWay.id="4";
            $scope.orderLogModal.opUser.id=-1;
            $scope.orderLogModal.opLicenseNumber.id=-1;
            $scope.orderLogModal.thirdpartyWl='';
            $scope.orderLogModal.thirdpartyTaskId='';
            $scope.orderLogModal.thirdpartyPay='';
            $scope.orderLogModal.receiver=0;
            $scope.pageModel.distributionSelect.select1.data = data.query.wlDeptId;
           $scope.pageModel.distributionSelect.select1.id=data.query.manageRange;
            $scope.pageModel.distributionSelect.select2.id="-1";
            $scope.pageModel.distributionSelect.select2.data = data.query.cdcId;
           $rootScope.manageRange=data.query.manageRange;
            if(data.query.wlFlag===1){
                $scope.ifWlFlag=true;
            }else if(data.query.wlFlag===2){
                $scope.ifWlFlag=false;
            }
        }, function(error) {
            console.log(error)
        });
        //查询
        $scope.searchClick = function () {
        	 //var reg = new RegExp("^[0-9+\-\a-zA-Z]*$");
         	//if(!reg.test($scope.taskId)){
         	//	  alert("请输入正确的业务单号！")
           	//	return false;
         	//}
            get();
            $scope.searchModel.boxNo="";
        }
        $scope.result=[];
        $scope.list =[];
        var output = [], k = [];

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
            var opts ={};
            opts.boxNo=$scope.searchModel.boxNo;
            var promise = personOrderOutCkConfirm.getDataTable({
                param: {query:opts}
            });
            promise.then(function(data) {
                angular.forEach(data.grid, function (item) {
                    var key = item['taskId'];
                    if(k.indexOf(key) ==-1){
                        k.push(key);
                        output.push(item);
                    }else{
                        var thisIndex=$scope.getIndexWithArr(k,key);
                        k.splice(thisIndex,1,key);
                        output.splice(thisIndex,1,item);
                    }
                });
                $scope.result=output;
                $scope.list=$scope.result;

            }, function(error) {
                console.log(error);
            });
            if(!!$rootScope.manageRange){
                $scope.getDistributionSelect($rootScope.manageRange);
            }
        }
        //编辑输入框显示隐藏
        $scope.isShow=false;
        $scope.toggleInput=function(){
            if($scope.orderLogModal.distributionWay.id==="4"){
                $scope.isShow=!$scope.isShow;
            }else if($scope.orderLogModal.distributionWay.id==="1"){
                $scope.isShow=!$scope.isShow;
            }
        }
        $scope.cancel=function(){
            $scope.orderLogModal.distributionWay.id="4";
            $scope.isShow=false;
        }
        $scope.receiverTypeChange=function(){
            if($scope.orderLogModal.receiver==0){
                $scope.isHide=false;
            }else {
                $scope.isHide=true;
            }
        }
        $scope.btnDistribution= function () {
            var tasktds=[];
            if($scope.result.length>0){
	            angular.forEach($scope.result, function (item) {
	                    //if(item.acceGoodCount===item.realcount){
                         //   $("#confirmModal").modal("show");
	                    //}else {
                         //   tasktds.push(item.taskId);
                         //   tasktds.toString();
                         //   alert("【"+tasktds+"】实出件数与应出件数不符，是否确认出库？",function(){
                         //       $("#confirmModal").modal("show");
                         //   })
	                    //}
                    if(item.acceGoodCount!=item.realcount){
                        tasktds.push(item.taskId);
                        tasktds.toString();
                    }
	            });
                if(tasktds.length<=0){
                    $("#confirmModal").modal("show");
                }else {
                    alert("【"+tasktds+"】实出件数与应出件数不符，是否确认出库？",function(){
                       $("#confirmModal").modal("show");
                   })
                }
            }else {
                alert("本界面无业务单，请扫描业务单或箱单！");
            }
        }
        //根据wlDeptId，获取CDC
        $scope.getDistributionSelect = function (ckId) {    //wlDeptId 之前是 rdcId
            personOrderOutCkConfirm.getDataTable({param: {query: {wlDeptId: ckId}}},'/personalOrder/getConfirmOutCdc' ).then(function (data) {
                    $scope.pageModel.distributionSelect.select2.data = data.query.cdcId;
                    $scope.pageModel.distributionSelect.select2.id = data.query.cdcId[0].id;
            })
        }
        //确认出库
        $scope.enterAddCarrier=function(){
            if($scope.orderLogModal.distributionWay.id==="1"){
                if($scope.orderLogModal.thirdpartyWl==''){
                    alert("请输入第三方物流！");
                    return false;
                }else if($scope.orderLogModal.thirdpartyTaskId==''){
                    alert("请输入第三方单号! ");
                    return false;
                }else if($scope.orderLogModal.thirdpartyPay==''){
                    alert("请输入第三方运费! ");
                    return false;
                }
                if($scope.orderLogModal.receiver==0){
                    //if($scope.pageModel.distributionSelect.select1.id==null){
                    //    alert("请选择目的地！");
                    //    return false;
                    //}
                    if( $scope.storageSelectedRDC === '-1'){
                        alert("请选择目的地！");
                        return false;
                    }
                }
            }else if($scope.orderLogModal.distributionWay.id==="4"){
                if( $scope.orderLogModal.opUser.id===-1){
                    alert("请选择配送员！");
                    return false;
                }else if( $scope.orderLogModal.opLicenseNumber.id===-1){
                    alert("请选择车牌号！");
                    return false;
                }
            }
            var opts=$scope.list;
            var promise = personOrderOutCkConfirm.deliverOrderConfrim('/personalOrder/OrderconfirmOutCk', {
                    param: {
                        query: {
                            list:opts,
                            wlDeptId: $scope.pageModel.distributionSelect.select1.id,
                            wldept: $scope.pageModel.distributionSelect.select2.id,
                            distributionWay:$scope.orderLogModal.distributionWay.id,
                            opUser:$scope.orderLogModal.opUser.id,
                            opLicenseNumber:$scope.orderLogModal.opLicenseNumber.id,
                            thirdpartyWl:$scope.orderLogModal.thirdpartyWl,
                            thirdpartyTaskId:$scope.orderLogModal.thirdpartyTaskId,
                            thirdpartyPay:$scope.orderLogModal.thirdpartyPay,
                            receiver:$scope.orderLogModal.receiver,
                            logisticsMode:2
                        }
                    }
                }
            );
            promise.then(function(data){
                if(data.status.code==="0000"){
                    alert('出库成功！分拨出库单号为：'+data.banner.shipmentTaskId+'是否确认打印？',function(){
                        $window.open('../print/personOrderOutCkPrint.html?tokenId=' + $rootScope.userInfo.token + '&sessionid=' + $rootScope.userInfo.sessionId + '&shipmentTaskId=' + data.banner.shipmentTaskId);
                    });
                    $("#confirmModal").modal("hide");
                    $scope.result=[];
                }
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
            personOrderOutCkConfirm.deliverOrderConfrim('/personalOrder/deletePrintByTaskId',{
                param: {
                    query: {
                        taskId:item.taskId
                    }
                }
            }).then(function(data){
                if(data.status.code=="0000"){
                    alert(data.status.msg);
                    $scope.result.splice(index,1);
                    k.splice(index,1);
                    //get();
                }
            })
        }
    }])
});