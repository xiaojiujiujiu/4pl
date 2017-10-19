/**
 * Created by xiaojiu on 2017/2/4.
 */
define(['../../../app', '../../../services/storage/storage-permissionManage/barcodeInformationService'], function (app) {
    var app = angular.module('app');
    app.controller('barcodeInformationCtrl', ['$scope', '$sce','$rootScope','$state', '$stateParams', 'barcodeInformation','$window', function ($scope, $sce,$rootScope,$state, $stateParams, barcodeInformation,$window) {
        $scope.navShow = true;
        $scope.pageModel = {
            vmiSelect: {
                select2: {
                    data: [{id:-1,name:'全部'},{id:9,name:'空闲'},{id:19,name:'使用中'},{id:13,name:'冻结'}],
                    id: -1,
                    change: function () {

                    }
                }
            },
            taskIds: {
                taskId: '',
                fbTaskId:''
            }
        };
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
        //分页对象1
        $scope.paging1 = {
            totalPage: 1,
            currentPage: 1,
            showRows: 20,
        };
        //分页对象2
        $scope.paging2 = {
            totalPage: 1,
            currentPage: 1,
            showRows: 20,
        };
        var assignFlag = 1;
        $scope.gridThHeader1 = barcodeInformation.getThead1();
        $scope.navClick = function (i) {
            $scope.pageModel = {
                vmiSelect: {
                    select2: {
                        data: [{id:-1,name:'全部'},{id:9,name:'空闲'},{id:19,name:'使用中'},{id:13,name:'冻结'}],
                        id: -1,
                        change: function () {

                        }
                    }
                },
                taskIds: {
                    taskId: '',
                    fbTaskId:''
                }
            };
            $scope.pageModel.vmiSelect.select2.id = -1;
            $scope.pageModel.vmiSelect.select2.data = [{id:-1,name:'全部'}];
            if (i == 0) {
                assignFlag = 1;
                $scope.navShow = true;
                $scope.gridThHeader1 = barcodeInformation.getThead1();
            } else {
                assignFlag = 2;
                $scope.navShow = false;
                $scope.gridThHeader2 = barcodeInformation.getThead2();
            }
            getGrid(i);
        }
        //查询
        $scope.btnClick = function (i) {
            $scope['paging'+(i+1)] = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope['paging'+(i+1)].showRows
            };
            getGrid(i);
        }
        //$scope.gridResult1Paging={
        //    pageNo:1,
        //    pageSize:20
        //}
        function getGrid(i) {
            var opt = {};
            if (i == 0) {
                opt = {
                    page: $scope.paging1.currentPage,
                    pageSize: $scope.paging1.showRows,
                   sku:$scope.pageModel.sku,
                   serialNumber:$scope.pageModel.serialNumber,
                   goodsStyle:$scope.pageModel.goodsStyle
                },
                    barcodeInformation.getDataTable({
                            param: {
                                query:opt
                            }
                        }, '/ckBaseMessage/queryCkBaseMessageList')
                        .then(function (data) {
                            //if (data.status.code == "1000") {
                            //    alert(data.status.msg);
                            //    $scope.gridResult1 = [];
                            //    $scope.paging1 = {
                            //        totalPage: 1,
                            //        currentPage: 1,
                            //        showRows: $scope.paging1.showRows,
                            //    };
                            //    return false;
                            //}
                           if(data.status.code==="0000"){
                               if(data.grid.length<=0){
                                   $scope.isData=false;
                               }else {
                                   $scope.isData=true;
                               }
                               $scope.gridResult1 = data.grid;
                               $scope.paging1 = {
                                   totalPage: data.total,
                                   currentPage: $scope.paging1.currentPage,
                                   showRows: $scope.paging1.showRows,
                               };
                           }else{
                               $scope.gridResult1=[];
                           }

                        });
            } else {
                opt = {
                    page: $scope.paging2.currentPage,
                    pageSize: $scope.paging2.showRows,
                    fbTaskId: $scope.pageModel.taskIds.fbTaskId,
                    assignFlag: assignFlag
                },
                    barcodeInformation.getDataTable({
                            param: {
                                query:opt
                            }
                        }, '/returnPickQuery/queryFinishFbTaskList')
                        .then(function (data) {

                            if (data.status.code == "1000") {
                                alert(data.status.msg);
                                $scope.gridResult2 = [];
                                $scope.paging2 = {
                                    totalPage: 1,
                                    currentPage: 1,
                                    showRows: $scope.paging2.showRows,
                                };
                                return false;
                            }
                            $scope.gridResult2 = data.grid;
                            $scope.paging2 = {
                                totalPage: data.total,
                                currentPage: $scope.paging2.currentPage,
                                showRows: $scope.paging2.showRows,
                            };

                        });
            }

        }
        //打印
        $scope.print= function (i,item) {
            if(item.barCodeType && item.barCodeType==2){
                $window.open("../print/goodsBarCode.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&customerId="+item.customerId+"&sku="+item.sku+"&suppliers="+item.suppliers);
            }else {
                $window.open("../print/goodsCode.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&id="+item.id+"&manufactureDate="+item.manufactureDate+"&expiryDate="+item.expiryDate+"&suppliers="+item.suppliers);
            }
        }

        ////冻结
        //$scope.perFreeze= function (i,item) {
        //    if(confirm('确定冻结吗?')) {
        //        barcodeInformation.getDataTable({param:{query:{id:item.id,status:0}}}, '/userInfo/lockUserInfo')
        //            .then(function (data) {
        //                if(data.status.code=="0000"){
        //                    getGrid(i);
        //                }
        //                alert(data.status.msg);
        //            });
        //    }
        //}
        ////恢复
        //$scope.perResume= function (i,item) {
        //    if(confirm('确定恢复吗?')) {
        //        barcodeInformation.getDataTable({param:{query:{id:item.id,status:2}}}, '/userInfo/lockUserInfo')
        //            .then(function (data) {
        //                if(data.status.code=="0000"){
        //                    getGrid(i);
        //                }
        //                alert(data.status.msg);
        //            });
        //    }
        //}
        //编辑
        $scope.isHi=true;
        $scope.isHide=true;
        var targetItem={};
        $scope.editDate= function (i,item) {
        	targetItem=item;
        	$scope.dateModel.item=item;
            if(item.barCodeType && item.barCodeType==2){
                $("#editGoodsCode").modal("show");
                var opt = {};
                opt.customerId = item.customerId;
                opt.sku = item.sku;
                opt.suppliers = item.suppliers;
                barcodeInformation.getDataTable({
                        param: {
                            query:opt
                        }
                    }, '/ckBaseMessage/getGoodsCode')
                    .then(function (data) {
                       if(data.status.code==="0000"){
                           $scope.dateModel.realCode=data.banner.realCode;
                       }else{
                           $scope.dateModel.realCode='';
                       }

                    });
            }else {
                $("#editDate").modal("show");
                var opt = {};
                opt = {id:item.id}
                barcodeInformation.getDataTable({
                        param: {
                            query:opt
                        }
                    }, '/ckBaseMessage/editGoodsMessageCode')
                    .then(function (data) {
                        if(data.banner.expirationDate==="1"){
                            $scope.isHide=false;
                        }else{
                            $scope.isHide=true;
                        }
                        if(data.banner.manufactureDate==="1"){
                            $scope.isHi=false;
                        }else {
                            $scope.isHi=true;
                        }
                    });
            }
        }
        //补打条码弹窗
        $scope.rePrintBarCode=function(){
            $scope.dateModel.barRealCode='';
            $("#rePrintBarCode").modal('show');
        }
        ////定义表单模型
        $scope.dateModel={
            expiryDate:'',
            manufactureDate:'',
            realCode:'',
            barRealCode:'',
            item:''
        }
        //确认
        $scope.codeAdd=function(){
            if(!!$scope.dateModel.realCode){
                console.log($scope.dateModel.realCode);
            }else {
                alert("商品条码不能为空");
                return false;
            }
            var reg=/[\u4e00-\u9fa5]/g;
            if(reg.test($scope.dateModel.realCode)){
               alert("商品条码不能为汉字");
                return false;
            }
            var opt = {};
            opt.customerId = $scope.dateModel.item.customerId;
            opt.sku = $scope.dateModel.item.sku;
            opt.suppliers = $scope.dateModel.item.suppliers;
            opt.realCode = $scope.dateModel.realCode;
            opt.goodsId = $scope.dateModel.item.goodsId;
            barcodeInformation.getDataTable({
                    param: {
                        query:opt
                    }
                }, '/ckBaseMessage/editGoodsCode')
                .then(function (data) {
                    if(data.status.code=="0000"){
                        alert(data.status.msg);
                        $("#editGoodsCode").modal("hide");
                    }
                })

        }
        //确认
        $scope.barCodeAdd=function(){
            if($scope.dateModel.barRealCode==''){
                alert("条码不能为空");
                return false;
            }
            var reg=/[\u4e00-\u9fa5]/g;
            if(reg.test($scope.dateModel.barRealCode)){
                alert("条码不能为汉字");
                return false;
            }
            $window.open("../print/goodsBarCode.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&realCode="+ $scope.dateModel.barRealCode);
        }
        //确认
        $scope.enterAdd=function(){
            var date1=$scope.dateModel.manufactureDate,date2=$scope.dateModel.expiryDate;
            //if(date1&&date2&&date1!==''&&date2!==''){
                date1=new Date(date1).getTime();
                date2=new Date(date2).getTime();
                var time = new Date().getTime();
                if(date1>time){
                    alert('生产日期需为今天或今天以前');
                    return false;
                }
                if(date2<time){
                    alert('失效日期需为今天以后');
                    return false;
                }
                if(date1>date2){
                    alert('生产日期不能大于失效日期');
                    return false;
                }
                else if(date1==date2){
                 alert('失效时期不能等于生产日期');
                 return false;
                 }
            //}
            if(!$scope.isHide){
                if($scope.dateModel.expiryDate===''){
                    alert("请输入失效日期");
                    return false;
                }
            }
            if(!$scope.isHi){
                if($scope.dateModel.manufactureDate===''){
                    alert("请输入生产日期");
                    return false;
                }
            }
            $("#editDate").modal('hide');
            angular.forEach($scope.gridResult1,function(k){
            	if(targetItem==k){
            		k.expiryDate=$scope.dateModel.expiryDate;
            		k.manufactureDate=$scope.dateModel.manufactureDate;
            		return;
            	}
            	
            })
            $scope.dateModel.expiryDate='';
            $scope.dateModel.manufactureDate='';
        }

        getGrid(0);
        $scope.goToPage = function (i) {
            getGrid(i);
        }
    }])
})