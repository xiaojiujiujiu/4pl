/**
 * Created by hui.sun on 15/12/13.
 */
'use strict';
define(['../../../app', '../../../services/storage/storage/confirmationService'], function (app) {
     var app = angular.module('app');
    app.controller('confirmationCtrl', ['$scope', '$state', '$stateParams', '$sce', 'confirmation','$window', function ($scope, $state, $stateParams, $sce, confirmation,$window) {
        $scope.banner = {};
        $scope.pageModel = {
            sku: ''
        }
        //table头
        $scope.thHeader = confirmation.getThead();

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
        //查询
        $scope.searchClick = function () {
            //设置默认第一页
            $scope.paging = {
                totalPage: 1,
                currentPage: 1,
                showRows: $scope.paging.showRows,
            };
            get();
        }
        $scope.skuKeyUp = function () {
            var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/g;
            $scope.pageModel.sku = $scope.pageModel.sku.replace(reg, '');
        }
        get();


        function get() {
            //获取选中 设置对象参数
            var opts = {
                taskId: $stateParams['taskId'],
                sku: $scope.pageModel.sku
            }
            var promise = confirmation.getDataTable({param: {query: opts}});
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
                $scope.banner = data.banner;
                $scope.query = data.query;
                $scope.banner.taskId = opts.taskId;
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

        $scope.remarksBlur = function (cont) {
            alert(cont)
        }


        //商品上架跳转
        $scope.goItemUpShelf = function () {
            $state.go('main.itemupshelf', {});
        }
        //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓以下是设置货位数据配置↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
        //配置下拉框 注（返回的数据必须也绑定到此对象上 如：$scope.goodsAlloSelectSet.select1={...}）
        $scope.goodsAlloSelectSet = [];
        $scope.goodsAlloSelectSet.ngHide = true;//窗口控制显示隐藏

        //实收数量blur事件
        $scope.origGoodCountBlur = function (item) {
            //console.log(item);
        }
        //选择货位数据                        *******************需要配置
        $scope.goodsAllocationHeader = [
            {field: 'pl4GridCount', name: '#', type: 'pl4GridCount'},
            {
                field: 'huoWeiNo',
                name: '货位编号',
                input: true,
                type: 'update',
                style: 'width:210px;',
                onclick: 'goodsNumClick',
            },
            //{field: 'batchNo', name: '批号', type: 'text'},
            //{field: 'chuhGoodCount', name: '应上数量', type: 'text'},
            {
                field: 'putCount',
                name: '实上数量',
                input: true,
                type: 'update',
                pl4DataType: 'number',
                blur: 'addAlloPutCountBlur',
                verify: {min: 0},
                style: 'width:100px;'
            },
            {
                type: 'goodsAlloOperate',//货位操作按钮类型 不用修改
                name: '操作', style: 'width:85px;',
                buttons: [{text: '修改', call: 'updateGoodsAllo', type: 'link', style: 'font-size:10px;'}, {
                    text: '删除',
                    call: 'delGoodsAllo',
                    type: 'link',
                    style: 'font-size:10px;'
                }]
            },
        ];
        //应上架数量
        $scope.shouldCount = null;
        //选择的行货位
        var goodsAlloOldRowItem = null, goodsAlloOldEnter = [], goodsAlloOldRowItemIndex = 0;
        //设置货位事件
        $scope.goodsAlloCall = function (i, item) {
            $scope.shouldCount = parseInt(item.chuhGoodCount);
            confirmation.getDataTable({
                    param: {
                        query: {
                            id: item.id,
                            sku: item.sku,
                            taskId: item.taskId,
                            ckId: item.ckId
                        }
                    }
                }, '/ckTaskPut/setUpHuoWei')
                .then(function (data) {
                    if (data.code != -1) {
                        $scope.goodsAlloSelectSet = [];
                        goodsAlloOldRowItemIndex = i;
                        goodsAlloOldRowItem = item;
                        //设置货位表数据
                        //$scope.goodsAllocation = goodsAlloOldEnter.length > 1 ? goodsAlloOldEnter : new Array(angular.extend({},item,{}));
                        $scope.goodsAllocation = data.grid;
                        //设置第一行删除按钮取消显示
                        $scope.goodsAllocation[0]['goodsAlloOperateShow1'] = true;
                        $scope.goodsAlloSelectSet.ngHide = false;
                        _initSelectCall();
                    }
                }, function () {
                });

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
                        {id: 1,  name: '存储区'},
                        {id: 2,  name: '打包区'},
                        {id: 3,  name: '收货区'},
                        {id: 5,  name: '出库区'}
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
                    var promise = confirmation.getDataTable({param: {query: {areaId: $scope.goodsAlloSelectSet.select1Model}}}, '/ckTaskPut/getSubAreaId');
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
                    var promise = confirmation.getDataTable({param: {query: {subAreaId: $scope.goodsAlloSelectSet.select2Model,areaId: $scope.goodsAlloSelectSet.select1Model}}}, '/ckTaskPut/gethuoWeiNo');
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
                if (checkSetAlloRepeat(value)) {
                    goodsNumCallBack(value);
                    //清空下拉框
                    $scope.goodsAlloSelectSet = [];
                }
            }

        }

        //修改事件
        $scope.updateGoodsAllo = function (index, item) {
            item['pl4gridUpdate' + index] = true;
        }
        //货位删除事件
        $scope.delGoodsAllo = function (index, item) {
            var del_goodsAllocation = $scope.goodsAllocation[index];
            $scope.goodsAllocation.splice(index, 1);
            setusCount();
            /* console.log(del_goodsAllocation.chuhGoodCount+'  '+del_goodsAllocation.putCount)
             if(del_goodsAllocation.chuhGoodCount>=del_goodsAllocation.putCount) {
             var prev = $scope.goodsAllocation[index - 1];
             console.log(prev.chuhGoodCount+'  '+prev.putCount)
             prev.chuhGoodCount =parseInt(prev.chuhGoodCount)+ parseInt(del_goodsAllocation.chuhGoodCount);
             prev.putCount =parseInt(prev.putCount)+ parseInt(del_goodsAllocation.putCount);
             }*/
        }
        //数量字段配置 与选择货位数据中数量的字段相同         *******************需要配置
        var goodsAlloNumSet = 'chuhGoodCount', //应上架数量
            ls_upShelf = [];//待上架
        //添加货位
        $scope.addAllo = function () {
            var total=0;
            angular.forEach($scope.goodsAllocation, function (item) {
                total+=parseInt(item.putCount);
            })
            var ysCount=$scope.shouldCount-total;
            if(ysCount>0) {
                var addAlloRow = {huoWeiNo: '', putCount: $scope.shouldCount - total};
                $scope.goodsAllocation.push(addAlloRow);
            }else {
                alert('没有更多数量可上架,请修改实上数量!');
                return false;
            }
            /*angular.forEach($scope.goodsAllocationHeader, function (item) {
                addAlloRow['huoWeiNo'] = '';
                addAlloRow['putCount'] = 0;
                /!*for (var key in item) {
                 console.log(typeof goodsAlloOldRowItem[item[key]] === 'object')
                 if (typeof goodsAlloOldRowItem[item[key]] === 'string') {
                 addAlloRow[item[key]] = '';
                 } /!*else if (typeof goodsAlloOldRowItem[item[key]] === 'object' && goodsAlloOldRowItem[item[key]]['type'] == 'num') {
                 addAlloRow[item[key]] = angular.extend({}, {}, goodsAlloOldRowItem[item[key]]);
                 addAlloRow[item[key]]['value'] = 0;
                 }*!/ else if (typeof goodsAlloOldRowItem[item[key]] === 'number') {
                 addAlloRow[item[key]] = 0;
                 }
                 }*!/
            });*/
           /* var vNum = typeof goodsAlloOldRowItem[goodsAlloNumSet] === 'object' ? goodsAlloOldRowItem[goodsAlloNumSet].value : goodsAlloOldRowItem[goodsAlloNumSet];
            //设置应上数量
            addAlloRow[goodsAlloNumSet] = vNum - usCount;

            $scope.goodsAllocation.push(addAlloRow);*/
            var len = $scope.goodsAllocation.length;
            $scope.goodsAllocation[len - 1]['pl4gridUpdate' + (len - 1)] = true;
        }
        var checkSetAlloRepeat = function (val) {
            var isChecked = true;
            angular.forEach($scope.goodsAllocation, function (item, i) {
                if (val == item['huoWeiNo']) {
                    alert('该货位已设置!');
                    isChecked = false;
                    return false;
                }
            });
            return isChecked;
        }
        //验证实上数量
        var checkUpShelfCount = function () {
            var total = 0, isPass = false;ls_upShelf=[];
            angular.forEach($scope.goodsAllocation, function (item, i) {
                total += parseInt(item.putCount);
                if (total > $scope.shouldCount) {
                    alert('实上数量总数不能大于应上数量!');
                    isPass = true;
                    return false;
                }
                if(item.huoWeiNo===''||item.putCount===''){
                    alert('请填写完整!');
                    isPass = true;
                    return false;
                }
                item['pl4gridUpdate' + i] = false;
                ls_upShelf.push(angular.extend({}, goodsAlloOldRowItem, item));
            });
            if(total<$scope.shouldCount){
                alert('实上数量总数没有满足应上数量,请继续添加货位!');
                isPass=true;
            }
            return !isPass;
            /*var usCount= 0,
             vNum = typeof goodsAlloOldRowItem[goodsAlloNumSet] === 'object' ? goodsAlloOldRowItem[goodsAlloNumSet].value : goodsAlloOldRowItem[goodsAlloNumSet];

             ls_upShelf=[];
             angular.forEach($scope.goodsAllocation, function (item, i) {
             for (var j = 0; j < $scope.goodsAllocationHeader.length; j++) {
             if (item[$scope.goodsAllocationHeader[j]['field']]&&item[$scope.goodsAllocationHeader[j]['field']] === '') {
             alert('请填写完整！');
             usCount=0;
             return false;
             }else if(item[$scope.goodsAllocationHeader[j]['field']]&&item[$scope.goodsAllocationHeader[j]['field']] <= 0){
             alert('数量需大于0！');
             usCount=0;
             return false;
             }
             }
             if(item['putCount']<=0){
             alert('实上数量应大于0!');
             usCount=0;
             return false;
             }else if(item['putCount']>item[goodsAlloNumSet]){
             alert('实上数量不能大于应上数量!');
             usCount=0;
             return false;
             }else {
             usCount+=parseInt(item['putCount']);
             if(i>0){
             item[goodsAlloNumSet]=vNum-$scope.goodsAllocation[i-1]['putCount'];
             vNum-=$scope.goodsAllocation[i-1]['putCount'];
             }
             ls_upShelf.push(angular.extend({}, goodsAlloOldRowItem, item));
             }
             /!*item[goodsAlloNumSet]=item['putCount'];
             item['pl4gridUpdate' + i] = false;
             ls_upShelf.push(angular.extend({}, goodsAlloOldRowItem, item));
             if(item['putCount']<=0){
             alert('实上数量应大于0!');
             usCount=0;
             return false;
             }else if(item['putCount']>item[goodsAlloNumSet]){
             alert('实上数量不能大于应上数量!');
             usCount=0;
             return false;
             }else {
             usCount+=parseInt(item['putCount']);
             item[goodsAlloNumSet]=item['putCount'];
             item['pl4gridUpdate' + i] = false;
             ls_upShelf.push(angular.extend({}, goodsAlloOldRowItem, item));
             }
             *!/
             });*/
            return usCount;
        }
        //设置上架总数量
        var setusCount = function () {
            var usCount = 0,
                vNum = typeof goodsAlloOldRowItem[goodsAlloNumSet] === 'object' ? goodsAlloOldRowItem[goodsAlloNumSet].value : goodsAlloOldRowItem[goodsAlloNumSet];

            angular.forEach($scope.goodsAllocation, function (item, i) {
                usCount += parseInt(item['putCount']);
                if (i > 0) {
                    item[goodsAlloNumSet] = vNum - $scope.goodsAllocation[i - 1]['putCount'];
                    vNum -= $scope.goodsAllocation[i - 1]['putCount'];
                }
                if ($scope.goodsAllocation.length == 1)
                    item[goodsAlloNumSet] = vNum;
            });

        }
        //实上数量blur回调
        $scope.addAlloPutCountBlur = function (item, i, k, checked) {
            //checkUpShelfCount();
            /*if(checked) {
             setusCount();
             }*/
        }
        //确定货位  参数 回调通知指令确定完成
        $scope.enterAllo = function (back) {
            if (!confirm('确认设置此货位？')) return false;
            var totalNum = 0, isRtn = true, vNum = typeof goodsAlloOldRowItem[goodsAlloNumSet] === 'object' ? goodsAlloOldRowItem[goodsAlloNumSet].value : goodsAlloOldRowItem[goodsAlloNumSet];
            if (!checkUpShelfCount()){
                return false;
            }
                //if ($scope.goodsAlloSelectSet.select2Model == -1 || $scope.goodsAlloSelectSet.select1Model == -1 || $scope.goodsAlloSelectSet.select3Model == -1) {
                //    alert('请输入完整的货位信息!');
                //    return false;
                //}


            /*totalNum=checkUpShelfCount();
             if(!totalNum)
             return false;
             if(vNum-totalNum!=0){
             alert('实上数量总数未满足应上数量 '+vNum+' 请重新调整!');
             return false;
             }*/
            if (ls_upShelf.length == 0) return false;
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
                    id: ls_upShelf[0].id,
                    chuhGoodCount: ls_upShelf[0].chuhGoodCount,
                    huoWeiNo: ls_upShelf[0].huoWeiNo,
                    putCount: ls_upShelf[0].putCount,
                    customerID: ls_upShelf[0].customerID,
                    ckId: ls_upShelf[0].ckId,
                    batchNo: ls_upShelf[0].batchNo,
                    sku: ls_upShelf[0].sku,
                    taskId: ls_upShelf[0].taskId
                },
                grid: []
            }
            angular.forEach(ls_upShelf, function (item) {
                opts.grid.push({
                    id: item.id,
                    chuhGoodCount: item.chuhGoodCount,
                    batchNo: item.batchNo,
                    sku: item.sku,
                    putCount: item.putCount,
                    goodsCount: item.putCount,
                    newHuoWeiNo: item.huoWeiNo,
                    huoWeiNo: item.defHuoWeiNo
                });
            });
            var promise = confirmation.getDataTable({param: opts}, '/ckTaskPut/saveHuoWeiNo');
            promise.then(function (data) {
                alert(data.status.msg);
                if (data.status.code == "0000") {
                    back();
                    get();
                }
            }, function (error) {
                console.log(error);
            });
        }
        //确定设置货位 旧方法
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
                            //goodsCount: item.putCount,
                            newHuoWeiNo: item.huoWeiNo,
                            huoWeiNo: item.defHuoWeiNo
                        });
                    });
                    var promise = confirmation.getDataTable({param: opts}, '/ckGoodsDefLocation/saveHuoWeiNo');
                    promise.then(function (data) {
                        if (data.code == 0) {

                        }
                    }, function (error) {
                        console.log(error);
                    });
                }
            }
        }

        //上架完成
        $scope.putGoodsDown = function () {
            if (confirm('确定上架？')) {
                var takeGoodsDowns = [], isRet = false;
                angular.forEach($scope.result, function (item, i) {
                    if (isRet) return false;
                    if (item.pl4GridCheckbox.checked) {
                        if (item.inCount == 0) {
                            item.inCount = item.count;
                        }
                        if (!item.huoWeiNo || item.huoWeiNo == '') {
                            item['directPut']=1;
                            if(!item.defHuoWeiNo||item.defHuoWeiNo == '') {
//                                alert('第' + (i + 1) + '行当前货位不能为空，请先设置当前货位或初始化默认货位数据');
                            	alert("默认货位不能为空，请先点击'设置货位'按钮，设置货位");
                                isRet = true;
                                return false;
                            }
                        }
                        takeGoodsDowns.push(item);
                    }
                });
                if (isRet) return false;
                if (takeGoodsDowns.length == 0) {
                    alert('请选择需要上架的商品！');
                    return;
                }
                var opts = {
                    banner: {taskId: $scope.banner.taskId},
                    grid: takeGoodsDowns
                }
                var promise = confirmation.getDataTable({param: opts}, '/ckTaskPut/ckTaskPutDetailSuccess');
                promise.then(function (data) {
                    if (data.status.code == "0000") {
                        get();
                    }
                    alert(data.status.msg);

                }, function (error) {
                    console.log(error);
                });
            }
        }
        //返回
        $scope.back= function () {
            $window.history.back();
        }
    }])
});