/**
 * Created by hui.sun on 15/12/13.
 */
'use strict';
define(['../../../app', '../../../services/logistics/lineManage/lineManageService'], function(app) {
     var app = angular.module('app');
    app.controller('lineManageCtrl', ['$scope', '$state', '$sce','$timeout', 'lineManage', function($scope, $state, $sce,$timeout, lineManage) {
        $scope.addLineTitle='新增线路';
        //机构名称
        $scope.wlDept={
            select:{},
            id:'-1'
        };
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'lineId',
                title: '线路编号'
            }, {
                type: 'text',
                model: 'lineName',
                title: '线路名称'
            }, {
                type: 'select',
                model: 'tranMode',
                selectedModel: 'tranModeSelect',
                title: '运输方式'
            }, {
                type: 'select',
                model: 'tranType',
                selectedModel: 'tranTypeSelect',
                title: '线路类型'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //table头
        $scope.thHeader = lineManage.getThead();
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
        $scope.ifShowSelect=true;
        var pmsSearch = lineManage.getSearch();
        pmsSearch.then(function(data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.wlDept.select=data.query.wlDeptId;
            if($scope.wlDept.select.length>1) {
                $scope.wlDept.id = data.query.wlDeptId[1].id;
            }
            $scope.searchModel.tranModeSelect = -1;
            $scope.searchModel.tranTypeSelect = -1;
                $scope.lineModel.tranModeSelect=$scope.searchModel.tranMode;
            $scope.lineModel.tranTypeSelect=$scope.searchModel.tranType;

            $scope.labelName = '配送选择';
            $scope.storageRDC = data.query.rdcId;
            $scope.storageCDC = data.query.cdcId;
            if(data.query.flag==1){
                $scope.ifShowSelect=false;
            }else {
                $scope.ifShowSelect=true;
            }
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
            //任务类型 下拉框change
        $scope.orderTypeIdChange = function() {
            //  console.log($scope.searchModel.orderTypeIdSelect)
        }

        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.wlDeptId=$scope.wlDept.id;
            opts.tranMode = $scope.searchModel.tranModeSelect;
            opts.tranType = $scope.searchModel.tranTypeSelect;
            delete opts.tranModeSelect;
            delete opts.tranTypeSelect;
            opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
            opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
            opts.pageNo = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = lineManage.getDataTable({
                param: {
                    query: opts
                }
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
        }
        //新增路线model
        $scope.lineModel={
            id:0,
            "wlDeptId":0,
            "lineId": "",
            "lineName":"",
            "deliveryFrequency":'',
            "garageAddressId":"",
            lineDescription:'',
            garageName:'',
            "tranMode":-1,
            "tranType":-1,
            "tranModeSelect":null,
            "tranTypeSelect":null,
            "remarks":""
        }
        $scope.lineShowPath=true;
        $scope.tranTypeSelectChange= function () {
            setLineShowPath();
        }
        function setLineShowPath(){
            $scope.lineShowPath=true;//
            angular.forEach($scope.lineModel.tranTypeSelect, function (item) {
                if(item.id==$scope.lineModel.tranType){
                    if(item.name=='支线'||item.name=='干线'){
                        $scope.lineShowPath=false;
                        return false
                    }
                }
            })
        }
        //新增路线
        $scope.addLine= function () {
            if($scope.lineModel.tranType==-1){
                alert('请选择路线类型!');
                return;
            }
            if($scope.lineModel.tranMode==-1){
                alert('请选择运输方式!');
                return;
            }
            var reg = new RegExp("^[0-9]*$");
        	if(!reg.test($scope.lineModel.deliveryFrequency)){
        		  alert("请输入正确的配送频率数字！")
          		return false;
        	}
            var postResult=angular.extend({},$scope.lineModel,{});
            delete postResult.tranModeSelect;
            delete postResult.tranTypeSelect;
            lineManage.getDataTable({
                param: {
                    query:postResult
                }
            },($scope.addLineTitle=='新增线路'?'/wlLine/addWlLine':'/wlLine/updateWlLine'))
                .then(function (data) {
                    alert(data.status.msg);
                    if(data.status.code=="0000"){
                        get();
                        $('#addLine').modal('hide');
                    }
                }, function (error) {
                    console.log(error)
                });
        }
        //修改
        $scope.updateLine= function (i,item) {
            $scope.linePathReadonly=true;
            salvageLineId=item.lineId;
            $scope.addLineTitle='修改线路';
            $scope.lineModel.id=item.id;
            $scope.lineModel.wlDeptId=$scope.wlDept.id;
            $scope.lineModel.lineId=item.lineId;
            $scope.lineModel.lineName=item.lineName;
            $scope.lineModel.deliveryFrequency=item.deliveryFrequency;
            $scope.lineModel.garageAddressId=item.garageAddressId;
            $scope.lineModel.garageName=item.garageName;
            $scope.lineModel.lineDescription=item.lineDescription;
            $scope.lineModel.remarks=item.remarks;
            $scope.lineShowPath=true;
            //设置选中线路类型
            angular.forEach($scope.lineModel.tranTypeSelect, function (k) {
                if(k.name==item.tranType) {
                    $scope.lineModel.tranType= k.id;
                    if(k.name=='支线'||k.name=='干线'){
                        $scope.lineShowPath=false;
                        return false
                    }
                    return false;
                }
            });
            //设置选中运输方式
            angular.forEach($scope.lineModel.tranModeSelect, function (k) {
                if(k.name==item.tranMode) {
                    $scope.lineModel.tranMode = k.id;
                    return false;
                }
            });


        }
        //查看
        $scope.queryLine= function (i,item) {
            $scope.linePathReadonly=true;
            salvageLineId=item.lineId;
            $scope.addLineTitle='查看线路';
            $scope.lineModel.id=item.id;
            $scope.lineModel.wlDeptId=$scope.wlDept.id;
            $scope.lineModel.lineId=item.lineId;
            $scope.lineModel.tranType=item.tranType;
            $scope.lineModel.tranMode=item.tranMode;
            $scope.lineModel.lineName=item.lineName;
            $scope.lineModel.deliveryFrequency=item.deliveryFrequency;
            $scope.lineModel.garageAddressId=item.garageAddressId;
            $scope.lineModel.garageName=item.garageName;
            $scope.lineModel.lineDescription=item.lineDescription;
            $scope.lineModel.remarks=item.remarks;
            $scope.lineShowPath=true;
        }
        //删除
        $scope.deleteLine= function (i,item) {
            if(confirm('确定要删除吗?')){
                lineManage.getDataTable({
                        param: {
                            "query":{
                                "wlDeptId": $scope.wlDept.id,
                                "lineId":item.lineId,
                                "id":item.id
                            }
                        }
                    },'/wlLine/delWlLine')
                    .then(function (data) {
                        alert(data.status.msg)
                        if(data.status.code=="0000") {
                            get();
                        }
                    }, function (error) {
                        console.log(error)
                    });
            }
        }
        $scope.btnAddLine= function () {
            $scope.addLineTitle='新增线路';
            $scope.lineModel.wlDeptId=$scope.wlDept.id;
            $scope.lineModel.lineId="";
            $scope.lineModel.lineName="";
            $scope.lineModel.deliveryFrequency="";
            $scope.lineModel.garageAddressId="";
            $scope.lineModel.garageName="";
            $scope.lineModel.tranType=-1;
            $scope.lineModel.tranMode=-1;
            $scope.lineModel.lineDescription = '';
            $scope.lineModel.remarks = '';
            $scope.lineModel.id = 0;
        }
        //线路路径focus
        $scope.linePathFocus= function () {
            getSalvage();
            if($scope.addLineTitle!='新增线路')
                getSalvageByupdata();
            $('#selectSalvage').modal();
        }
        //确认选择修理厂
        $scope.enterSalvage= function () {
            $scope.linePathReadonly=true;
            var str='',names='';
            angular.forEach($scope.salvageRightModel, function (item) {
                str+=item.garageId+',';
                names+=item.garageName+',';
            });
            if(str!='') {
                str = str.substr(0, str.length - 1);
            }
            $scope.lineModel.garageAddressId=str;
            if(names!='') {
                $scope.lineModel.garageName = names.substr(0, names.length - 1);
            }else
                $scope.lineModel.garageName='';
            $('#selectSalvage').modal('hide');
        }
        //修理厂table行点击
        $scope.salvageTableRowClick= function (item) {
            var isGarageId=false;
            angular.forEach($scope.salvageRightModel, function (k) {
                if(k.garageId== item.garageId){
                    isGarageId=true;
                    return false;
                }
            })
            if(!isGarageId){
                $scope.salvageRightModel.push(item);
            }
        }
        //修理厂地址搜索按钮
        $scope.salvageSearch= function () {
            getSalvage();
        }
        var salvageLineId=0;
        $scope.linePathReadonly=false;
        $scope.recAddressId='';//修理厂查询框
        $scope.salvageModel=[];//修理厂地址model
        $scope.salvageRightModel=[];//选中右侧model

        //查询修理厂地址
        function getSalvage(){
            var opt={
                param: {
                    "query":{
                        "wlDeptId": $scope.wlDept.id,
                        "recAddressId":$scope.recAddressId
                    }
                }
            };//'/wlLine/findGarage'
            lineManage.getDataTable(opt,'/wlLine/getGarages')
                .then(function (data) {
                    $scope.salvageModel=data.grid;
                    //设置右侧选择高度
                    $timeout(function () {
                        $('.rightSalvage').height($('.leftSalvage').height());
                    },300)
                }, function (error) {
                    console.log(error)
                });
        }
        function getSalvageByupdata(){
            var opt={
                param: {
                    "query":{
                        "wlDeptId": $scope.wlDept.id,
                        lineId:salvageLineId
                    }
                }
            };
            lineManage.getDataTable(opt,'/wlLine/findGarage')
                .then(function (data) {
                    $scope.salvageRightModel=data.grid;
                }, function (error) {
                    console.log(error)
                });
        }
        //删除选中的地址
        $scope.salvageClose= function (item) {
            $scope.salvageRightModel.splice($scope.salvageRightModel.indexOf(item),1);
        }
        //分页跳转回调
        $scope.goToPage = function() {
            get();
        }
    }])
});