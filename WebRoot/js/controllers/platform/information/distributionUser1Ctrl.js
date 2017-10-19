/**
 * Created by xiaojiu on 2016/11/21.
 */
define(['../../../app','../../../services/platform/information/distributionUser1Service','../../../services/uploadFileService', '../../../services/addressLinkageService'], function (app) {
    var app = angular.module('app');
    app.controller('distributionUser1Ctrl', ['$rootScope', '$scope', '$state', '$sce', '$filter', 'HOST', '$window','distributionUser1','uploadFileService','addressLinkage',
        function ($rootScope, $scope, $state, $sce, $filter, HOST, $window, distributionUser1,uploadFileService,addressLinkage) {
            // query moudle setting
            $scope.querySeting = {
                items: [{
                    type: 'text',
                    model: 'userName',
                    title: '发件方名称',
                    autocomplete: 'userName',
                    autoCallback: 'userNameAutocomplete',
                    automodel: 'goodsId'
                }, {
                    type: 'text',
                    model: 'tel',
                    title: '手机号码'
                },  {
                    type: 'select',
                    model: 'cooperationState',
                    selectedModel: 'cooperationStateSelect',
                    title: '合作状态'
                }, {
                    type: 'date',
                    model: ['startTime', 'endTime'],
                    title: '创建时间'
                },{
                    type: 'text',
                    model: 'address',
                    title: '发件方地址'
                },{
                    type: 'text',
                    model: 'senderNumber',
                    title: '发件方编号'
                }],
                btns: [{
                    text: $sce.trustAsHtml('查询'),
                    click: 'searchClick'
                }]
            };
            //table头
            $scope.thHeader = distributionUser1.getThead();

            //定义添加modal
            $scope.addModel = {
                province: [],
                city: [{id: '-1', name: '全部'}],
                county: [{id: '-1', name: '全部'}],
                userName: '',
                senderNumber: '',
                shareAddress: '',
                shareAllAddress: '',
                id:'',
                tel: '',
                address: '',
                freightdiscount: '',
                collectionRate: '',
                receiptsCarriage: '',
                premiumRate: '',
                cooperationState:{
                    id:"-1",
                    select:[]
                }
            }

            //初始化修改model数据
            distributionUser1.getDataTable('/distributionUser/getDicLists', {param:{}})
                .then(function (data) {
                    $scope.addModel.cooperationState.select=data.query.cooperationState;
                    $scope.addModel.shareAddress=data.query.shareAddress;
                    $scope.addModel.collectionRate=data.query.collectionRate;
                    $scope.addModel.collectTimeliness=data.query.collectTimeliness;
                })



            // 确认编辑
            $scope.enterAdd = function () {
                var opts = angular.extend({},  $scope.addModel, {});//克隆出新的对象，防止影响scope中的对象
                opts.jointShareSheng='';
                opts.jointShareShi='';
                opts.jointShareXian='';
                opts.cooperationState=$scope.addModel.cooperationState.id;
                if(!!$scope.cleanRuleModel){
                    opts.jointShareSheng+=$scope.cleanRuleModel.depProvince?$scope.cleanRuleModel.depProvince+',':'';
                    opts.jointShareShi+=$scope.city ?$scope.city+',':'';
                    opts.jointShareXian+=$scope.area ?$scope.area +',':'';
                    opts.jointShareSheng+=$scope.cleanRuleModel.depProvince1 ?$scope.cleanRuleModel.depProvince1  +',':'';
                    opts.jointShareShi+=$scope.city1?$scope.city1+',':'';
                    opts.jointShareXian+=$scope.area1?$scope.area1+',':'';
                    opts.jointShareSheng+=$scope.cleanRuleModel.depProvince2?$scope.cleanRuleModel.depProvince2:'';
                    opts.jointShareShi+=$scope.city2?$scope.city2+',':'';
                    opts.jointShareXian+=$scope.area2?$scope.area2:'';
                }else {
                    opts.jointShareSheng='';
                    opts.jointShareShi='';
                    opts.jointShareXian='';
                }


                var sendParams = {
                    param: {
                        query:opts
                    }
                }
                distributionUser1.getDataTable('/distributionUser/updateDistributionUser', sendParams)
                    .then(function (data) {
                        alert(data.status.msg)
                        if (data.status.code == "0000") {
                            $('#workLogModal').modal('hide');
                            get();
                        }
                    })
            }
            //编辑
            $scope.updateGift= function (i,item) {
                $scope.giftTtle = "编辑发件方信息";
                distributionUser1.getDataTable('/distributionUser/initDistributionUser', {param: {query: {id: item.id}}})
                    .then(function (data) {
                        $scope.addModel.id= data.query.userInfo.id;
                        $scope.addModel.userName=data.query.userInfo.userName;
                        $scope.addModel.tel=data.query.userInfo.tel;
                        $scope.addModel.address=data.query.userInfo.address;
                        $scope.addModel.shareAddress=data.query.userInfo.shareAddress;
                        $scope.addModel.shareAllAddress=data.query.userInfo.shareAllAddress;
                        $scope.addModel.freightdiscount=data.query.userInfo.freightdiscount;
                        $scope.addModel.collectionRate=data.query.userInfo.collectionRate;
                        $scope.addModel.premiumRate=data.query.userInfo.premiumRate;
                        $scope.addModel.cooperationState.id=data.query.userInfo.cooperationState;
                        $scope.addModel.provinceSelected=item.provinceId;
                        $scope.addModel.senderNumber=item.senderNumber;
                        $scope.addModel.collectTimeliness=item.collectTimeliness;
                    })

            }

            //新增共享区域下拉
            //初始化实体对象
            function cleanRuleModel(){
                // 省内容
                $scope.depProvince = {
                    id : -1,
                    select : [],
                    itemId:0
                }
                $scope.depProvince1 = {
                    id : -1,
                    select : [],
                    itemId:1
                }
                $scope.depProvince2 = {
                    id : -1,
                    select : [],
                    itemId:2
                }
                // 市内容
                $scope.depCity = {
                    id : -1,
                    select : []
                }
                $scope.depCity1 = {
                    id : -1,
                    select : []
                }
                $scope.depCity2 = {
                    id : -1,
                    select : []
                }
                // 区内容
                $scope.depArea = {
                    id : -1,
                    select : []
                }
                $scope.depArea1 = {
                    id : -1,
                    select : []
                }
                $scope.depArea2 = {
                    id : -1,
                    select : []
                }
                //初始化市
                result = [];
                num;
                cityStr = '';
                $scope.city = '';
                $scope.city1 = '';
                $scope.city2 = '';
                //初始化区
                result2 = [];
                num2;
                areaStr = '';
                $scope.area = '';
                $scope.area1 = '';
                $scope.area2 = '';
            }
            //获取省数据
            function getProvince(){

                // 获取选中 设置对象参数
                var opts = angular.extend({},$scope.searchModel, {}); // 克隆出新的对象，防止影响scope中的对象
                opts.isAllFlag=2;
                opts.parentId=0;
                $scope.exParams = $filter('json')({
                    query : opts
                });
                var promise = distributionUser1.getDataTable(
                    '/areaInfo/getAreaInfoList',
                    {param : {query : opts}});
                promise.then(function(data) {
                        if (data.code == -1) {
                            alert(data.message);
                            return false;
                        }
                        $scope.depProvince.select=data.query.areaInfo;
                        $scope.depProvince1.select=data.query.areaInfo;
                        $scope.depProvince2.select=data.query.areaInfo;
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
            function getCity(parentId,item,itemId){
                // 获取选中 设置对象参数
                var opts = angular.extend({},$scope.searchModel, {}); // 克隆出新的对象，防止影响scope中的对象
                opts.parentId=parentId;
                $scope.exParams = $filter('json')({
                    query : opts
                });
                var promise = distributionUser1.getDataTable('/areaInfo/getAreaInfoList',
                    {param : {query : opts}
                    });
                promise.then(function(data) {
                        if (data.code == -1) {
                            alert(data.message);
                            return false;
                        }
                       if(itemId==0){
                           $scope.depCity.select=[];
                       }else if(itemId==1){
                           $scope.depCity1.select=[];
                       }else if(itemId==2){
                           $scope.depCity2.select=[];
                       }

                        angular.forEach(data.query.areaInfo, function (dc) {
                            if(itemId==0){
                                $scope.depCity.select.push({id:dc.id,name:dc.name,checked:false});
                            }else if(itemId==1){
                                $scope.depCity1.select.push({id:dc.id,name:dc.name,checked:false});
                            }else if(itemId==2){
                                $scope.depCity2.select.push({id:dc.id,name:dc.name,checked:false});
                            }

                        })
                        // 区内容
                        $scope.depArea = {
                            id : -1,
                            select : []
                        }
                    },
                    function(error) {
                        console.log(error);
                    });
            }
            //删除区域
            function removeArea(parentId,itemId){
                // 获取选中 设置对象参数
                var opts = angular.extend({},$scope.searchModel, {}); // 克隆出新的对象，防止影响scope中的对象
                opts.parentId=parentId;
                $scope.exParams = $filter('json')({
                    query : opts
                });
                var promise = distributionUser1.getDataTable('/areaInfo/getAreaInfoList',
                    {param : {query : opts}
                    });
                promise.then(function(data) {
                        if (data.code == -1) {
                            alert(data.message);
                            return false;
                        }
                        var arr1=[];
                    if(itemId==0){
                        arr1 = $scope.depArea.select;
                    }else if(itemId==1){
                        arr1 = $scope.depArea1.select;
                    }else if(itemId==2){
                        arr1 = $scope.depArea2.select;
                    }
                        var arr2=data.query.areaInfo;
                        for(var i=0;i<arr1.length;i++){
                            for(var j=0;j<arr2.length;j++){
                                if(arr1[i]!=null &&  arr2[j] !=null && arr1[i].id==arr2[j].id){
                                    arr1.splice(i--,1);
                                    if((num2 = result2.indexOf(arr2[j].name))>-1){
                                        result2.splice(num2, 1);
                                    }

                                }
                            }
                        }
                        areaStr = result2.join(',');
                        if(itemId==0){
                            $scope.area = areaStr;
                        }else if(itemId==1){
                            $scope.area1 = areaStr;
                        }else if(itemId==2){
                            $scope.area2 = areaStr;
                        }




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
            function getArea(parentId,itemId){

                // 获取选中 设置对象参数
                var opts = angular.extend({},$scope.searchModel, {}); // 克隆出新的对象，防止影响scope中的对象
                opts.parentId=parentId;
                $scope.exParams = $filter('json')({
                    query : opts
                });
                var promise = distributionUser1.getDataTable('/areaInfo/getAreaInfoList',
                    {param : {query : opts}
                    });
                promise.then(function(data) {
                        if (data.code == -1) {
                            alert(data.message);
                            return false;
                        }
                        angular.forEach(data.query.areaInfo, function (dc) {
                            if(itemId==0){
                                $scope.depArea.select.push({id:dc.id,name:dc.name,checked:false});
                            }else if(itemId==1){
                                $scope.depArea1.select.push({id:dc.id,name:dc.name,checked:false});
                            }else if(itemId==2){
                                $scope.depArea2.select.push({id:dc.id,name:dc.name,checked:false});
                            }

                        })
                    },
                    function(error) {
                        console.log(error);
                    });
            }
            //根据省联动市
            $scope.changeCity=function(itemId){
                if(itemId==0){
                    getCity($scope.cleanRuleModel.depProvince,"",itemId);
                    $scope.city="";
                    $scope.area="";
                }else if(itemId==1){
                    getCity($scope.cleanRuleModel.depProvince1,"",itemId);
                    $scope.city1="";
                    $scope.area1="";
                }else if(itemId==2){
                    getCity($scope.cleanRuleModel.depProvince2,"",itemId);
                    $scope.city2="";
                    $scope.area2="";
                }

            }
            //市的显示隐藏
            $scope.cityShow={show: false};
            $scope.cityShow1={show: false};
            $scope.cityShow2={show: false};
            $scope.toggleCity=function(itemId){
                if(itemId==0){
                    $scope.cityShow.show=!$scope.cityShow.show;
                }else if(itemId==1){
                    $scope.cityShow1.show=!$scope.cityShow1.show;
                }else if(itemId==2){
                    $scope.cityShow2.show=!$scope.cityShow2.show;
                }



            }
            $scope.multipleAddConfirm=function(itemId){
                if(itemId==0){
                    $scope.cityShow={show: false};
                    return
                }else if(itemId==1){
                    $scope.cityShow1={show: false};
                    return
                }else if(itemId==2){
                    $scope.cityShow2={show: false};
                    return
                }

            }
            //区的显示隐藏
            $scope.areaShow={show: false};
            $scope.areaShow1={show: false};
            $scope.areaShow2={show: false};
            $scope.toggleArea=function(itemId){
                if(itemId==0){
                    $scope.areaShow.show=!$scope.areaShow.show;
                    return
                }else if(itemId==1){
                    $scope.areaShow1.show=!$scope.areaShow1.show;
                    return
                }else if(itemId==2){
                    $scope.areaShow2.show=!$scope.areaShow2.show;
                    return
                }
            }
            $scope.depAreaAddConfirm=function(itemId){
                if(itemId==0){
                    $scope.areaShow={show: false};
                    return
                }else if(itemId==1){
                    $scope.areaShow1={show: false};
                    return
                }else if(itemId==2){
                    $scope.areaShow2={show: false};
                    return
                }

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
            var areaArr = [];
            var areaArr1 = [];
            var areaArr2 = [];
            $scope.addArea=function(obj,itemId){
                obj.checked=!obj.checked;
                if(obj.checked){
                    if(itemId==0){
                        areaArr.push(obj.name);
                    }else if(itemId==1){
                        areaArr1.push(obj.name);
                    }else if(itemId==2){
                        areaArr2.push(obj.name);
                    }
                    //result2.push(obj.name);
                }else{
                    if(itemId==0){
                        num2 = areaArr.indexOf(obj.name);
                        areaArr.splice(num2, 1);
                    }else if(itemId==1){
                        num2 = areaArr1.indexOf(obj.name);
                        areaArr1.splice(num2, 1);
                    }else if(itemId==2){
                        num2 = areaArr2.indexOf(obj.name);
                        areaArr2.splice(num2, 1);
                    }
                }
                if(itemId==0){
                    areaStr = areaArr.join(',');
                }else if(itemId==1){
                    areaStr = areaArr1.join(',');
                }else if(itemId==2){
                    areaStr = areaArr2.join(',');
                }
                if(itemId==0){
                    $scope.area = areaStr;
                }else if(itemId==1){
                    $scope.area1 = areaStr;
                }else if(itemId==2){
                    $scope.area2 = areaStr;
                }

            }

            //根据市联动区域
            var cityArr = [];
            var cityArr1 = [];
            var cityArr2 = [];
            $scope.changeArea=function(obj,itemId){

                obj.checked=!obj.checked;

                if(obj.checked){
                    if(itemId==0){
                        cityArr.push(obj.name);
                    }else if(itemId==1){
                        cityArr1.push(obj.name);
                    }else if(itemId==2){
                        cityArr2.push(obj.name);
                    }
                    getArea(obj.id,itemId);
                }else{
                    if(itemId==0){
                        num = cityArr.indexOf(obj.name);
                        cityArr.splice(num, 1);
                    }else if(itemId==1){
                        num = cityArr1.indexOf(obj.name);
                        cityArr1.splice(num, 1);
                    }else if(itemId==2){
                        num = cityArr2.indexOf(obj.name);
                        cityArr2.splice(num, 1);
                    }

                    removeArea(obj.id,itemId);
                }
                if(itemId==0){
                    cityStr = cityArr.join(',');
                }else if(itemId==1){
                    cityStr = cityArr1.join(',');
                }else if(itemId==2){
                    cityStr = cityArr2.join(',');
                }

                if(itemId==0){
                    $scope.city = cityStr;
                }else if(itemId==1){
                    $scope.city1 = cityStr;
                }else if(itemId==2){
                    $scope.city2 = cityStr;
                }


            }
            //新增共享区域
            cleanRuleModel();
            getProvince();
            $scope.listArr=[false,false,false];
            var thisListNumber=0;
            $scope.addList=function(){
                if(thisListNumber >=3){
                    console.log('最多只能追加三条信息');
                    return false;
                }else{
                    thisListNumber=thisListNumber+1;
                    $scope.listArr[thisListNumber]=true;
                }
            }
            //删除共享区域
            $scope.delectAddress=function(){
                $scope.addModel.shareAllAddress='';
            }
            //分页下拉框

            $scope.pagingSelect = [
                {value: 5, text: 5},
                {value: 10, text: 10, selected: true},
                {value: 20, text: 20},
                {value: 30, text: 30},
                {value: 50, text: 50}
            ];
            //分页对象
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: 30,
            };
            var pmsSearch = distributionUser1.getSearch();
            pmsSearch.then(function (data) {
                $scope.searchModel = data.query; //设置当前作用域的查询对象
                $scope.searchModel.cooperationStateSelect = "-1";
                $scope.storageRDC = data.query.rdcId;
                $scope.storageCDC = data.query.cdcId;
                $scope.storageSelectedRDC = '-1';
                $scope.labelName = '配送选择';
                //获取table数据
                get();
            }, function (error) {
                console.log(error)
            });

            //查询
            $scope.searchClick = function () {
                $scope.paging = {
                    totalPage: 1,
                    currentPage: 1,
                    showRows: $scope.paging.showRows
                };
                get();
            }
            $scope.exParams = '';
            function get() {
                //获取选中 设置对象参数
                var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
                opts.cooperationState = $scope.searchModel.cooperationStateSelect;
                opts.rdcId = $scope.storageSelectedRDC;//获取仓储选择第一个下拉框
                opts.cdcId = $scope.storageSelectedCDC;//获取仓储选择第二个下拉框
                opts.pageNo = $scope.paging.currentPage;
                opts.pageSize = $scope.paging.showRows;
                $scope.exParams = $filter('json')({query: opts});
                var promise = distributionUser1.getDataTable(
                    '/distributionUser/getDistributionUserListByParty',
                    {
                        param: {
                            query: opts
                        }
                    }
                );
                promise.then(function (data) {

                    $scope.result = data.grid;
                    $scope.paging = {
                        totalPage: data.total,
                        currentPage: $scope.paging.currentPage,
                        showRows: $scope.paging.showRows,
                    };;
                }, function (error) {
                    console.log(error);
                });
            }
            //导入
            $scope.isShow=true;
            $scope.impUploadFiles= function (files) {
                if(files.length==0) return false;
                //多文件上传
                var count=0;
                function upFiles(){
                    uploadFileService.upload('/distributionUser/importDistributionUser',files[count],function(evt){
                        //进度回调
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        $scope.impUploadFilesProgress=evt.config.data.file.name+'的进度:'+progressPercentage+'%';
                    }).then(function (resp) {
                        //上传成功
                        $scope.impUploadFilesProgress='上传完成!';
                        get();
                        alert( resp.data.status.msg);
                        count++;
                        $timeout(function(){
                            $scope.isShow = false;
                        },3000);
                        if(files.length>count)
                            upFiles();
                    });

                }
                upFiles();

            }
            //分页跳转回调
            $scope.goToPage = function () {
                get();
            }
            //设置回款时效
            $scope.ids=''
            $scope.dataSetUp=function(){
                angular.forEach($scope.result,function(k){
                    if(k.pl4GridCheckbox.checked){
                        $scope.ids+= k.id+','
                    }
                })
                if($scope.ids!='') {
                    $scope.ids =  $scope.ids.slice(0, $scope.ids.length - 1);
                    $("#dataSetUp").modal("show");
                }else {
                    alert("请选择需要设置回款时效的数据!");
                }
            }
            //确认设置回款时效
            $scope.dataSetUpConfirm=function(){
                var opts = {};
                opts.ids= $scope.ids;
                opts.receiptsCarriage=$scope.addModel.receiptsCarriage;
                opts.collectionRate=$scope.addModel.collectionRate;
                distributionUser1.getDataTable(
                    '/distributionUser/updateTimeliness',
                    {
                        param: {
                            query: opts
                        }
                    }
                ).then(function(data){
                    $scope.ids=''
                    if(data.status.code=="0000"){
                        alert(data.status.msg);
                        $("#dataSetUp").modal("hide");
                        get();
                    }
                })
            }
            $scope.deleteData=function(){
                $scope.ids=''
                $scope.addModel.receiptsCarriage='';
                $scope.addModel.collectionRate='';
            }
            $scope.dropDownList = [];
            $scope.userNameAutocomplete= function (newValue) {
                var opts = angular.extend({}, $scope.searchModel, {});
                opts.userName=newValue;
                opts.cooperationState = $scope.searchModel.cooperationStateSelect;
                return distributionUser1.autoCompletion({
                    param: {
                        query: opts
                    }
                });
            };
        }])
});