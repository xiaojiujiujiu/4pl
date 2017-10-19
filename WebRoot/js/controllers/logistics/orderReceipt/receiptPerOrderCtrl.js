/**
 * Created by hui.sun on 15/12/13.
 */
'use strict';
define(['../../../app', '../../../services/logistics/orderReceipt/receiptPerOrderService'], function(app) {
     var app = angular.module('app');
    app.controller('receiptPerOrderCtrl', ['$rootScope','$scope', '$state', '$sce', 'receiptPerOrder', function($rootScope,$scope, $state, $sce, receiptPerOrder) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'select',
                model: 'opUser',
                selectedModel:'opUserSelect',
                title: '配送员'
            },{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
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
        $scope.thHeader = receiptPerOrder.getThead();

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
        var pmsSearch = receiptPerOrder.getSearch();
        pmsSearch.then(function(data) {

            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.opUserSelect=-1;
            $scope.newCar.refuseReasonModel=-1;
            $scope.newCar.paySideModel=-1;
            $scope.newCar.payTypeModel=-1;
            $scope.newCar.refuseReason=data.query.refuseReason;
            $scope.newCar.paySide=data.query.paySide;
            $scope.newCar.payType=data.query.payType;
            //获取table数据
            get();
        }, function(error) {
            console.log(error)
        });
        //拒收model
        $scope.newCar={
            refuseReason:null,
            payType:null,
            paySide:null,
            refuseReasonModel:-1,
            paySideModel:-1,
            payTypeModel:-1,
            remarks:'',
            returnNumber:''
        };

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
            var promise = receiptPerOrder.getDataTable({
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
                    showRows: $scope.paging.showRows,
                };
            }, function(error) {
                console.log(error);
            });
        }
        //签收
        $scope.receiptOrder= function () {
            if(confirm('确定签收吗?')){
                var ids='';
                angular.forEach($scope.result, function (item) {
                    if (item.pl4GridCheckbox.checked) {
                        ids+=item.taskId+',';
                    }
                });
                if(ids!=''){
                	  ids=ids.substr(0,ids.length-1);
                	  var promise = receiptPerOrder.receiptOrder('/personalOrder/OrderconfirmReturn', {
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
                }else {
                    alert('请勾选后再进行签收!');
                    return false;
                }
            }
        }
        //拒收
        $scope.refuseOrder=function(i,item){
            $rootScope.taskId=item.taskId;
            $scope.newCar.paySideModel=2;
        }
        //拒收确定
        $scope.confirmrefuseOrder= function () {
        	if($scope.newCar.refuseReasonModel===-1){
        		alert("请选择拒收原因！");
        		return false;
        	}

            if($scope.newCar.paySideModel===-1){
                alert("请选择运费付费方！");
                return false;
            }
            if($scope.newCar.payTypeModel===-1){
                alert("请选择结算方式！");
                return false;
            }
            var opts = angular.extend({}, $scope.newCar, {}); //克隆出新的对象，防止影响scope中的对象
            opts.taskId=$rootScope.taskId;
            receiptPerOrder.refuseOrder({
                    param: {
                        "query":opts
                    }
                },'/personalOrder/OrderconfirmRefuse')
                .then(function (data) {
                    alert(data.status.msg)
                    if(data.status.code=="0000") {
                        $("#refuseOrder").modal("hide");
                        get();
                    }
                }, function (error) {
                    console.log(error)
                });
        }
        //半签半退
        $scope.halfRefuseOrder=function(i,item){
            $rootScope.taskId=item.taskId;
            $rootScope.acceGoodCount=item.acceGoodCount;
            $scope.newCar.paySideModel=-1;
        }
        //半签半退确定
        $scope.confirmHalfRefuseOrder= function (i,item) {
            if($scope.newCar.refuseReasonModel===-1){
                alert("请选择拒收原因！");
                return false;
            }
            if(!!$scope.newCar.returnNumber){

            }else {
                alert("请输入退货件数！");
                return false;
            }
            if($scope.newCar.returnNumber>$rootScope.acceGoodCount){
                alert("退货件数不得大于原单件数！");
                return false;
            }
            if($scope.newCar.paySideModel===-1){
                alert("请选择运费付费方！");
                return false;
            }
            if($scope.newCar.payTypeModel===-1){
                alert("请选择结算方式！");
                return false;
            }
            var opts = angular.extend({}, $scope.newCar, {}); //克隆出新的对象，防止影响scope中的对象
            opts.taskId=$rootScope.taskId;
            receiptPerOrder.halfRefuseOrder({
                    param: {
                        "query":opts
                    }
                },'/personalOrder/OrderconfirmHalfRefuse')
                .then(function (data) {
                    alert(data.status.msg)
                    if(data.status.code=="0000") {
                        $("#halfRefuseOrder").modal("hide");
                        get();
                    }
                }, function (error) {
                    console.log(error)
                });
        }
        //获取tskid
        $scope.obtainTaskid=function(i,item){
            $rootScope.taskId=item.taskId;
        }
        //再派
        $scope.confirmSendOrder= function (i,item) {
                receiptPerOrder.halfRefuseOrder({
                        param: {
                            "query":{
                                "taskId":$rootScope.taskId
                            }
                        }
                    },'/personalOrder/againDelivery')
                    .then(function (data) {
                        if(data.status.code=="0000") {
                            alert(data.status.msg);
                            $("#sendOrder").modal("hide");
                            get();
                        }
                    }, function (error) {
                        console.log(error)
                    });
        }
        //修改modal
        $scope.newIndentModel={
            chuHuoName: '',
            chuHTel:'',
            chuHAdd: '',
            chuHuoSheng: '',
            chuHuoShi: '',
            chuHuoXian: '',
            receiverName: '',
            receTel: '',
            receiverSheng: '',
            receiverShi: '',
            receiverXian: '',
            receAdd: '',
            acceGoodCount: '',
            realpay:'',
            weight: '',
            size: '',
            realcollectMoney: '',
            fee: '',
            offerMoney: '',
            insuranceMoney: '',
            paySide: '',
            payType: '',
            remarks: '',
        }
        //select的切换隐藏
        $scope.isShow=false;
        $scope.isShow2=true;
        $scope.tebSelect= function () {
            $scope.newIndentModel.payType='1';
            if($scope.newIndentModel.paySide=="2"){
                $scope.isShow=true;
                $scope.isShow2=false;
            }else if($scope.newIndentModel.paySide=="1"){
                $scope.isShow=false;
                $scope.isShow2=true;
            }
        }
        //修改
        $scope.updateOrder= function () {
            receiptPerOrder.halfRefuseOrder({param: {query: {
                    taskId:$rootScope.taskId
                }}},'/personalOrder/toUpdatePersonalOrder')
                .then(function (data) {
                    alert(data.status.msg);
                    $('#compileData').modal('hide');
                    get();
                },function (error) {
                    console.log(error);
                });
        }

        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
    }])
});