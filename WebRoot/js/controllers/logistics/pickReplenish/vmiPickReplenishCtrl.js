/**
 * author wusheng.xu
 * date 16/4/15
 */
define(['../../../app', '../../../services/logistics/pickReplenish/vmiPickReplenishService'], function(app) {
     var app = angular.module('app');      var app = angular.module('app');     app.controller('vmiPickReplenishCtrl', ['$rootScope', '$scope', '$state', '$sce', '$window', 'vmiPickReplenish', function ($rootScope, $scope, $state, $sce, $window, vmiPickReplenish) {
        // query moudle setting
        $scope.querySeting = {
            items: [{
                type: 'text',
                model: 'taskId',
                title: '业务单号'
            }, {
                type: 'date',
                model: ['startTime', 'endTime'],
                title: '订单日期'
            }, {
                type: 'select',
                model: 'printState',
                selectedModel: 'printStateSelect',
                title: '状态'
            }],
            btns: [{
                text: $sce.trustAsHtml('查询'),
                click: 'searchClick'
            }]
        };

        //table头
        $scope.thHeader = vmiPickReplenish.getThead();
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
        var pmsSearch = vmiPickReplenish.getSearch();
        pmsSearch.then(function (data) {
            $scope.searchModel = data.query; //设置当前作用域的查询对象
            $scope.searchModel.printStateSelect = parseInt(data.query.selectedPrintState);
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
                showRows: $scope.paging.showRows,
            };
            get();
            $scope.searchModel.taskId = '';
        }
        //任务类型 下拉框change
        $scope.orderTypeIdChange = function () {
            //  console.log($scope.searchModel.orderTypeIdSelect)
        }

        function get() {
            //获取选中 设置对象参数
            var opts = angular.extend({}, $scope.searchModel, {}); //克隆出新的对象，防止影响scope中的对象
            opts.printState = $scope.searchModel.printStateSelect;
            opts.page = $scope.paging.currentPage;
            opts.pageSize = $scope.paging.showRows;
            var promise = vmiPickReplenish.getDataTable('/returnPickQuery/queryVMIReturnPick', {
                param: {query: opts}
            });
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
        //打印
        $scope.print= function (i,item) {
            var ids=item?item.taskId:'';
            if(!item) {
                //获取选中
                angular.forEach($scope.result, function (item) {
                    if (item.pl4GridCheckbox.checked) {
                        ids += item.taskId + ',';
                    }
                });
            }
            if(ids!='') {
                if(!item)
                    ids = ids.slice(0, ids.length - 1);
                $window.open("/print/vmiPick.html?tokenId="+$rootScope.userInfo.token+"&sessionid="+$rootScope.userInfo.sessionId+"&taskIds="+ids);
                $('#enterPrint').modal('show');
                $scope.printFlag = ids;
            }else {
                alert('请选择!');
            }
        }
        $scope.printConfirm = function(){
            var printConfirmPromise = vmiPick.getDataTable('/returnPickQuery/updatePrintStatus',{
                param: {
                    query:{
                        taskIds: $scope.printFlag
                    }
                }
            });
            printConfirmPromise.then(function(data){
                if(data.code != 0){
                    alert(data.message);
                    $('#enterPrint').modal('hide');
                }else{
                    get();
                    $('#enterPrint').modal('hide');
                }
            })

        }
    }]);
});