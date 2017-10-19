/**
 * Created by xuwusheng on 15/12/11.
 */
define(['../../../app','../../../services/storage/goods-allocation/defaultGoodsAlloService','../../../services/uploadFileService'], function (app) {
     var app = angular.module('app');
    app.controller('defaultGoodsAlloCtrl', ['$scope','$sce','$timeout','defaultGoodsAllo','uploadFileService','Upload', function ($scope,$sce,$timeout,defaultGoodsAllo,uploadFileService,Upload) {

    	
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'select',
                model: 'customerID',
                selectedModel: 'customerIDSelect',
                title: '客户'
            }, {
                type: 'text',
                model: 'goodsType',
                //selectedModel: 'goodsTypeSelect',
                title: '商品品类'
            }, {
                type: 'text',
                model: 'goodsName',
                title: '商品名称'
            }, {
                type: 'text',
                model: 'sku',
                title: '商品编码'
            } ,{
                type: 'text',
                model: 'factoryCode',
                title: '出厂编码'
            }, {
                type: 'select',
                model: 'areaId',
                selectedModel: 'areaIdSelect',
                title: '货区选择'
            },{
                type: 'text',
                model: 'supliers',
                title: '供应商'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };
        //theadr
        $scope.thHeader=defaultGoodsAllo.getThead();
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
        var pmsQuery=defaultGoodsAllo.getQuery();
        pmsQuery.then(function (data) {
            $scope.searchModel = data.query.query;//设置当前作用域的查询对象
            //下拉框model
            $scope.searchModel.customerIDSelect = -1;
            $scope.searchModel.areaIdSelect = -1;
            //$scope.searchModel.goodsTypeSelect = -1;
            //获取table数据
            get();
        }, function (error) {
            console.log(error)
        });
        //查询
        $scope.searchClick= function () {
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows
            };
            get();
        }
        $scope.impGoodsAlloUploadProgress='';
        //导入货位信息 文件上传
        $scope.impGoodsAlloUploadFiles= function (files) {
            if(files.length==0) return false;
            //多文件上传
            var count=0;
            function upFiles(){
                uploadFileService.upload('/ckGoodsDefLocation/upload',files[count],function(evt){
                    //进度回调
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.impGoodsAlloUploadProgress=evt.config.data.file.name+'的进度:'+progressPercentage+'%';
                }).then(function (resp) {
                    //上传成功
                    $scope.impGoodsAlloUploadProgress='上传完成!';
                    get();
                    count++;
                    if(files.length>count)
                        upFiles();
                });
            }
            upFiles();
        }
        $scope.exGoodsAlloParam={};
        function get(){
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {});//克隆出新的对象，防止影响scope中的对象
            opts.customerID = $scope.searchModel.customerIDSelect;
            //opts.goodsType = $scope.searchModel.goodsTypeSelect;
            opts.areaId = $scope.searchModel.areaIdSelect;
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            $scope.exGoodsAlloParam={query:opts};
            var promise = defaultGoodsAllo.getDataTable({param: {query:opts}});
            promise.then(function (data) {
                if(data.code==-1){
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
                //重置paging 解决分页指令不能监听对象问题
                $scope.paging = {
                 totalPage: data.total,
                 currentPage: $scope.paging.currentPage,
                 showRows: $scope.paging.showRows,
                 };
            }, function (error) {
                console.log(error);
            });
            $scope.tackGoods = function (obj) {
            }
        }
        //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓以下是设置货位数据配置↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        //配置下拉框 注（返回的数据必须也绑定到此对象上 如：$scope.goodsAlloSelectSet.select1={...}）
        $scope.goodsAlloSelectSet = [];
        $scope.goodsAlloSelectSet.ngHide = true;//窗口控制显示隐藏

        //实收数量blur事件
        $scope.origGoodCountBlur = function (item) {
           // console.log(item);
        }
        //选择货位数据                        *******************需要配置
        $scope.goodsAllocationHeader = [
            {field: 'pl4GridCount', name: '#', type: 'pl4GridCount'},
            {
                field: 'huoWeiNo',
                name: '货位编号',
                input: true,
                type: 'update',
                onclick: 'goodsNumClick',
                style: 'width:78%;'
            },
            //{field: 'goodsCount', name: '数量', input: true, type: 'update', style: 'width:50px;'},
            {
                type: 'goodsAlloOperate',//货位操作按钮类型 不用修改
                name: '操作',
                buttons: [{text: '修改', call: 'updateGoodsAllo', type: 'link', style: 'font-size:10px;'}, {
                    text: '删除',
                    call: 'delGoodsAllo',
                    type: 'link',
                    style: 'font-size:10px;'
                }]
            },
        ];
        //选择的行货位
        var goodsAlloOldRowItem = null, goodsAlloOldEnter = [], goodsAlloOldRowItemIndex = 0;
        //设置货位事件
        $scope.goodsAlloCall = function (i, item) {
            $scope.goodsAlloSelectSet = [];
            goodsAlloOldRowItemIndex = i;
            goodsAlloOldRowItem = item;
            //设置货位表数据
            $scope.goodsAllocation = goodsAlloOldEnter.length > 1 ? goodsAlloOldEnter : new Array(item
                //{orderTypeName:item.orderTypeName,origGoodCount:typeof item.origGoodCount==='object'?item.origGoodCount.value:item.origGoodCount}
            );
            //设置第一行删除按钮取消显示
            $scope.goodsAllocation[0]['goodsAlloOperateShow1'] = true;
            $scope.goodsAlloSelectSet.ngHide = false;
            _initSelectCall();
        }
        //第一个下拉框配置
        var gaSet1 = {model: 'select1', selectModel: 'select1Model', changeCallBack: 'select1Call'};
        //第二个下拉框配置
        var gaSet2 = {model: 'select2', selectModel: 'select2Model', changeCallBack: 'select2Call'};
        //第三个下拉框配置
        var gaSet3 = {model: 'select3', selectModel: 'select3Model', changeCallBack: 'select3Call'};

        var goodsNumCallBack;//选择货位编号回调

        $scope.goodsNumClick = function (i, j, item, colnName) {
            if (item['pl4gridUpdate' + i] || item[colnName] == '') {
                if ($scope.goodsAlloSelectSet.length == 0) {
                    $scope.goodsAlloSelectSet.push(gaSet1);
                    //select1 模拟请求到第一个下拉框数据         *******************需要修改
                    $scope.goodsAlloSelectSet.select1 = [
                        {id: -1, name: '请选择'},
                        {id: 1, name: '存储区'},
                        {id: 2, name: '打包区'},
                        {id: 3, name: '收货区'},
                        {id: 5, name: '出货区'}
                    ];
                    $scope.goodsAlloSelectSet.select1Model = -1;
                    _initSelectCall();
                }
                goodsNumCallBack = function (val) {
                    item[colnName] = val;
                    item['pl4gridUpdate' + i] = true;
                }
            }
        }
        function _initSelectCall() {
            //第一级下拉框 change事件
            $scope.goodsAlloSelectSet.select1Call = function () {
                if ($scope.goodsAlloSelectSet.select1Model != -1) {
                    //select2 模拟请求到第二个下拉框数据         *******************需要修改
                    /*$scope.goodsAlloSelectSet.select2 = [
                     {Id: -1, name: '全部'},
                     {Id: 1, name: 'A'},
                     {Id: 2, name: 'B'}
                     ];*/
                    var promise = defaultGoodsAllo.getDataTable({param: {query: {areaId: $scope.goodsAlloSelectSet.select1Model}}}, '/ckTaskPut/getSubAreaId');
                    promise.then(function (data) {
                        $scope.goodsAlloSelectSet.select2 = data.query.subAreaId;
                        $scope.goodsAlloSelectSet.select2.splice(0, 0, {id: -1, name: '请选择'});
                        $scope.goodsAlloSelectSet.select2Model = -1;
                        var setIndexOf = $scope.goodsAlloSelectSet.indexOf(gaSet2);
                        if (setIndexOf == -1)
                            $scope.goodsAlloSelectSet.push(gaSet2);

                    }, function (error) {
                        console.log(error);
                    });
                } else {
                    $scope.goodsAlloSelectSet.splice(1, 2);
                }

            }
            //第二级下拉框  change事件
            $scope.goodsAlloSelectSet.select2Call = function () {
                //select3 模拟请求到第三个下拉框数据         *******************需要修改
                /*$scope.goodsAlloSelectSet.select3 = [
                 {Id: -1, name: '全部'},
                 {Id: 1, name: 'AH-B-02'},
                 {Id: 2, name: 'BJ-A-01'}
                 ];*/
                var setIndexOf = 0;
                if ($scope.goodsAlloSelectSet.select2Model != -1) {
                    var promise = defaultGoodsAllo.getDataTable({param: {query: {subAreaId: $scope.goodsAlloSelectSet.select2Model,areaId:$scope.goodsAlloSelectSet.select1Model}}}, '/ckTaskPut/gethuoWeiNo');
                    promise.then(function (data) {
                        $scope.goodsAlloSelectSet.select3 = data.query.huoWeiNo;
                        $scope.goodsAlloSelectSet.select3.splice(0, 0, {id: -1, name: '请选择'});
                        $scope.goodsAlloSelectSet.select3Model = -1;
                        setIndexOf = $scope.goodsAlloSelectSet.indexOf(gaSet3);
                        if (setIndexOf == -1)
                            $scope.goodsAlloSelectSet.push(gaSet3);
                    }, function (error) {
                        console.log(error);
                    });

                } else {
                    $scope.goodsAlloSelectSet.splice(2, 1);
                }
            }
            //第三级下拉  change事件
            $scope.goodsAlloSelectSet.select3Call = function () {
                var value = '';
                angular.forEach($scope.goodsAlloSelectSet.select3, function (item) {
                    if (item.id == $scope.goodsAlloSelectSet.select3Model) {
                        value = item.name;
                        return false;
                    }
                });
                goodsNumCallBack(value);
                //清空下拉框
                $scope.goodsAlloSelectSet = [];
            }

        }

        //修改事件
        $scope.updateGoodsAllo = function (index, item) {
            item['pl4gridUpdate' + index] = true;
        }
        //货位删除事件
        $scope.delGoodsAllo = function (index, item) {
            $scope.goodsAllocation.splice(index, 1);
        }
        //添加货位
        $scope.addAllo = function () {
            var addAlloRow = {};
            angular.forEach($scope.goodsAllocationHeader, function (item) {
                for (var key in item) {
                    if (typeof goodsAlloOldRowItem[item[key]] === 'string') {
                        addAlloRow[item[key]] = '';
                    } else if (typeof goodsAlloOldRowItem[item[key]] === 'object' && goodsAlloOldRowItem[item[key]]['type'] == 'num') {
                        addAlloRow[item[key]] = angular.extend({}, {}, goodsAlloOldRowItem[item[key]]);
                        addAlloRow[item[key]]['value'] = 0;
                    } else if (typeof goodsAlloOldRowItem[item[key]] === 'number') {
                        addAlloRow[item[key]] = 0;
                    }
                }
            });
            $scope.goodsAllocation.push(addAlloRow);
            var len = $scope.goodsAllocation.length;
            $scope.goodsAllocation[len - 1]['pl4gridUpdate' + (len - 1)] = true;
        }
        //数量字段配置 与选择货位数据中数量的字段相同         *******************需要配置
        var goodsAlloNumSet = 'origGoodCount';
        //确定货位  参数 回调通知指令确定完成
        $scope.enterAllo = function (back) {
            var ls = [], totalNum = 0, isRtn = true, vNum = typeof goodsAlloOldRowItem[goodsAlloNumSet] === 'object' ? goodsAlloOldRowItem[goodsAlloNumSet].max : goodsAlloOldRowItem[goodsAlloNumSet];
            angular.forEach($scope.goodsAllocation, function (item, i) {
                for (var j = 0; j < $scope.goodsAllocationHeader.length; j++) {
                    if (item[$scope.goodsAllocationHeader[i]['field']] == '') {
                        alert('请填写完整！');
                        isRtn = false;
                        return false;
                    }
                }
                if (typeof goodsAlloOldRowItem[goodsAlloNumSet] === 'object') {
                    if (item[goodsAlloNumSet].value < item[goodsAlloNumSet]['min']) {
                        item['input' + i + '-2'] = true;
                        isRtn = false;
                        return false;
                    }
                    item[goodsAlloNumSet].value = parseInt(item[goodsAlloNumSet].value);
                    totalNum += item[goodsAlloNumSet].value;
                } else
                    item[goodsAlloNumSet] = parseInt(item[goodsAlloNumSet]);

                item['pl4gridUpdate' + i] = false;
                ls.push(angular.extend({}, goodsAlloOldRowItem, item));
            });
            if (!isRtn)
                return false;
            //总数量大于实际数量
            if (totalNum > vNum) {
                alert('货位总量大于实际数量，请重新调整！');
                return false;
            }
            //$scope.result.splice(goodsAlloOldRowItemIndex, 1);
            //angular.forEach($scope.result, function (item, i) {
            //    if (item['pl4GridGoodsAlloAdds'])
            //        $scope.result.splice(i, 1);
            //});
            //angular.forEach(ls, function (item, i) {
            //    if (i > 0) {
            //        item['pl4GridGoodsAlloAdds'] = true;
            //        item.op = [];//取消追加货位按钮功能
            //    }
            //    $scope.result.splice(goodsAlloOldRowItemIndex + i, 0, item);
            //});
            //$scope.goodsAlloSelectSet.ngHide = true;
            //goodsAlloOldEnter = ls;
            ////保存货位信息
            //$scope.result[goodsAlloOldRowItemIndex]['pl4GridGoodsAlloSave'] = ls;
            var opts = {
                banner: {
                    id: ls[0].id,
                    customerID: ls[0].customerID,
                    ckId: ls[0].ckId,
                    batchNo: ls[0].batchNo,
                    sku: ls[0].sku
                },
                grid: []
            }
            angular.forEach(ls, function (item) {
                opts.grid.push({
                    //goodsCount: item.goodsCount,
                    newHuoWeiNo: item.huoWeiNo,
                    huoWeiNo: item.defHuoWeiNo
                });
            });
            var promise = defaultGoodsAllo.getDataTable({param: opts}, '/ckGoodsDefLocation/saveHuoWeiNo');
            promise.then(function (data) {
                if(data.status.code=="0000"){
                    alert(data.status.msg);
                    back();
                    get();
                }
            }, function (error) {
                console.log(error);
            });
        }
        //确定设置货位  旧方法
        $scope.enterGoodsAllo = function (index, item) {
            if (confirm('确认设置此货位？')) {

                //获取到设置的货位数据
                var goodsAlloItems = item['pl4GridGoodsAlloSave'] || new Array(item);
                if (goodsAlloItems.length > 0) {
                    var opts = {
                        banner: {
                            id: goodsAlloItems[0].id,
                            customerID: goodsAlloItems[0].customerID,
                            ckId: goodsAlloItems[0].ckId,
                            batchNo: goodsAlloItems[0].batchNo,
                            sku: goodsAlloItems[0].sku
                        },
                        grid: []
                    }
                    angular.forEach(goodsAlloItems, function (item) {
                        opts.grid.push({
                            goodsCount: item.putCount,
                            newHuoWeiNo: item.huoWeiNo,
                            huoWeiNo: item.defHuoWeiNo
                        });
                    });
                    var promise = defaultGoodsAllo.getDataTable({param: opts}, '/ckGoodsDefLocation/saveHuoWeiNo');
                    promise.then(function (data) {
                        if(data.code==0){

                        }
                    }, function (error) {
                        console.log(error);
                    });
                }
            }
        }

        //上架完成
        $scope.putGoodsDown= function () {
            if(confirm('确定上架？')) {
                var takeGoodsDowns = [];
                angular.forEach($scope.result, function (item) {
                    if (item.pl4GridCheckbox.checked) {
                        if (item.inCount == 0) {
                            item.inCount = item.count;
                        }
                        takeGoodsDowns.push(item);
                    }
                });
                if (takeGoodsDowns.length == 0) {
                    alert('请选择！')
                    return;
                }
                var opts = {
                    banner: {taskId: $scope.banner.taskId},
                    grid: takeGoodsDowns
                }
                var promise = defaultGoodsAllo.getDataTable({param: opts}, '/ckTaskPut/ckTaskPutDetailSuccess');
                promise.then(function (data) {
                    if(data.code==0){
                        get();
                    }else{
                        alert(data.message);
                    }
                }, function (error) {
                    console.log(error);
                });
            }
        }
        $scope.goToPage= function () {
            get();
        }
    }]);
});